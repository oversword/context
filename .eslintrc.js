module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended'
	],
	'overrides': [
		{
			'env': {
				'node': true
			},
			'files': [
				'.eslintrc.{js,cjs}'
			],
			'parserOptions': {
				'sourceType': 'script'
			},
		},
		{
			"files": ["src/**/*.test.ts"],
			"env": {
				"jest": true
			}
		}
	],
	'settings': {
		'react': {
			'version': 'detect',
		},
		"import/resolver": {
			"node": {
				"paths": ["node_modules", "src"]
			}
		}
	},
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
		'ecmaFeatures': {
			'jsx': true
		}
	},
	'plugins': [
		'@typescript-eslint',
		'react',
		'@emotion',
	],
	'rules': {
    "@emotion/pkg-renaming": "error",
    "react/no-unknown-property": ["error", { "ignore": ["css"] }],
		'@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
