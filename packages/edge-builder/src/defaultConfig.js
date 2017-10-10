export default {
  entry: {
    serverMain: "src/server/index.js",
    clientMain: "src/client/index.js",
    serverVendor: "src/server/vendor.js",
    clientVendor: "src/client/vendor.js",
    htmlTemplate: "src/server/index.ejs"
  },

  build: {
    enableSourceMaps: true,
    bundleCompression: "uglify",
    useCacheLoader: true,
    babelEnvPrefix: "edge"
  },

  locale: {
    default: "en-US",
    supported: [ "en-US", "es-ES", "de-DE" ]
  },

  output: {
    server: "build/server",
    client: "build/client",
    public: "/static/"
  },

  hook: {}
}
