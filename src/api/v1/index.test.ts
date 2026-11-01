import express from 'express';
import request from 'supertest';
import v1 from './index';

describe('v1 API index', () => {
    it('is available without authentication', async () => {
        const app = express();
        app.use('/api/v1', v1);

        const response = await request(app).get('/api/v1/');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('HRMS & Payroll API v1');
    });
});
