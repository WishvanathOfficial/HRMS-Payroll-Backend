import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { payrollRunController } from '../controllers/payrollRun.controller';
import { payrollRunValidator } from '../validators/payroll.validator';

const router = Router();
router.get('/', validate({ query: payrollRunValidator.listQuery }), catchAsync(payrollRunController.list));
router.post('/', validate({ body: payrollRunValidator.create }), catchAsync(payrollRunController.create));
router.get('/:id', numericParam(), catchAsync(payrollRunController.getOne));
router.put('/:id', numericParam(), catchAsync(payrollRunController.update));
router.delete('/:id', numericParam(), catchAsync(payrollRunController.remove));
router.post(
    '/:id/process',
    numericParam(),
    validate({ body: payrollRunValidator.process }),
    catchAsync(payrollRunController.process),
);
router.post('/:id/lock', numericParam(), catchAsync(payrollRunController.lock));

export default router;
