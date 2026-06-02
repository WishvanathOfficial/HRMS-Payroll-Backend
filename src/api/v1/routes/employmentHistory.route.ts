import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { employmentHistoryController } from '../controllers/employmentHistory.controller';

const router = Router();

router.get('/', catchAsync(employmentHistoryController.list));
router.post('/', catchAsync(employmentHistoryController.create));
router.get('/:id', numericParam(), catchAsync(employmentHistoryController.getOne));
router.put('/:id', numericParam(), catchAsync(employmentHistoryController.update));
router.delete('/:id', numericParam(), catchAsync(employmentHistoryController.remove));
router.get('/employee/:employeeId', numericParam('employeeId'), catchAsync(employmentHistoryController.byEmployee));

export default router;
