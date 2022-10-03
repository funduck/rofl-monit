/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "src/.*test\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
