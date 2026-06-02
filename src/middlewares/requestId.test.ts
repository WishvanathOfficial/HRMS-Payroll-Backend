import { requestId } from './requestId';
import { mockRequest, mockResponse, mockNext } from '../__tests__/helpers/express';

describe('requestId middleware', () => {
    it('generates a UUID when no header is present', () => {
        const req = mockRequest({ header: () => '' } as never);
        const res = mockResponse();
        const next = mockNext();

        requestId(req as never, res as never, next);

        expect((req as unknown as { id: string }).id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
        expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
        expect(next).toHaveBeenCalled();
    });

    it('reuses an incoming X-Request-Id header', () => {
        const req = mockRequest({ header: () => 'abc-123' } as never);
        const res = mockResponse();
        const next = mockNext();

        requestId(req as never, res as never, next);

        expect((req as unknown as { id: string }).id).toBe('abc-123');
        expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'abc-123');
    });
});
