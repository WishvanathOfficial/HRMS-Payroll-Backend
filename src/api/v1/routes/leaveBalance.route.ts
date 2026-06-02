import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { leaveBalanceController } from '../controllers/leaveBalance.controller';

const router = Router();
router.get('/', catchAsync(leaveBalanceController.list));
router.post('/', catchAsync(leaveBalanceController.create));
router.get('/employee/:employeeId', numericParam('employeeId'), catchAsync(leaveBalanceController.byEmployee));
router.get('/:id', numericParam(), catchAsync(leaveBalanceController.getOne));
router.put('/:id', numericParam(), catchAsync(leaveBalanceController.update));
router.delete('/:id', numericParam(), catchAsync(leaveBalanceController.remove));

export default router;
