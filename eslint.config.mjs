import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', 'artifacts/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  { languageOptions: { globals: globals.node }, linterOptions: { noInlineConfig: true } },
  { files: ['**/*.{ts,tsx,mts,cts}'], extends: [tseslint.configs.recommended] },
  {
    files: ['packages/s02-fixture/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: './packages/s02-fixture/tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
