/**
 * Helpers used by service unit tests to stub out Sequelize models without
 * spinning up a real DB.
 */

export interface MockModel {
    findByPk: jest.Mock;
    findOne: jest.Mock;
    findAll: jest.Mock;
    findAndCountAll: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    destroy: jest.Mock;
    bulkCreate: jest.Mock;
}

/** Build a model stub where every standard method is a jest.fn(). */
export const mockModel = (): MockModel => ({
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
});

/**
 * Returns a Sequelize-instance-like object whose `transaction(cb)` runs the
 * callback immediately with a stub transaction object.
 */
export const mockSequelize = () => ({
    transaction: jest.fn(async (cb: (trx: object) => unknown) => cb({})),
});

/**
 * Build a Sequelize "instance" stub — what `Model.findByPk(...)` returns.
 * `get(key)` returns the matching attribute. `update`/`destroy`/`reload` are
 * jest.fns by default but can be overridden.
 */
export const mockInstance = <T extends Record<string, unknown>>(attrs: T) => {
    const instance = {
        ...attrs,
        get: jest.fn((key: string) => attrs[key]),
        update: jest.fn(async function (this: typeof instance, patch: Partial<T>) {
            Object.assign(attrs, patch);
            return this;
        }),
        destroy: jest.fn(),
        reload: jest.fn(async function (this: typeof instance) {
            return this;
        }),
    };
    return instance;
};
