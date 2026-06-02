import { Router } from 'express';
import { catchAsync, validate, authenticate, requireRoles } from '../../../middlewares';
import { authController } from '../controllers/auth.controller';
import { authValidator } from '../validators/auth.validator';

const router = Router();

// Open endpoints — these are the only routes a user can hit before logging in.
router.post('/login', validate({ body: authValidator.login }), catchAsync(authController.login));
router.post('/refresh', validate({ body: authValidator.refresh }), catchAsync(authController.refresh));

// Authenticated endpoints
router.get('/me', authenticate, catchAsync(authController.me));
router.post(
    '/change-password',
    authenticate,
    validate({ body: authValidator.changePassword }),
    catchAsync(authController.changePassword),
);
router.post('/logout', authenticate, catchAsync(authController.logout));

// Admin / HR-only endpoint to provision a login for an existing employee
router.post(
    '/register',
    authenticate,
    requireRoles('ADMIN', 'HR'),
    validate({ body: authValidator.register }),
    catchAsync(authController.register),
);

export default router;
