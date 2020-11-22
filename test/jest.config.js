import * as path from 'path';
const root = path.resolve(__dirname, '..');
import rootConfig from `${root}/jest.config.js`;

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    preset: 'ts-jest/presets/js-with-babel',
    displayName: 'end2end-tests',
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    testMatch: ['<rootDir>/test/**/*.test.ts'],
  },
};
