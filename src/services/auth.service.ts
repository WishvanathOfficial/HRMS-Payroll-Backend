import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { User, Role, UserRole, Employee, sequelize } from '../models';
import { RoleName } from '../models/role';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export interface AuthenticatedUser {
    userId: number;
    employeeId: number | null;
    email: string;
    roles: RoleName[];
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

const signAccessToken = (payload: AuthenticatedUser): string =>
    jwt.sign(payload, env.auth.jwtSecret, { expiresIn: env.auth.jwtExpiresIn } as SignOptions);

const signRefreshToken = (payload: AuthenticatedUser): string =>
    jwt.sign(payload, env.auth.jwtRefreshSecret, { expiresIn: env.auth.jwtRefreshExpiresIn } as SignOptions);

const issueTokens = (user: AuthenticatedUser): AuthTokens => ({
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
});

const loadUserWithRoles = async (userId: number): Promise<AuthenticatedUser | null> => {
    const row = await User.scope('withPassword').findByPk(userId, {
        include: [{ association: 'roles', attributes: ['name'], through: { attributes: [] } }],
    });
    if (!row) return null;
    const roles = ((row.get('roles') as { name: RoleName }[] | undefined) || []).map((r) => r.name);
    return {
        userId: row.get('id') as number,
        employeeId: (row.get('employeeId') as number | null) ?? null,
        email: row.get('email') as string,
        roles,
    };
};

export const authService = {
    /** Validate credentials and return a fresh token pair + the authenticated user. */
    async login(email: string, password: string): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
        if (!email || !password) throw ApiError.badRequest('Email and password are required');

        const found = await User.scope('withPassword').findOne({
            where: { email },
            include: [{ association: 'roles', attributes: ['name'], through: { attributes: [] } }],
        });
        if (!found) throw ApiError.unauthorized('Invalid credentials');

        const isActive = found.get('isActive') as boolean;
        if (!isActive) throw ApiError.forbidden('User account is disabled');

        const hash = found.get('passwordHash') as string;
        const ok = await bcrypt.compare(password, hash);
        if (!ok) throw ApiError.unauthorized('Invalid credentials');

        await found.update({ lastLoginAt: new Date() } as never);

        const roles = ((found.get('roles') as { name: RoleName }[] | undefined) || []).map((r) => r.name);
        const user: AuthenticatedUser = {
            userId: found.get('id') as number,
            employeeId: (found.get('employeeId') as number | null) ?? null,
            email: found.get('email') as string,
            roles,
        };
        return { user, tokens: issueTokens(user) };
    },

    /** Verify a refresh token and mint a brand-new access+refresh pair. */
    async refresh(refreshToken: string): Promise<AuthTokens> {
        if (!refreshToken) throw ApiError.badRequest('refreshToken is required');
        let decoded: JwtPayload | string;
        try {
            decoded = jwt.verify(refreshToken, env.auth.jwtRefreshSecret);
        } catch {
            throw ApiError.unauthorized('Invalid or expired refresh token');
        }
        const userId = (decoded as JwtPayload).userId as number | undefined;
        if (!userId) throw ApiError.unauthorized('Invalid refresh token');
        const user = await loadUserWithRoles(userId);
        if (!user) throw ApiError.unauthorized('User no longer exists');
        return issueTokens(user);
    },

    /** Create a new login for an existing employee (admin-only). */
    async register(payload: { employeeId?: number | null; email: string; password: string; roles?: RoleName[] }) {
        if (!payload.email || !payload.password) throw ApiError.badRequest('email and password are required');

        return sequelize.transaction(async (transaction) => {
            if (payload.employeeId) {
                const emp = await Employee.findByPk(payload.employeeId, { transaction });
                if (!emp) throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
            }
            const dupe = await User.findOne({ where: { email: payload.email }, transaction });
            if (dupe) throw ApiError.conflict('Email already registered');

            const passwordHash = await bcrypt.hash(payload.password, env.auth.bcryptRounds);
            const created = await User.create(
                {
                    email: payload.email,
                    employeeId: payload.employeeId ?? null,
                    passwordHash,
                    isActive: true,
                } as never,
                { transaction },
            );
            const createdId = created.get('id') as number;

            // Default role = EMPLOYEE if none provided
            const wanted = payload.roles && payload.roles.length ? payload.roles : (['EMPLOYEE'] as RoleName[]);
            const roleRows = await Role.findAll({ where: { name: wanted }, transaction });
            await UserRole.bulkCreate(
                roleRows.map((r) => ({ userId: createdId, roleId: r.get('id') as number }) as never),
                { transaction },
            );

            return loadUserWithRoles(createdId);
        });
    },

    /** Return the current user record (without password hash). */
    async me(userId: number) {
        const user = await loadUserWithRoles(userId);
        if (!user) throw ApiError.notFound('User not found');
        return user;
    },

    /** Lets a user rotate their own password. */
    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        if (!oldPassword || !newPassword) throw ApiError.badRequest('oldPassword and newPassword are required');
        if (newPassword.length < 8) throw ApiError.badRequest('New password must be at least 8 characters');

        const row = await User.scope('withPassword').findByPk(userId);
        if (!row) throw ApiError.notFound('User not found');

        const ok = await bcrypt.compare(oldPassword, row.get('passwordHash') as string);
        if (!ok) throw ApiError.unauthorized('Current password is incorrect');

        const passwordHash = await bcrypt.hash(newPassword, env.auth.bcryptRounds);
        await row.update({ passwordHash } as never);
    },
};
