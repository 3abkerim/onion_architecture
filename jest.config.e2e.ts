export default {
      collectCoverage: false,
      preset: 'ts-jest',
      testEnvironment: 'node',
      testRegex: '\\.e2e\\.test\\.ts$',
      testTimeout: 8 * 1000,
      maxWorkers: 1,
      globalSetup: './src/tests/setup/global-setup.ts',
      globalTeardown: './src/tests/setup/global-teardown.ts',
    };