const fs = require("fs-extra");
const paths = require("../config/paths");
const chalk = require("chalk");

process.env.NODE_ENV = "development";

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const configFactory = require("../config/webpack.config");
const config = configFactory("development");
const compiler = webpack(config);
const createServeConfig = require("../config/webpackDevServer.config.js");
const serverConfig = createServeConfig();
const devServer = new WebpackDevServer(serverConfig, compiler);

devServer.startCallback(() => {
  console.log(`
     ${chalk.green("✨ Successfully started server on http://localhost:8080")}
  `);
});
