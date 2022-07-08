const fs = require("fs-extra");
const spawn = require("cross-spawn");

function init(
  appPath, // path.resolve(appName)
  appName, // my-app
  verbose,
  originalDir,
  templateName // cra-template
) {
  const appPackage = require(path.join(appPath, "package.json"));
  // 先拿到模板中的package.json文件 将package.json的内容做一个合并 merge
  const templatePath = path.dirname(
    require.resolve(`${templateName}/package.json`, { paths: [appPath] })
  );
  // 在package.json文件中新增几个命令 start build test eject
  appPackage.scripts = Object.assign({
    start: "moon-scripts start",
    build: "moon-scripts build",
    eject: "moon-scripts eject",
  });
  // 其他一系列的设置 eslint config browsers list appPackage.xxx = xx
  // 写入package.json文件内容
  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );
  let command = "yarnpkg",
    remove = "remove",
    args = ["add"];
  const templateDir = path.join(templatePath, "template");
  fs.copySync(templateDir, appPath); // 将template中的内容拷贝过来
  console.log(`Installing template dependencies using ${command}...`);
  spawn.sync(command, args, { stdio: "inherit" });
  console.log(`Removing template package using ${command}...`);
  spawn.sync(command, [remove, templateName], {
    stdio: "inherit",
  });
  console.log(`Success! Created ${appName} at ${appPath}`);
}

module.exports = init;
