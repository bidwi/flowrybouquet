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
      'linebreak-style': 'off',
      camelcase: 'off',
      'no-useless-escape': 'off',
      'no-undef': 'off',
      'prefer-arrow-callback': 'off',
      'no-unused-vars': 'off',
      'prefer-const': 'off',
      'prefer-template': 'off',
    },
  },
];
