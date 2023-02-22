import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.paths.json'
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    './src/libs/**/*.ts',
    './src/functions/**/*.ts',
    '!**/types.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  silent: true,
}

dotenvConfig({
  path: resolve(__dirname, './.env.dev'),
})

export default config
