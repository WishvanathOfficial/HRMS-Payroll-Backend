import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { interviewStageController } from '../controllers/interviewStage.controller';

const router = Router();
router.get('/', catchAsync(interviewStageController.list));
router.post('/', catchAsync(interviewStageController.create));
router.get('/applicant/:applicantId', numericParam('applicantId'), catchAsync(interviewStageController.byApplicant));
router.get('/:id', numericParam(), catchAsync(interviewStageController.getOne));
router.put('/:id', numericParam(), catchAsync(interviewStageController.update));
router.delete('/:id', numericParam(), catchAsync(interviewStageController.remove));
router.post('/:id/result', numericParam(), catchAsync(interviewStageController.recordResult));

export default router;
