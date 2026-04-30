const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleFileExtensions: ["ts", "js", "json"],

  rootDir: ".",

  testMatch: ["**/__tests__/**/*.test.ts"],

  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  clearMocks: true,

  detectOpenHandles: true,

  forceExit: true,
};
