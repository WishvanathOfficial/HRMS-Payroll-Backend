import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { salaryStructureComponentController } from '../controllers/salaryStructureComponent.controller';

const router = Router();
router.get('/', catchAsync(salaryStructureComponentController.list));
router.post('/', catchAsync(salaryStructureComponentController.create));
router.get('/:id', numericParam(), catchAsync(salaryStructureComponentController.getOne));
router.put('/:id', numericParam(), catchAsync(salaryStructureComponentController.update));
router.delete('/:id', numericParam(), catchAsync(salaryStructureComponentController.remove));

export default router;
