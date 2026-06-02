import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { jobPostingController } from '../controllers/jobPosting.controller';

const router = Router();
router.get('/', catchAsync(jobPostingController.list));
router.get('/with-relations', catchAsync(jobPostingController.withRelations));
router.post('/', catchAsync(jobPostingController.create));
router.get('/:id', numericParam(), catchAsync(jobPostingController.getOne));
router.put('/:id', numericParam(), catchAsync(jobPostingController.update));
router.delete('/:id', numericParam(), catchAsync(jobPostingController.remove));
router.post('/:id/close', numericParam(), catchAsync(jobPostingController.close));
router.get('/:id/applicants', numericParam(), catchAsync(jobPostingController.applicants));

export default router;
