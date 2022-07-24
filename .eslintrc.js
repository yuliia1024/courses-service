module.exports = {
  extends: 'airbnb-base',
  env: {
    es6: true,
    node: true,
    mocha: true,
    jest: true,
  },
  globals: {
    describe: true,
    before: true,
    beforeEach: true,
    after: true,
    afterEach: true,
    it: true,
    should: true,
    context: true,
    env: true,
  },
  rules: {
    'no-unused-expressions': 0,
    'arrow-parens': [
      'error',
      'as-needed',
    ],
    'class-methods-use-this': [
      'warn',
      {
        exceptMethods: [
          '_flush',
          '_transform',
        ],
      },
    ],
    'comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'ignore',
      },
    ],
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'max-len': [
      'warn',
      {
        code: 140,
      },
    ],
    'newline-before-return': 'error',
    'no-restricted-properties': [
      2,
      {
        object: 'describe',
        property: 'only',
        message: 'Please remove only from tests',
      },
      {
        object: 'context',
        property: 'only',
        message: 'Please remove only from tests',
      },
      {
        object: 'it',
        property: 'only',
        message: 'Please remove only from tests',
      },
      {
        object: '_',
        message: 'Please require only needed methods',
      },
    ],
    'no-underscore-dangle': 0,
    'object-curly-newline': [
      'warn',
      {
        ObjectExpression: {
          minProperties: 6,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 6,
          consistent: true,
        },
      },
    ],
    'prefer-destructuring': ['error', {
      VariableDeclarator: {
        array: false,
        object: false,
      },
      AssignmentExpression: {
        array: true,
        object: true,
      },
    }, {
      enforceForRenamedProperties: false,
    }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    'require-await': 'error',
    'no-restricted-syntax': 'warn',
    'no-await-in-loop': 'warn',
    'default-case': 'off',
    'no-console': 'off',
  },
};
