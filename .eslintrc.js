module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        "camelcase": "off",
        "@typescript-eslint/camelcase": ["never"],
        "no-underscore-dangle": 0,
        "class-methods-use-this": "off",
        "indent": [
            "error",
            4
        ]
    },
};
