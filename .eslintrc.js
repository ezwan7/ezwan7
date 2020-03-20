module.exports = {
    root   : true,
    extends: '@react-native-community',
    parser : '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules  : {
        'prettier/prettier'                : 0,
        '@typescript-eslint/no-unused-vars': 0,
        // 'react-hooks/exhaustive-deps'      : 0,
    },
};
