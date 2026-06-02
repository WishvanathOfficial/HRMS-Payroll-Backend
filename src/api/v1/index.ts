import { Router } from 'express';
import { authenticate } from '../../middlewares';

import authRoutes from './routes/auth.route';
import departmentRoutes from './routes/department.route';
import designationRoutes from './routes/designation.route';
import employeeRoutes from './routes/employee.route';
import employmentHistoryRoutes from './routes/employmentHistory.route';
import shiftRoutes from './routes/shift.route';
import employeeShiftRoutes from './routes/employeeShift.route';
import attendanceLogRoutes from './routes/attendanceLog.route';
import leaveTypeRoutes from './routes/leaveType.route';
import leaveBalanceRoutes from './routes/leaveBalance.route';
import leaveRequestRoutes from './routes/leaveRequest.route';
import salaryStructureRoutes from './routes/salaryStructure.route';
import salaryComponentRoutes from './routes/salaryComponent.route';
import salaryStructureComponentRoutes from './routes/salaryStructureComponent.route';
import employeeSalaryRoutes from './routes/employeeSalary.route';
import payrollRunRoutes from './routes/payrollRun.route';
import payslipRoutes from './routes/payslip.route';
import payslipDetailRoutes from './routes/payslipDetail.route';
import statutoryDeductionRoutes from './routes/statutoryDeduction.route';
import jobPostingRoutes from './routes/jobPosting.route';
import applicantRoutes from './routes/applicant.route';
import interviewStageRoutes from './routes/interviewStage.route';
import appraisalCycleRoutes from './routes/appraisalCycle.route';
import employeeAppraisalRoutes from './routes/employeeAppraisal.route';

const v1 = Router();

/* ----------------------- Public (no JWT required) ------------------------ */
v1.use('/auth', authRoutes);

/* ----------------------- Authenticated routes ---------------------------- */
// Everything below this guard requires a valid Bearer token.
const guarded = Router();
guarded.use(authenticate);

// Organization
guarded.use('/departments', departmentRoutes);
guarded.use('/designations', designationRoutes);

// Employee
guarded.use('/employees', employeeRoutes);
guarded.use('/employment-history', employmentHistoryRoutes);

// Attendance
guarded.use('/shifts', shiftRoutes);
guarded.use('/employee-shifts', employeeShiftRoutes);
guarded.use('/attendance-logs', attendanceLogRoutes);

// Leave
guarded.use('/leave-types', leaveTypeRoutes);
guarded.use('/leave-balances', leaveBalanceRoutes);
guarded.use('/leave-requests', leaveRequestRoutes);

// Salary
guarded.use('/salary-structures', salaryStructureRoutes);
guarded.use('/salary-components', salaryComponentRoutes);
guarded.use('/salary-structure-components', salaryStructureComponentRoutes);
guarded.use('/employee-salaries', employeeSalaryRoutes);

// Payroll
guarded.use('/payroll-runs', payrollRunRoutes);
guarded.use('/payslips', payslipRoutes);
guarded.use('/payslip-details', payslipDetailRoutes);
guarded.use('/statutory-deductions', statutoryDeductionRoutes);

// Recruitment
guarded.use('/job-postings', jobPostingRoutes);
guarded.use('/applicants', applicantRoutes);
guarded.use('/interview-stages', interviewStageRoutes);

// Appraisal
guarded.use('/appraisal-cycles', appraisalCycleRoutes);
guarded.use('/employee-appraisals', employeeAppraisalRoutes);

v1.use(guarded);

/* ------------------------------- Index ----------------------------------- */
v1.get('/', (_req, res) => {
    res.json({
        success: true,
        statusCode: 200,
        message: 'HRMS & Payroll API v1',
        data: {
            modules: {
                auth: [
                    '/auth/login',
                    '/auth/refresh',
                    '/auth/me',
                    '/auth/change-password',
                    '/auth/register',
                    '/auth/logout',
                ],
                organization: ['/departments', '/designations'],
                employee: ['/employees', '/employment-history'],
                attendance: ['/shifts', '/employee-shifts', '/attendance-logs'],
                leave: ['/leave-types', '/leave-balances', '/leave-requests'],
                salary: [
                    '/salary-structures',
                    '/salary-components',
                    '/salary-structure-components',
                    '/employee-salaries',
                ],
                payroll: ['/payroll-runs', '/payslips', '/payslip-details', '/statutory-deductions'],
                recruitment: ['/job-postings', '/applicants', '/interview-stages'],
                appraisal: ['/appraisal-cycles', '/employee-appraisals'],
            },
        },
    });
});

export default v1;
