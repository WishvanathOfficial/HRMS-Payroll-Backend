import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { statutoryDeductionController } from '../controllers/statutoryDeduction.controller';

const router = Router();
router.get('/', catchAsync(statutoryDeductionController.list));
router.post('/', catchAsync(statutoryDeductionController.create));
router.get('/:id', numericParam(), catchAsync(statutoryDeductionController.getOne));
router.put('/:id', numericParam(), catchAsync(statutoryDeductionController.update));
router.delete('/:id', numericParam(), catchAsync(statutoryDeductionController.remove));

export default router;
