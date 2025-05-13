import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Add rules to disable specific warnings
    rules: {
      'react-hooks/exhaustive-deps': 'warn', // Or 'off' to disable completely
      '@typescript-eslint/no-explicit-any': 'warn', // Or 'off'
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@next/next/no-img-element': 'warn', // Or 'off'
    },
  },
];

export default eslintConfig;
