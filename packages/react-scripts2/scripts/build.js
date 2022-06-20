const fs = require("fs-extra");
const paths = require("../config/paths");
const webpack = require("webpack");
const configFactory = require("../config/webpack.config");
const config = configFactory("production");
const chalk = require("chalk");

process.env.NODE_ENV = "production"; // 环境变量设置为production
fs.emptyDirSync(paths.appBuild); // 打包的目录build webpack默认是dist
copyPublicFolder(); // 拷贝public目录
build();

// 打包
function build() {
  // config是webpack的配置 执行webpack得到编译对象compiler
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    console.log(err);
    console.log(chalk.green("Compiled successfully.\n"));
  });
}

// 拷贝文件
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    filter: (file) => file !== paths.appHtml,
  });
}
