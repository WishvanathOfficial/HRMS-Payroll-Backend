import { QueryInterface } from 'sequelize';

/**
 * Adds the deferred FK Departments.ManagerId -> Employees.Id.
 *
 * The circular dependency between Departments and Employees
 * (a department's manager is an employee; an employee belongs to a department)
 * is resolved by creating both tables first and adding this FK afterwards.
 */
export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        try {
            await queryInterface.addConstraint('Departments', {
                fields: ['ManagerId'],
                type: 'foreign key',
                name: 'fk_departments_manager',
                references: { table: 'Employees', field: 'Id' },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                transaction,
            });
        } catch (err: any) {
            if (err.original?.code !== 'ER_FK_DUP_NAME') throw err;
        }
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.removeConstraint('Departments', 'fk_departments_manager', { transaction });
    });
