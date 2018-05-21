module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 8
    },
    "root": true,
    "rules": {
        "no-tabs": 0,
        "indent": [
            "error",
            "tab"
        ],
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
            "never"
        ]
    }
};