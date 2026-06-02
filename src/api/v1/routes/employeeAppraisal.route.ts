import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { employeeAppraisalController } from '../controllers/employeeAppraisal.controller';

const router = Router();
router.get('/', catchAsync(employeeAppraisalController.list));
router.post('/', catchAsync(employeeAppraisalController.create));
router.get('/:id', numericParam(), catchAsync(employeeAppraisalController.getOne));
router.put('/:id', numericParam(), catchAsync(employeeAppraisalController.update));
router.delete('/:id', numericParam(), catchAsync(employeeAppraisalController.remove));
router.post('/:id/finalize', numericParam(), catchAsync(employeeAppraisalController.finalize));

export default router;
