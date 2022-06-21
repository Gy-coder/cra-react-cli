const path = require("path");
const fs = require("fs-extra");
const appDictionary = fs.realpathSync(process.cwd());

const resolveProject = (relativePath) =>
  path.resolve(appDictionary, relativePath);

const resolveOwn = (relativePath) =>
  path.resolve(__dirname, "..", relativePath);

module.exports = {
  appHtml: resolveProject("public/index.html"),
  appBuild: resolveProject("build"),
  appIndexJs: resolveProject("src/index.js"),
  appPublic: resolveProject("public"),
  appSrc: resolveProject("src"),
  ownPath: resolveOwn("."),
  appPath: resolveProject("."),
};
