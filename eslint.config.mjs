import globals from 'globals';
import pluginJs from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  daStyle,
  {
    rules: {
      quotes: 'off',
      indent: 'off',
      'no-undef': 'off',
      'prefer-const': 'off',
      'prefer-template': 'off',
    },
  },
];
