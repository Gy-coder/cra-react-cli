const { Command } = require("commander");
const chalk = require("chalk");
const packageJSON = require("./package.json");
const path = require("path");
const fs = require("fs-extra");
const spawn = require("cross-spawn");
const { prompt } = require("inquirer");

async function init() {
  let projectName;
  let isTs = false;
  new Command(packageJSON.name)
    .version(packageJSON.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")}`)
    .action((name) => {
      prompt([
        {
          type: "list",
          name: "type",
          message: `Do you want to use Typescript in your project`,
          choices: [
            { name: "Javascript", value: "js" },
            { name: "Typescript", value: "ts" },
          ],
        },
      ]).then(async ({ type }) => {
        projectName = name;
        isTs = type === "ts" ? true : false;
        await createApp(projectName, isTs);
      });
    })
    .parse(process.argv);
}

async function createApp(projectName, isTs) {
  let root = path.resolve(projectName);
  fs.emptyDir(root);
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
  await run(root, projectName, originalDir, isTs);
}

/**
 *
 * @param {*} root 项目创建的路径
 * @param {*} projectName 项目名
 * @param {*} originalDir 原来的工作目录
 * @param {*} isTs 是否是ts
 */

async function run(root, projectName, originalDir, isTs) {
  let scriptName = "moon-scripts";
  let templateName = isTs ? "moon-template-typescript" : "moon-template";
  const allDependencies = isTs
    ? [
        "react",
        "react-dom",
        "@types/react",
        "@types/react-dom",
        scriptName,
        templateName,
      ]
    : ["react", "react-dom", scriptName, templateName];
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
      var init = require("moon-scripts/scripts/init")
      init.apply(null,JSON.parse(process.argv[1]))
  `;
  await execNodeScript({ cwd: process.cwd() }, data, source);
  console.log("Done");
  process.exit(0);
}

async function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = "yarnpkg";
    const react = allDependencies.slice(0, -2);
    const others = allDependencies.slice(-2);
    const args = [
      "add",
      "--exact",
      ...react,
      `file:../packages/${others[0]}`,
      `file:../packages/${others[1]}`,
      "--cwd",
      root,
    ];
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
