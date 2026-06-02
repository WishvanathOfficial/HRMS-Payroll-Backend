import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { leaveRequestService } from '../../../services/leaveRequest.service';
import { LeaveStatus } from '../../../models/leave-request';

export const leaveRequestController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await leaveRequestService.list({
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            status: req.query.status as LeaveStatus | undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveRequestService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await leaveRequestService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveRequestService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await leaveRequestService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async approve(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await leaveRequestService.approve(Number(req.params.id), Number(req.body.approvedBy)),
            'Leave approved',
        );
    },
    async reject(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await leaveRequestService.reject(Number(req.params.id), Number(req.body.approvedBy)),
            'Leave rejected',
        );
    },
    async cancel(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveRequestService.cancel(Number(req.params.id)), 'Leave cancelled');
    },
    async listWithRelations(req: Request, res: Response) {
        const { limit, offset } = parsePagination(req.query);
        return ApiResponse.ok(
            res,
            await leaveRequestService.listWithRelations({
                status: req.query.status as LeaveStatus | undefined,
                limit,
                offset,
            }),
        );
    },
};
