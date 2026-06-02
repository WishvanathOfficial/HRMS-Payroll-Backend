import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants';

export interface PaginationInput {
    page?: string | number;
    limit?: string | number;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    offset: number;
}

/** Parse `page`/`limit` query params, clamped to safe bounds. */
export const parsePagination = (q: PaginationInput | Record<string, unknown> = {}): PaginationOptions => {
    const page = Math.max(1, Number((q as PaginationInput).page) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number((q as PaginationInput).limit) || DEFAULT_LIMIT));
    return { page, limit, offset: (page - 1) * limit };
};

export default parsePagination;
