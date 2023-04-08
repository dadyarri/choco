const ALLOWED_PATH_GROUPS = ["pages/**", "features/**", "entities/**", "shared/**"].map(
  (pattern) => ({
    pattern,
    group: "internal",
    position: "after",
  }),
);

const DENIED_PATH_GROUPS = [
  "app/**",
  "pages/*/**",
  "features/*/**",
  "entities/*/**",
  "shared/*/*/**",
  "../**/app",
  "../**/pages",
  "../**/features",
  "../**/entities",
  "../**/shared",
];

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ["react", "@typescript-eslint"],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:import/errors",
    "eslint-config-prettier",
    "plugin:import/warnings",
    "plugin:react/recommended",
    "plugin:import/typescript",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "semi": "error",
    "prefer-const": "error",
    "react/display-name": "off",
    "quotes": [
      "warn",
      "double",
    ],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
        pathGroups: ALLOWED_PATH_GROUPS,
        pathGroupsExcludedImportTypes: ["builtin"],
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: DENIED_PATH_GROUPS,
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off"
  },
};