import { mockInstance, mockSequelize } from '../__tests__/helpers/sequelize';

jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: {
        compare: jest.fn(),
        hash: jest.fn(),
    },
}));

const scopedFindOne = jest.fn();
const scopedFindByPk = jest.fn();

jest.mock('../models', () => ({
    sequelize: mockSequelize(),
    User: {
        scope: jest.fn(() => ({
            findOne: scopedFindOne,
            findByPk: scopedFindByPk,
        })),
        create: jest.fn(),
        findOne: jest.fn(),
    },
    Role: {
        findAll: jest.fn(),
    },
    UserRole: {
        bulkCreate: jest.fn(),
    },
    Employee: {
        findByPk: jest.fn(),
    },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from './auth.service';
import { User, Role, UserRole, Employee } from '../models';
import { env } from '../config/env';

const Bcrypt = bcrypt as unknown as { compare: jest.Mock; hash: jest.Mock };
const U = User as unknown as { scope: jest.Mock; create: jest.Mock; findOne: jest.Mock };
const R = Role as unknown as { findAll: jest.Mock };
const UR = UserRole as unknown as { bulkCreate: jest.Mock };
const Emp = Employee as unknown as { findByPk: jest.Mock };

const instance = (overrides: Record<string, unknown> = {}) =>
    mockInstance({
        id: 1,
        employeeId: 2,
        email: 'a@b.com',
        passwordHash: 'hash',
        isActive: true,
        roles: [{ name: 'ADMIN' }],
        ...overrides,
    });

describe('authService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('login', () => {
        it('400s when email or password missing', async () => {
            await expect(authService.login('', '')).rejects.toMatchObject({ statusCode: 400 });
        });

        it('401s when user not found', async () => {
            scopedFindOne.mockResolvedValue(null);
            await expect(authService.login('a@b.com', 'x')).rejects.toMatchObject({ statusCode: 401 });
        });

        it('403s when user is disabled', async () => {
            scopedFindOne.mockResolvedValue(instance({ isActive: false }));
            await expect(authService.login('a@b.com', 'x')).rejects.toMatchObject({ statusCode: 403 });
        });

        it('401s when password is wrong', async () => {
            scopedFindOne.mockResolvedValue(instance());
            Bcrypt.compare.mockResolvedValue(false);
            await expect(authService.login('a@b.com', 'wrong')).rejects.toMatchObject({ statusCode: 401 });
        });

        it('returns user + tokens on success', async () => {
            const inst = instance();
            scopedFindOne.mockResolvedValue(inst);
            Bcrypt.compare.mockResolvedValue(true);

            const { user, tokens } = await authService.login('a@b.com', 'pw');

            expect(user).toEqual(
                expect.objectContaining({ userId: 1, employeeId: 2, email: 'a@b.com', roles: ['ADMIN'] }),
            );
            expect(tokens.accessToken).toBeTruthy();
            expect(tokens.refreshToken).toBeTruthy();
            expect(inst.update).toHaveBeenCalledWith(expect.objectContaining({ lastLoginAt: expect.any(Date) }));

            // verify accessToken decodes
            const decoded = jwt.verify(tokens.accessToken, env.auth.jwtSecret) as { userId: number };
            expect(decoded.userId).toBe(1);
        });
    });

    describe('refresh', () => {
        it('400s when refreshToken missing', async () => {
            await expect(authService.refresh('')).rejects.toMatchObject({ statusCode: 400 });
        });

        it('401s when token is invalid', async () => {
            await expect(authService.refresh('not-a-jwt')).rejects.toMatchObject({ statusCode: 401 });
        });

        it('issues fresh tokens on a valid refresh', async () => {
            const token = jwt.sign(
                { userId: 1, employeeId: 2, email: 'a@b.com', roles: ['ADMIN'] },
                env.auth.jwtRefreshSecret,
                { expiresIn: '1h' },
            );
            scopedFindByPk.mockResolvedValue(instance());
            const out = await authService.refresh(token);
            expect(out.accessToken).toBeTruthy();
            expect(out.refreshToken).toBeTruthy();
        });

        it('401s when the user no longer exists', async () => {
            const token = jwt.sign({ userId: 99 }, env.auth.jwtRefreshSecret, { expiresIn: '1h' });
            scopedFindByPk.mockResolvedValue(null);
            await expect(authService.refresh(token)).rejects.toMatchObject({ statusCode: 401 });
        });
    });

    describe('register', () => {
        it('400s when fields missing', async () => {
            await expect(authService.register({ email: '', password: '' } as never)).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it('400s when employeeId does not exist', async () => {
            Emp.findByPk.mockResolvedValue(null);
            await expect(
                authService.register({ email: 'a@b.com', password: 'pw12345!', employeeId: 99 }),
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('409s when email already used', async () => {
            U.findOne.mockResolvedValue({ id: 1 });
            await expect(authService.register({ email: 'a@b.com', password: 'pw12345!' })).rejects.toMatchObject({
                statusCode: 409,
            });
        });

        it('creates the user + default EMPLOYEE role', async () => {
            U.findOne.mockResolvedValue(null);
            Bcrypt.hash.mockResolvedValue('hashed');
            U.create.mockResolvedValue(mockInstance({ id: 10 }));
            R.findAll.mockResolvedValue([mockInstance({ id: 4, name: 'EMPLOYEE' })]);
            UR.bulkCreate.mockResolvedValue([]);
            scopedFindByPk.mockResolvedValue(instance({ id: 10, roles: [{ name: 'EMPLOYEE' }] }));

            const out = await authService.register({ email: 'a@b.com', password: 'pw12345!' });

            expect(U.create).toHaveBeenCalled();
            expect(UR.bulkCreate).toHaveBeenCalled();
            expect(out).toEqual(expect.objectContaining({ userId: 10, roles: ['EMPLOYEE'] }));
        });
    });

    describe('me', () => {
        it('404s when missing', async () => {
            scopedFindByPk.mockResolvedValue(null);
            await expect(authService.me(99)).rejects.toMatchObject({ statusCode: 404 });
        });

        it('returns the user', async () => {
            scopedFindByPk.mockResolvedValue(instance());
            const out = await authService.me(1);
            expect(out).toEqual(expect.objectContaining({ userId: 1 }));
        });
    });

    describe('changePassword', () => {
        it('400s when fields missing', async () => {
            await expect(authService.changePassword(1, '', '')).rejects.toMatchObject({ statusCode: 400 });
        });

        it('400s when new password is too short', async () => {
            await expect(authService.changePassword(1, 'a', 'short')).rejects.toMatchObject({ statusCode: 400 });
        });

        it('404s when user not found', async () => {
            scopedFindByPk.mockResolvedValue(null);
            await expect(authService.changePassword(1, 'old', 'newpassword12')).rejects.toMatchObject({
                statusCode: 404,
            });
        });

        it('401s when old password is wrong', async () => {
            scopedFindByPk.mockResolvedValue(instance());
            Bcrypt.compare.mockResolvedValue(false);
            await expect(authService.changePassword(1, 'old', 'newpassword12')).rejects.toMatchObject({
                statusCode: 401,
            });
        });

        it('updates the hash on success', async () => {
            const inst = instance();
            scopedFindByPk.mockResolvedValue(inst);
            Bcrypt.compare.mockResolvedValue(true);
            Bcrypt.hash.mockResolvedValue('newhash');

            await authService.changePassword(1, 'old', 'newpassword12');
            expect(inst.update).toHaveBeenCalledWith({ passwordHash: 'newhash' });
        });
    });
});
