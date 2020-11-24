const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    index: "./public/assets/script/index.js",
    db:"./public/assets/script/db.js"
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].bundle.js"
  },
  mode: "development",
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      name: "Budget App",
      short_name: "Budget App",
      description: "An application for tracking expenses",
      background_color: "#01579b",
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      icons: [
        {
          src: path.resolve("public/assets/icons/icon-192x192.png"),
          sizes: [192, 512],
          destination: path.join("assets", "icons")
        }
      ]
    })
  ],
  // configure webpack to use babel-loader to bundle our separate modules and transpile the code
  // refer to https://github.com/babel/babel-loader for more information on the settings
  module: {
    rules: [
      {
        test: /\.js$/, // files must end in ".js" to be transpiled
        exclude: /node_modules/, // don't transpile code from "node_modules"
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

module.exports = config;
