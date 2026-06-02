import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    InterviewStage: mockModel(),
    Applicant: mockModel(),
}));

import { interviewStageService } from './interviewStage.service';
import { InterviewStage, Applicant } from '../models';
const IS = InterviewStage as unknown as ReturnType<typeof mockModel>;
const App = Applicant as unknown as ReturnType<typeof mockModel>;

describe('interviewStageService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by applicantId / result', async () => {
        IS.findAll.mockResolvedValue([]);
        await interviewStageService.list({ applicantId: 1, result: 'PASSED' });
        expect(IS.findAll).toHaveBeenCalledWith(
            expect.objectContaining({ where: { applicantId: 1, result: 'PASSED' } }),
        );
    });

    it('getById 404s when missing', async () => {
        IS.findByPk.mockResolvedValue(null);
        await expect(interviewStageService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + validates applicant', async () => {
        await expect(interviewStageService.create({})).rejects.toMatchObject({ statusCode: 400 });
        App.findByPk.mockResolvedValue(null);
        await expect(interviewStageService.create({ applicantId: 9, stage: 'Tech' })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('create persists when valid', async () => {
        App.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        IS.create.mockResolvedValue(mockInstance({ id: 1 }));
        await interviewStageService.create({ applicantId: 1, stage: 'Tech' });
        expect(IS.create).toHaveBeenCalled();
    });

    it('recordResult rejects empty + updates valid', async () => {
        await expect(interviewStageService.recordResult(1, '' as never)).rejects.toMatchObject({ statusCode: 400 });
        const inst = mockInstance({ id: 1 });
        IS.findByPk.mockResolvedValue(inst);
        await interviewStageService.recordResult(1, 'PASSED', 'Good');
        expect(inst.update).toHaveBeenCalledWith({ result: 'PASSED', feedback: 'Good' });
    });

    it('update + remove + byApplicant delegate', async () => {
        const inst = mockInstance({ id: 1 });
        IS.findByPk.mockResolvedValue(inst);
        await interviewStageService.update(1, { feedback: 'x' });
        expect(inst.update).toHaveBeenCalled();
        await interviewStageService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();

        IS.findAll.mockResolvedValue([]);
        await interviewStageService.byApplicant(2);
        expect(IS.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { applicantId: 2 } }));
    });
});
