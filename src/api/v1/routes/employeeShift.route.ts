import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { employeeShiftController } from '../controllers/employeeShift.controller';

const router = Router();
router.get('/', catchAsync(employeeShiftController.list));
router.post('/', catchAsync(employeeShiftController.create));
router.get('/employee/:employeeId/current', numericParam('employeeId'), catchAsync(employeeShiftController.current));
router.get('/employee/:employeeId/history', numericParam('employeeId'), catchAsync(employeeShiftController.history));
router.get('/:id', numericParam(), catchAsync(employeeShiftController.getOne));
router.put('/:id', numericParam(), catchAsync(employeeShiftController.update));
router.delete('/:id', numericParam(), catchAsync(employeeShiftController.remove));

export default router;
