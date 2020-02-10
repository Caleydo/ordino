// test dependencies that require transformation
const pluginsToTransform = [
  'tdp_core'
].join('|');

/**
 * TODO check if we can process inline webpack loaders (e.g. as found in https://github.com/phovea/phovea_ui/blob/master/src/_bootstrap.ts)
 * see also https://jestjs.io/docs/en/webpack#mocking-css-modules
 */
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "\\.xml$": "jest-raw-loader"
  },
  testRegex: "(.*(test|spec))\\.(tsx?)$",
  testURL: "http://localhost/",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  modulePaths: [
    "src",
    "../"
  ],
  transformIgnorePatterns: [`../node_modules/(?!${pluginsToTransform})`],
  globals: {
    "__VERSION__": "TEST_VERSION",
    "__APP_CONTEXT__": "TEST_CONTEXT"
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "imports-loader?.*": "imports-loader",
    "raw-loader?.*": "raw-loader",
    "file-loader?.*": "file-loader",
    "script-loader?.*": "script-loader"
  }
}
