module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
    globals: {},
    plugins: ['react-hooks'],
    rules: {
      'no-restricted-syntax': 0,
      'no-param-reassign': 0,
      'no-unused-expressions': 0,
    },
  };