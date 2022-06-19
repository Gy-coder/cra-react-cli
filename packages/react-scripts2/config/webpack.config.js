/**
 * 生产webpack配置文件的工厂
 * @param {*} webpackEnv 环境信息
 */

const paths = require("../config/paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function (webpackEnv) {
  const isEnvProduction = webpackEnv === "production";
  const isEnvDevelopment = webpackEnv === "development";
  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve("babel-loader"),
          options: {
            presets: [[require.resolve("babel-preset-react-app")]],
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
      }),
    ],
  };
};
