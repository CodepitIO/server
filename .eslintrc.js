module.exports = {
  plugins: [`prettier`],
  extends: [`airbnb`, `airbnb-typescript`],
  root: true,
  parserOptions: {
    project: [`tsconfig.json`],
    tsconfigRootDir: __dirname,
  },
  rules: {
    camelcase: `off`,
    "no-underscore-dangle": `off`,
    "import/prefer-default-export": `off`,
    "import/extensions": `off`,
    quotes: `off`,
  },
  overrides: [
    {
      files: `**/*.+(ts|js)`,
      parser: `@typescript-eslint/parser`,
      plugins: [`@typescript-eslint/eslint-plugin`],
      extends: [`plugin:@typescript-eslint/recommended`, `prettier`],
      rules: {
        "@typescript-eslint/explicit-function-return-type": `off`,
        "@typescript-eslint/explicit-module-boundary-types": `off`,
        "no-use-before-define": [0],
        "@typescript-eslint/no-use-before-define": [1],
        "@typescript-eslint/no-explicit-any": `off`,
        "@typescript-eslint/no-unused-vars": `off`,
        "@typescript-eslint/no-throw-literal": `off`,
        "@typescript-eslint/no-var-requires": `off`,
        "@typescript-eslint/quotes": [
          2,
          `backtick`,
          {
            avoidEscape: true,
          },
        ],
      },
    },
  ],
};
