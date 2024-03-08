import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'antfu/if-newline': 'off',
    'node/prefer-global/process': 'off',
    'no-console': 'off',
  },
})
