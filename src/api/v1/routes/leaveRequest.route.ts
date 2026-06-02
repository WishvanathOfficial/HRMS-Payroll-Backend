import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { leaveRequestController } from '../controllers/leaveRequest.controller';
import { leaveRequestValidator } from '../validators/leave.validator';

const router = Router();
router.get('/', validate({ query: leaveRequestValidator.listQuery }), catchAsync(leaveRequestController.list));
router.get('/with-relations', catchAsync(leaveRequestController.listWithRelations));
router.post('/', validate({ body: leaveRequestValidator.create }), catchAsync(leaveRequestController.create));
router.get('/:id', numericParam(), catchAsync(leaveRequestController.getOne));
router.put('/:id', numericParam(), catchAsync(leaveRequestController.update));
router.delete('/:id', numericParam(), catchAsync(leaveRequestController.remove));
router.post(
    '/:id/approve',
    numericParam(),
    validate({ body: leaveRequestValidator.approve }),
    catchAsync(leaveRequestController.approve),
);
router.post(
    '/:id/reject',
    numericParam(),
    validate({ body: leaveRequestValidator.reject }),
    catchAsync(leaveRequestController.reject),
);
router.post('/:id/cancel', numericParam(), catchAsync(leaveRequestController.cancel));

export default router;
