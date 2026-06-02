import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { payslipDetailController } from '../controllers/payslipDetail.controller';

const router = Router();
router.get('/', catchAsync(payslipDetailController.list));
router.post('/', catchAsync(payslipDetailController.create));
router.get('/:id', numericParam(), catchAsync(payslipDetailController.getOne));
router.put('/:id', numericParam(), catchAsync(payslipDetailController.update));
router.delete('/:id', numericParam(), catchAsync(payslipDetailController.remove));

export default router;
