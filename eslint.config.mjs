import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended, // Reglas recomendadas de JavaScript
  tseslint.configs.recommended, // Reglas recomendadas de TypeScript
  vuePlugin.configs["flat/recommended"], // Reglas recomendadas de Vue
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser, // Usa el parser de Vue
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off", // Desactiva reglas específicas, si es necesario
    },
  },
];