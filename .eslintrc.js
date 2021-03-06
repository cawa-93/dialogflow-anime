module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": 'module' 
    },
    "rules": {
        "array-bracket-spacing": [2,"never",{}],
        "arrow-parens": [2,"as-needed"],
        "arrow-spacing": [2,{"before":true,"after":true}],
        "brace-style": [2,"1tbs",{}],
        "comma-dangle": [2,"always-multiline"],
        "comma-spacing": [2,{"before":false,"after":true}],
        "comma-style": [2,"last"],
        "computed-property-spacing": [2,"never"],
        "constructor-super": 2,
        "curly": [2,"all"],
        "default-case": 2,
        "dot-location": [2,"object"],
        "dot-notation": [2,{"allowKeywords":false}],
        "eol-last": 2,
        "eqeqeq": [2,"smart"],
        "func-style": [2,"declaration"],
        "indent": [2,"tab",{"MemberExpression":1,"CallExpression":{"arguments":"first"},"flatTernaryExpressions":true}],
        "init-declarations": [2,"always"],
        "key-spacing": [2,{"align":"colon","afterColon":true}],
        "no-caller": 2,
        "no-else-return": 2,
        "no-eq-null": 2,
        "no-extra-bind": 2,
        "no-implicit-coercion": 2,
        "no-invalid-this": 2,
        "no-iterator": 2,
        "no-labels": 2,
        "no-lone-blocks": 2,
        "no-loop-func": 2,
        "no-mixed-requires": [2,false],
        "no-multiple-empty-lines": [2,{"max":2}],
        "no-new": 2,
        "no-new-wrappers": 2,
        "no-param-reassign": 2,
        "no-return-assign": [2,"always"],
        "no-shadow": [2,{ "hoist": "functions" }],
        "no-trailing-spaces": 2,
        "no-unneeded-ternary": 2,
        "no-use-before-define": 2,
        "no-useless-call": 2,
        "no-var": 2,
        "one-var": [2,"never"],
        "padded-blocks": [2,"never"],
        "prefer-const": 2,
        "quote-props": [2,"as-needed"],
        "quotes": [2,"backtick","avoid-escape"],
        "strict": [2,"global"],
        "semi": [2,"never"],
    }
};