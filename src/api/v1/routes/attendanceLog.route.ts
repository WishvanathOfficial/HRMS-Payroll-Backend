import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { attendanceLogController } from '../controllers/attendanceLog.controller';
import { attendanceValidator } from '../validators/attendance.validator';

const router = Router();
router.get('/', validate({ query: attendanceValidator.listQuery }), catchAsync(attendanceLogController.list));
router.post('/', catchAsync(attendanceLogController.create));
router.post(
    '/check-in',
    validate({ body: attendanceValidator.checkInOut }),
    catchAsync(attendanceLogController.checkIn),
);
router.post(
    '/check-out',
    validate({ body: attendanceValidator.checkInOut }),
    catchAsync(attendanceLogController.checkOut),
);
router.get(
    '/summary/:employeeId',
    numericParam('employeeId'),
    validate({ query: attendanceValidator.summaryQuery }),
    catchAsync(attendanceLogController.summary),
);
router.get('/:id', numericParam(), catchAsync(attendanceLogController.getOne));
router.put('/:id', numericParam(), catchAsync(attendanceLogController.update));
router.delete('/:id', numericParam(), catchAsync(attendanceLogController.remove));

export default router;
