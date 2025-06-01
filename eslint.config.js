import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
      },
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
]);
