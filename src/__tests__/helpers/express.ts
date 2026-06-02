import { Request, Response } from 'express';

export interface MockResponse extends Partial<Response> {
    status: jest.Mock;
    json: jest.Mock;
    send: jest.Mock;
    setHeader: jest.Mock;
}

/** Build a chainable Response mock that records `status` + `json`/`send` calls. */
export const mockResponse = (): MockResponse => {
    const res = {} as MockResponse;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    return res;
};

/** Build a minimal Request stub. */
export const mockRequest = (overrides: Partial<Request> = {}): Request =>
    ({
        body: {},
        params: {},
        query: {},
        headers: {},
        ...overrides,
    }) as unknown as Request;

/** Convenience next() spy. */
export const mockNext = () => jest.fn();
