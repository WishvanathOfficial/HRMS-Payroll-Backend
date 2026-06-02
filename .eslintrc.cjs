/* eslint-disable no-undef */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    env: {
        node: true,
        es2022: true,
    },
    rules: {
        // Allow CreationAttributes pattern: interface X extends Optional<Y, ...> {}
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',

        // We use `as never` / `as unknown` in service layer for Sequelize ModelDefined ergonomics
        '@typescript-eslint/ban-ts-comment': 'warn',

        // Helpful but not blocking
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
        }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],

        // Stylistic — Prettier handles most of these, but a few logical rules:
        'eqeqeq': ['error', 'always', { null: 'ignore' }],
        'prefer-const': 'error',
        'no-var': 'error',
    },
    ignorePatterns: ['dist/', 'node_modules/', 'coverage/', '*.config.js'],
};
