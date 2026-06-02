import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { salaryComponentController } from '../controllers/salaryComponent.controller';

const router = Router();
router.get('/', catchAsync(salaryComponentController.list));
router.post('/', catchAsync(salaryComponentController.create));
router.get('/:id', numericParam(), catchAsync(salaryComponentController.getOne));
router.put('/:id', numericParam(), catchAsync(salaryComponentController.update));
router.delete('/:id', numericParam(), catchAsync(salaryComponentController.remove));

export default router;
