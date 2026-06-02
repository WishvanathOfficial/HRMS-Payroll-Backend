import { sequelize } from '../config/database';

// Re-export the Sequelize singleton so model files can `import { sequelize } from '.'`
export { sequelize };

// Importing every model registers it on the Sequelize instance and runs its
// `belongsTo` / `hasMany` association blocks. Order matters when associations
// across models reference each other — Sequelize handles forward refs fine,
// but importing the "parent" side first keeps the file readable.
import { Department } from './department';
import { Designation } from './designation';
import { Employee } from './employee';
import { EmploymentHistory } from './employment-history';
import { Shift } from './shift';
import { EmployeeShift } from './employee-shift';
import { AttendanceLog } from './attendance-log';
import { LeaveType } from './leave-type';
import { LeaveBalance } from './leave-balance';
import { LeaveRequest } from './leave-request';
import { SalaryStructure } from './salary-structure';
import { SalaryComponent } from './salary-component';
import { SalaryStructureComponent } from './salary-structure-component';
import { EmployeeSalary } from './employee-salary';
import { PayrollRun } from './payroll-run';
import { Payslip } from './payslip';
import { PayslipDetail } from './payslip-detail';
import { StatutoryDeduction } from './statutory-deduction';
import { JobPosting } from './job-posting';
import { Applicant } from './applicant';
import { InterviewStage } from './interview-stage';
import { AppraisalCycle } from './appraisal-cycle';
import { EmployeeAppraisal } from './employee-appraisal';

// Auth — must come after Employee (User belongs to Employee).
import { Role } from './role';
import { User } from './user';
import { UserRole } from './user-role';

export {
    Department,
    Designation,
    Employee,
    EmploymentHistory,
    Shift,
    EmployeeShift,
    AttendanceLog,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    SalaryStructure,
    SalaryComponent,
    SalaryStructureComponent,
    EmployeeSalary,
    PayrollRun,
    Payslip,
    PayslipDetail,
    StatutoryDeduction,
    JobPosting,
    Applicant,
    InterviewStage,
    AppraisalCycle,
    EmployeeAppraisal,
    Role,
    User,
    UserRole,
};
