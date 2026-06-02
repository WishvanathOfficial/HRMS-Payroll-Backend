/**
 * Centralized response/error messages — kept in one place so they can be
 * tweaked or translated (i18n) without hunting through controllers.
 */
export const Messages = {
    Common: {
        Success: 'Success',
        Created: 'Created successfully',
        Updated: 'Updated successfully',
        Deleted: 'Deleted successfully',
        Fetched: 'Fetched successfully',
        NotFound: 'Resource not found',
        BadRequest: 'Bad request',
        Unauthorized: 'Unauthorized',
        Forbidden: 'Forbidden',
        Conflict: 'Resource already exists',
        InternalError: 'Internal server error',
        ValidationFailed: 'Validation failed',
    },
    Department: {
        NotFound: 'Department not found',
        Exists: 'Department with this name already exists',
    },
    Employee: {
        NotFound: 'Employee not found',
        Exists: 'Employee with this email or code already exists',
        InvalidStatus: 'Invalid employee status',
    },
    Attendance: {
        AlreadyCheckedIn: 'Already checked in today',
        AlreadyCheckedOut: 'Already checked out today',
        NoCheckIn: 'No check-in record found for today',
    },
    Leave: {
        NotPending: 'Only pending leaves can be approved or rejected',
        BalanceExceeded: 'Leave request exceeds available balance',
    },
    Payroll: {
        DuplicateRun: 'Payroll run for this month already exists',
        AlreadyProcessed: 'Payroll run already processed',
        NotCompleted: 'Only completed payroll runs can be locked',
    },
};

export default Messages;
