const process = require('node:process')

process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@antfu',

  ignorePatterns: ['**/*.scss', '**/*.webp'],
  rules: {
    'no-console': ['error', { allow: ['time', 'timeEnd', 'error'] }],
    'yml/no-empty-mapping-value': 0,
  },
}
