import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { shiftController } from '../controllers/shift.controller';

const router = Router();
router.get('/', catchAsync(shiftController.list));
router.post('/', catchAsync(shiftController.create));
router.get('/:id', numericParam(), catchAsync(shiftController.getOne));
router.put('/:id', numericParam(), catchAsync(shiftController.update));
router.delete('/:id', numericParam(), catchAsync(shiftController.remove));

export default router;
