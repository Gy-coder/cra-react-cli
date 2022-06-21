const { prompt } = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const paths = require("../config/paths");

prompt([
  {
    type: "confirm",
    message: `${chalk.cyan(
      "Are you sure you want to eject? This action is permanent."
    )}`,
    name: "shouldEject",
    initial: false,
  },
]).then((answer) => {
  if (!answer.shouldEject)
    return console.log(`${chalk.cyan("Close one! Eject aborted.")}`);
  const ownPath = paths.ownPath;
  const appPath = paths.appPath;
  const folders = ["config", "scripts"];

  const files = folders.reduce((files, folder) => {
    return files.concat(
      fs
        .readdirSync(path.join(ownPath, folder))
        .map((file) => path.join(ownPath, folder, file))
        .filter((file) => fs.lstatSync(file).isFile())
    );
  }, []);

  console.log(chalk.cyan(`Copying files into ${appPath}`));

  folders.forEach((folder) => {
    fs.mkdirSync(path.join(appPath, folder), { recursive: true });
  });

  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");

    // Skip flagged files
    content = content.trim() + "\n";
    console.log(
      `  Adding ${chalk.cyan(file.replace(ownPath, ""))} to the project`
    );
    fs.writeFileSync(file.replace(ownPath, appPath), content);
  });
  console.log();
});
