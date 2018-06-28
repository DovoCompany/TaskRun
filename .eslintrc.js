module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 8
  },
  "rules": {
    "indent": [2, 2, {
      "SwitchCase": 1
    }],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
  }
  "settings": {
  }
};
