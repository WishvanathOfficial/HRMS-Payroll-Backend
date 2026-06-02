import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { salaryStructureController } from '../controllers/salaryStructure.controller';

const router = Router();
router.get('/', catchAsync(salaryStructureController.list));
router.post('/', catchAsync(salaryStructureController.create));
router.get('/:id', numericParam(), catchAsync(salaryStructureController.getOne));
router.put('/:id', numericParam(), catchAsync(salaryStructureController.update));
router.delete('/:id', numericParam(), catchAsync(salaryStructureController.remove));
router.get('/:id/components', numericParam(), catchAsync(salaryStructureController.withComponents));

export default router;
