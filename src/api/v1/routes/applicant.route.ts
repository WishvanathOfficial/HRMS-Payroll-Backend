import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { applicantController } from '../controllers/applicant.controller';

const router = Router();
router.get('/', catchAsync(applicantController.list));
router.post('/', catchAsync(applicantController.create));
router.get('/:id', numericParam(), catchAsync(applicantController.getOne));
router.put('/:id', numericParam(), catchAsync(applicantController.update));
router.delete('/:id', numericParam(), catchAsync(applicantController.remove));
router.patch('/:id/status', numericParam(), catchAsync(applicantController.changeStatus));

export default router;
