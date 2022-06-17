const fs = require("fs-extra");
const paths = require("../config/paths");
const webpack = require("webpack");

process.env.NODE_ENV = "production";

const configFactory = require("../config/webpack.config");
const chalk = require("chalk");

const config = configFactory("production");

fs.emptyDirSync(paths.appBuild);

copyPublicFolder();

build();

function copyPublicFolder() {
  fs.copySync(config.appPublic, config.appBuild, {
    filter: (file) => file !== config.appHTML,
  });
}

function build() {
  let complier = webpack(config);
  complier.run((err, stats) => {
    console.log(err);
    console.log(chalk.green(stats));
  });
}
