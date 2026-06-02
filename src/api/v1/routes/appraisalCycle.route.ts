import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { appraisalCycleController } from '../controllers/appraisalCycle.controller';

const router = Router();
router.get('/', catchAsync(appraisalCycleController.list));
router.post('/', catchAsync(appraisalCycleController.create));
router.get('/:id', numericParam(), catchAsync(appraisalCycleController.getOne));
router.put('/:id', numericParam(), catchAsync(appraisalCycleController.update));
router.delete('/:id', numericParam(), catchAsync(appraisalCycleController.remove));
router.get('/:id/appraisals', numericParam(), catchAsync(appraisalCycleController.appraisals));

export default router;
