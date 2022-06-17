const path = require("path");
const appDictionary = process.cwd();

const resolveProject = (relativePath) =>
  path.resolve(appDictionary, relativePath);

module.exports = {
  appHTML: resolveProject("public/index.html"),
  appBuild: resolveProject("build"),
  appIndexJs: resolveProject("src/index.js"),
  appPublic: resolveProject("public"),
};
