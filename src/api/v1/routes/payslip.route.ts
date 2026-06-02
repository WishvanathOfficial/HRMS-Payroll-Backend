import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { payslipController } from '../controllers/payslip.controller';
import { payslipValidator } from '../validators/payroll.validator';

const router = Router();
router.get('/', validate({ query: payslipValidator.listQuery }), catchAsync(payslipController.list));
router.post('/', catchAsync(payslipController.create));
router.get('/employee/:employeeId', numericParam('employeeId'), catchAsync(payslipController.byEmployee));
router.get('/:id/detailed', numericParam(), catchAsync(payslipController.detailed));
router.get('/:id', numericParam(), catchAsync(payslipController.getOne));
router.put('/:id', numericParam(), catchAsync(payslipController.update));
router.delete('/:id', numericParam(), catchAsync(payslipController.remove));
router.post('/:id/mark-paid', numericParam(), catchAsync(payslipController.markPaid));

export default router;
