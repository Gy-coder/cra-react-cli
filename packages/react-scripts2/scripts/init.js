function init(
  appPath, // path.resolve(appName)
  appName, // my-app
  verbose,
  originalDirectory, // process.cwd()
  templateName // cra-template
) {
  const appPackage = require(path.join(appPath, "package.json"));
  // 先拿到模板中的package.json文件 将package.json的内容做一个合并 merge
  const templatePath = path.dirname(
    require.resolve(`${templateName}/package.json`, { paths: [appPath] })
  );
  // 在package.json文件中新增几个命令 start build test eject
  appPackage.scripts = Object.assign({
    start: "react-scripts start",
    build: "react-scripts build",
  });
  // 其他一系列的设置 eslint config browsers list appPackage.xxx = xx
  // 写入package.json文件内容
  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );
}

module.exports = init;
