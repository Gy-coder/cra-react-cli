const { Command } = require("commander");
const chalk = require("chalk");
const packageJSON = require("./package.json");

function init() {
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
}

module.exports = {
  init,
};
