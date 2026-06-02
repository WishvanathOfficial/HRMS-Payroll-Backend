import { parsePagination } from './pagination';

describe('parsePagination', () => {
    it('returns defaults when no query is given', () => {
        expect(parsePagination()).toEqual({ page: 1, limit: 20, offset: 0 });
    });

    it('parses page + limit strings from query', () => {
        expect(parsePagination({ page: '3', limit: '10' })).toEqual({ page: 3, limit: 10, offset: 20 });
    });

    it('clamps limit to MAX (100)', () => {
        expect(parsePagination({ limit: '500' }).limit).toBe(100);
    });

    it('clamps page to >= 1', () => {
        expect(parsePagination({ page: '-3' }).page).toBe(1);
    });

    it('ignores garbage inputs', () => {
        expect(parsePagination({ page: 'abc', limit: 'xyz' })).toEqual({ page: 1, limit: 20, offset: 0 });
    });
});
