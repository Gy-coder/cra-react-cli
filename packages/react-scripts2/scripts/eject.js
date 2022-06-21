const { prompt } = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const paths = require("../config/paths");
const os = require("os");
const spawn = require("cross-spawn");

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
  const ownPackage = require(path.join(ownPath, "package.json"));
  const appPackage = require(path.join(appPath, "package.json"));

  console.log("own", ownPackage, "app", appPackage);

  console.log(chalk.cyan("Updating the dependencies"));
  const ownPackageName = ownPackage.name;
  if (appPackage.devDependencies) {
    // We used to put react-scripts in devDependencies
    if (appPackage.devDependencies[ownPackageName]) {
      console.log(
        `  Removing ${chalk.cyan(ownPackageName)} from devDependencies`
      );
      delete appPackage.devDependencies[ownPackageName];
    }
  }
  appPackage.dependencies = appPackage.dependencies || {};
  if (appPackage.dependencies[ownPackageName]) {
    console.log(`  Removing ${chalk.cyan(ownPackageName)} from dependencies`);
    delete appPackage.dependencies[ownPackageName];
  }
  Object.keys(ownPackage.dependencies).forEach((key) => {
    // For some reason optionalDependencies end up in dependencies after install
    if (
      ownPackage.optionalDependencies &&
      ownPackage.optionalDependencies[key]
    ) {
      return;
    }
    console.log(`  Adding ${chalk.cyan(key)} to dependencies`);
    appPackage.dependencies[key] = ownPackage.dependencies[key];
  });
  // Sort the deps
  const unsortedDependencies = appPackage.dependencies;
  appPackage.dependencies = {};
  Object.keys(unsortedDependencies)
    .sort()
    .forEach((key) => {
      appPackage.dependencies[key] = unsortedDependencies[key];
    });
  console.log();

  console.log(chalk.cyan("Updating the scripts"));
  delete appPackage.scripts["eject"];
  Object.keys(appPackage.scripts).forEach((key) => {
    Object.keys(ownPackage.bin).forEach((binKey) => {
      const regex = new RegExp(binKey + " (\\w+)", "g");
      if (!regex.test(appPackage.scripts[key])) {
        return;
      }
      appPackage.scripts[key] = appPackage.scripts[key].replace(
        regex,
        "node scripts/$1.js"
      );
      console.log(
        `  Replacing ${chalk.cyan(`"${binKey} ${key}"`)} with ${chalk.cyan(
          `"node scripts/${key}.js"`
        )}`
      );
    });
  });

  console.log();
  console.log("app finlly", appPackage);
  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );
  spawn.sync("yarnpkg", ["--cwd", process.cwd()], { stdio: "inherit" });
});

// cd .. && rm -r 123 && yarn create-react-app 123
