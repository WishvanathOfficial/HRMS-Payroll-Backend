import { catchAsync } from './catchAsync';
import { mockRequest, mockResponse, mockNext } from '../__tests__/helpers/express';

describe('catchAsync', () => {
    it('invokes the handler and resolves normally', async () => {
        const handler = jest.fn().mockResolvedValue(undefined);
        const wrapped = catchAsync(handler);
        const req = mockRequest();
        const res = mockResponse();
        const next = mockNext();

        await wrapped(req, res as never, next);

        expect(handler).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });

    it('forwards thrown errors to next()', async () => {
        const boom = new Error('boom');
        const handler = jest.fn().mockRejectedValue(boom);
        const wrapped = catchAsync(handler);
        const req = mockRequest();
        const res = mockResponse();
        const next = mockNext();

        await wrapped(req, res as never, next);
        // wait a tick so the promise.catch chain executes
        await new Promise((r) => setImmediate(r));

        expect(next).toHaveBeenCalledWith(boom);
    });
});
