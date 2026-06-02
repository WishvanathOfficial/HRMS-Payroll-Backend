import { ApiResponse } from './ApiResponse';
import { mockResponse } from '../__tests__/helpers/express';
import { StatusCodes } from 'http-status-codes';

describe('ApiResponse', () => {
    it('ok() wraps data in the success envelope with 200', () => {
        const res = mockResponse();
        ApiResponse.ok(res as never, { id: 1 }, 'done');

        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            statusCode: StatusCodes.OK,
            message: 'done',
            data: { id: 1 },
        });
    });

    it('created() uses 201', () => {
        const res = mockResponse();
        ApiResponse.created(res as never, { id: 2 });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it('noContent() uses 204 + send()', () => {
        const res = mockResponse();
        ApiResponse.noContent(res as never);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
        expect(res.send).toHaveBeenCalled();
    });

    it('paginated() builds meta.pagination with totalPages', () => {
        const res = mockResponse();
        ApiResponse.paginated(res as never, [1, 2, 3], { page: 1, limit: 20, total: 47 });

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: [1, 2, 3],
                meta: { pagination: { page: 1, limit: 20, total: 47, totalPages: 3 } },
            }),
        );
    });

    it('paginated() returns at least 1 totalPage even when total is 0', () => {
        const res = mockResponse();
        ApiResponse.paginated(res as never, [], { page: 1, limit: 20, total: 0 });
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                meta: { pagination: expect.objectContaining({ totalPages: 1 }) },
            }),
        );
    });
});
