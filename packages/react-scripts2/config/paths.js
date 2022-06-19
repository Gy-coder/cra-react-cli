const path = require("path");
const fs = require("fs-extra");
const appDictionary = fs.realpathSync(process.cwd());

const resolveProject = (relativePath) =>
  path.resolve(appDictionary, relativePath);

module.exports = {
  appHTML: resolveProject("public/index.html"),
  appBuild: resolveProject("build"),
  appIndexJs: resolveProject("src/index.js"),
  appPublic: resolveProject("public"),
};
