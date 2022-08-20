import { pathsToModuleNameMapper } from "ts-jest";
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test-setup/jest.setup.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@config/*": ["config/*"],
      "@models/*": ["models/*"],
      "@shared/*": ["shared/*"],
      "@server": ["server"],
      "@services/*": ["services/*"],
      "@routes/*": ["routes/*"],
      "@utils/*": ["utils/*"],
      "@database/*": ["database/*"],
      "@middlewares/*": ["middlewares/*"],
      "@test-setup/*": ["test-setup/*"],
    },
    { prefix: "<rootDir>/src/" },
  ),
};
