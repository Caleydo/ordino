// test dependencies that require transformation
let pluginsToTransform = [
  'tdp_*',
  'phovea_*',
  'lineupjs'
].join('|');

if (pluginsToTransform.length > 0) {
  /**  Attention: Negative Lookahead! This regex adds the specified repos to a whitelist that holds plugins that are excluded from the transformIgnorePatterns.
   * This means that pluginsToTransform should contain all repos that export ts files. They can only be handled by the transformation. */
  pluginsToTransform = `(?!${pluginsToTransform})`;
}

/**
 * see also https://jestjs.io/docs/en/webpack#mocking-css-modules
 */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|ts|tsx)$": "ts-jest",
    "\\.xml$": "jest-raw-loader"
  },
  testRegex: "(.*(test|spec))\\.(tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  modulePaths: [
    "src"
  ],
  transformIgnorePatterns: [`../node_modules/${pluginsToTransform}`, `node_modules/${pluginsToTransform}`],
  globals: {
    "__VERSION__": "TEST_VERSION",
    "__APP_CONTEXT__": "TEST_CONTEXT",
    'ts-jest': {
      // has to be set to true, otherwise i18n import fails
      "tsconfig": {
        "esModuleInterop": true,
      }
    }
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass|png|jpg|gif)$": "identity-obj-proxy"
  }
}
