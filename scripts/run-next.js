"use strict";
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const env = { ...process.env, NODE_PATH: projectRoot };
const args = process.argv.slice(2);
const result = spawnSync("npx", ["next", ...args], {
  stdio: "inherit",
  env,
  cwd: projectRoot,
});
process.exit(result.status ?? 1);
