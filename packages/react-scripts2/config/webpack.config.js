/**
 * 生产webpack配置文件的工厂
 * @param {*} webpackEnv 环境信息
 */

module.exports = function (webpackEnv) {
  const isEnvProduction = webpackEnv === "production";
  const isEnvDevelopment = webpackEnv === "development";
  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
  };
};
