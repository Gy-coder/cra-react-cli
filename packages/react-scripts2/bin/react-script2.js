const spawn = require("cross-spawn");
const args = process.argv.slice(2);
const script = process.argv[0];

spawn.sync(process.execPath, [require.resolve(`../scripts/${script}`)], {
  stdio: "inherit",
});

console.log("run");
