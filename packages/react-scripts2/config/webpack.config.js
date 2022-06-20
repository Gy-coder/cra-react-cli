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
    output: {
      path: paths.appBuild,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-react-app"],
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
    resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
  };
};
