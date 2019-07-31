module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    parser: "babel-eslint"
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    "no-undef": "warn",
    "max-len": ["error", { code: 120, ignoreUrls: true }],
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
        tabWidth: 4,
        useTabs: false,
        semi: false,
        singleQuote: true,
        trailingComma: false,
        bracketSpacing: true
      }
    ]
  }
};
