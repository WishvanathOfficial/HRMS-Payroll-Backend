import { Router } from 'express';
import { catchAsync, validate, numericParam } from '../../../middlewares';
import { designationController } from '../controllers/designation.controller';
import { designationValidator } from '../validators/designation.validator';

const router = Router();

router.get('/', validate({ query: designationValidator.listQuery }), catchAsync(designationController.list));
router.get('/with-department', catchAsync(designationController.withDepartment));
router.post('/', validate({ body: designationValidator.create }), catchAsync(designationController.create));
router.get('/:id', numericParam(), catchAsync(designationController.getOne));
router.put(
    '/:id',
    numericParam(),
    validate({ body: designationValidator.update }),
    catchAsync(designationController.update),
);
router.delete('/:id', numericParam(), catchAsync(designationController.remove));

export default router;
