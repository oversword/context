/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts','.tsx'],
  modulePaths: ['./src'],
};

module.exports = config;
// module.exports = {
//   modulePaths: ['./src'],
//   moduleFileExtensions: ['ts', 'tsx', 'jsx', 'js', 'json'],
//   transform: {
//     '^.+\\.(t|j)sx?$': [
//       '@swc/jest',
//       {
//         jsc: {
//           transform: {
//             hidden: {
//               jest: true,
//             },
//           },
//         },
//       },
//     ],
//   },
//   testMatch: ['<rootDir>/src/**/*/?(*.)+(spec|test).[jt]s?(x)'],
//   moduleNameMapper: {
//     '^log(.*)$': '<rootDir>/src/log/$1',
//     '^metrics(.*)$': '<rootDir>/src/metrics/$1',
//     '^third-party-apis(.*)$': '<rootDir>/src/third-party-apis/$1',
//     '^iframe-api(.*)$': '<rootDir>/src/ad-tool/load/api/$1',
//     '^devias(.*)$': '<rootDir>/src/ad-tool/src/devias/$1',
//     '^ad-tool(.*)$': '<rootDir>/src/ad-tool/src/$1',
//     '^utils(.*)$': '<rootDir>/src/utils/$1',
//   },
//   transformIgnorePatterns: ['node_modules/(?!(@future/promjs)/)'],
//   testEnvironment: 'jsdom',
//   testEnvironmentOptions: { resources: 'usable' },
//   collectCoverageFrom: ['src/**/*.{ts,js,json}'],
// };
