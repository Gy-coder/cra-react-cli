#!/usr/bin/env node

const spawn = require("cross-spawn");
const args = process.argv.slice(2); // ['build']

// 执行scripts目录下对应的文件 build.js start.js eject.js test.js
spawn.sync(process.execPath, [require.resolve("../scripts/" + args[0])], {
  stdio: "inherit",
});
