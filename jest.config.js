/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts','.tsx'],
  modulePaths: ['./src'],
};

module.exports = config;