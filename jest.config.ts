import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    roots: ['<rootDir>/src'],
    testMatch: ['**/?(*.)+(test|spec).ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { diagnostics: false, isolatedModules: true }],
    },
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    verbose: false,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
        '!src/migrations/**',
        '!src/seeders/**',
        '!src/db/cli.ts',
        '!src/server.ts',
        '!src/app.ts',
        '!src/models/**',
        '!src/config/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@controllers/(.*)$': '<rootDir>/src/api/v1/controllers/$1',
        '^@routes/(.*)$': '<rootDir>/src/api/v1/routes/$1',
        '^@validators/(.*)$': '<rootDir>/src/api/v1/validators/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@db/(.*)$': '<rootDir>/src/db/$1',
    },
};

export default config;
