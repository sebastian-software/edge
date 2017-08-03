export default {
  enableSourceMaps: true,

  // either "uglify", "babili" or null
  bundleCompression: "uglify",

  useCacheLoader: true,
  babelEnvPrefix: "edge",

  serverEntry: "src/server/index.js",
  clientEntry: "src/client/index.js",
  serverVendor: "src/server/vendor.js",
  clientVendor: "src/client/vendor.js",

  htmlTemplate: "src/index.ejs",

  serverOutput: "build/server",
  clientOutput: "build/client",

  publicPath: "/static/",

  defaultLocale: "en-US",
  supportedLocales: [ "en-US", "es-ES", "de-DE" ]
}
