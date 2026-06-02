import { Router } from 'express';
import { catchAsync, numericParam } from '../../../middlewares';
import { employeeSalaryController } from '../controllers/employeeSalary.controller';

const router = Router();
router.get('/', catchAsync(employeeSalaryController.list));
router.post('/', catchAsync(employeeSalaryController.create));
router.get('/employee/:employeeId/current', numericParam('employeeId'), catchAsync(employeeSalaryController.current));
router.get('/:id', numericParam(), catchAsync(employeeSalaryController.getOne));
router.put('/:id', numericParam(), catchAsync(employeeSalaryController.update));
router.delete('/:id', numericParam(), catchAsync(employeeSalaryController.remove));

export default router;
