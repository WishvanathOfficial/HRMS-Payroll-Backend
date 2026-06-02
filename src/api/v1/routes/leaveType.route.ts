import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { leaveTypeController } from '../controllers/leaveType.controller';
import { leaveTypeValidator } from '../validators/leave.validator';

const router = Router();
router.get('/', catchAsync(leaveTypeController.list));
router.post('/', validate({ body: leaveTypeValidator.create }), catchAsync(leaveTypeController.create));
router.get('/:id', numericParam(), catchAsync(leaveTypeController.getOne));
router.put(
    '/:id',
    numericParam(),
    validate({ body: leaveTypeValidator.update }),
    catchAsync(leaveTypeController.update),
);
router.delete('/:id', numericParam(), catchAsync(leaveTypeController.remove));

export default router;
