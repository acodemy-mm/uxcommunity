"use strict";
const path = require("path");
const fs = require("fs");

const projectRoot = path.resolve(__dirname, "..");
const parentDir = path.dirname(projectRoot);
const parentNodeModules = path.join(parentDir, "node_modules");
const parentTailwind = path.join(parentNodeModules, "tailwindcss");
const targetTailwind = path.join(projectRoot, "node_modules", "tailwindcss");

if (!fs.existsSync(targetTailwind)) return;

try {
  if (!fs.existsSync(parentNodeModules)) fs.mkdirSync(parentNodeModules, { recursive: true });
  if (fs.existsSync(parentTailwind)) fs.rmSync(parentTailwind, { recursive: true });
  fs.symlinkSync(targetTailwind, parentTailwind, "dir");
} catch (e) {
  // ignore
}
