const { Command } = require("commander");
const chalk = require("chalk");
const packageJSON = require("./package.json");
const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");

async function init() {
  let projectName;
  new Command(packageJSON.name)
    .version(packageJSON.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")}`)
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv);
  console.log("projectName", projectName);
  await createApp(projectName);
}

async function createApp(projectName) {
  let root = path.resolve(projectName);
  fs.ensureDir(root);
  console.log(`creating a new React app  in ${chalk.green(root)}`);
  const packageJSON = {
    name: projectName,
    version: "0.1.0",
    private: true,
  };
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJSON, null, 2)
  );
  const originalDir = process.cwd();
  process.chdir(root);
  console.log("projectName", projectName);
  console.log("root:", root);
  console.log("originalDir:", originalDir);
  await run(root, projectName, originalDir);
}

/**
 *
 * @param {*} root 项目创建的路径
 * @param {*} projectName 项目名
 * @param {*} originalDir 原来的工作目录
 */

async function run(root, projectName, originalDir) {
  let scriptName = "react-scripts";
  let templateName = "cra-template";
  const allDependencies = ["react", "react-dom", scriptName, templateName];
  console.log(`
    📦 Install packages. it's might take a couple of minutes
  `);
  console.log(`
    📦 Installing ${chalk.cyan("react")} ${chalk.cyan(
    "react-dom"
  )},and ${chalk.cyan(scriptName)} ${`with ${chalk.cyan(templateName)}`}......
  `);
  await install(root, allDependencies);
  let data = [root, projectName, true, originalDir, templateName];
  let source = `
      var init = require('react-scripts/scripts/init.js')
      init.apply(null,JSON.parse(process.argv[1]))
  `;
  await execNodeScript({ cwd: process.cwd() }, data, source);
  console.log("Done");
  process.exit(0);
}

async function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = "yarnpkg";
    const args = ["add", "--exact", ...allDependencies, "--cwd", root];
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", resolve);
  });
}

async function execNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ["-e", source, "--", JSON.stringify(data)],
      { cwd, stdio: "inherit" }
    );
    child.on("close", resolve);
  });
}

module.exports = {
  init,
};
