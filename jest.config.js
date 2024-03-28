/** @type {import('jest').Config} */
const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts','.tsx'],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1"
	},
};

module.exports = config;