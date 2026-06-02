import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { departmentController } from '../controllers/department.controller';
import { departmentValidator } from '../validators/department.validator';

const router = Router();

router.get('/', validate({ query: departmentValidator.listQuery }), catchAsync(departmentController.list));
router.post('/', validate({ body: departmentValidator.create }), catchAsync(departmentController.create));
router.get('/:id', numericParam(), catchAsync(departmentController.getOne));
router.put(
    '/:id',
    numericParam(),
    validate({ body: departmentValidator.update }),
    catchAsync(departmentController.update),
);
router.delete('/:id', numericParam(), catchAsync(departmentController.remove));

router.get('/:id/employees', numericParam(), catchAsync(departmentController.employees));
router.get('/:id/designations', numericParam(), catchAsync(departmentController.designations));
router.get('/:id/children', numericParam(), catchAsync(departmentController.children));
router.get('/:id/full', numericParam(), catchAsync(departmentController.withRelations));

export default router;
