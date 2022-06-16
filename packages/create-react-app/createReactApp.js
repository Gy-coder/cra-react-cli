const { Command } = require("commander");
const chalk = require("chalk");
const packageJSON = require("./package.json");
const path = require("path");
const fs = require("fs-extra");

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
  console.log("Install packages. it's might take a couple of minutes");
  console.log(`
    📦 Installing ${chalk.cyan("react")} ${chalk.cyan(
    "react-dom"
  )},and ${chalk.cyan(scriptName)} ${`with ${chalk.cyan(templateName)}`}......
  `);
  await install(root, allDependencies);
}

async function install(root, allDependencies) {}

module.exports = {
  init,
};
