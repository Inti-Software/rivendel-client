import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // --- REGLAS DE ESTILO PERSONALIZADAS ---
      
      // Control de longitud de línea (aviso si pasa de 100)
      'max-len': ['warn', { 'code': 100, 'ignoreUrls': true, 'ignoreStrings': true }],

      // Lo que pediste: Mantener objetos en una sola línea si son razonables
      'object-curly-newline': ['error', { 
        'ObjectExpression': { 'multiline': true, 'minProperties': 8 }, // Solo rompe si hay 8+ propiedades
        'ObjectPattern': { 'multiline': true, 'minProperties': 8 },
        'ImportDeclaration': 'never' 
      }],
      
      'object-property-newline': ['error', { 
        'allowAllPropertiesOnSameLine': true 
      }],

      // Evitar variables sin usar (clásico)
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    },
  },
  // Desactiva reglas de ESLint que choquen con Prettier
  prettierConfig, 
];