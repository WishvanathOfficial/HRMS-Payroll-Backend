import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { employeeController } from '../controllers/employee.controller';
import { employeeValidator } from '../validators/employee.validator';

const router = Router();

router.get('/', validate({ query: employeeValidator.listQuery }), catchAsync(employeeController.list));
router.post('/', validate({ body: employeeValidator.create }), catchAsync(employeeController.create));
router.get('/code/:code', catchAsync(employeeController.getByCode));
router.get('/:id', numericParam(), catchAsync(employeeController.getOne));
router.put('/:id', numericParam(), validate({ body: employeeValidator.update }), catchAsync(employeeController.update));
router.delete('/:id', numericParam(), catchAsync(employeeController.remove));

router.get('/:id/reportees', numericParam(), catchAsync(employeeController.reportees));
router.patch(
    '/:id/status',
    numericParam(),
    validate({ body: employeeValidator.setStatus }),
    catchAsync(employeeController.setStatus),
);
router.get('/:id/profile', numericParam(), catchAsync(employeeController.fullProfile));

export default router;
