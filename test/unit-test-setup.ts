// Unit test setup - provide VS Code mock via module cache manipulation
// This runs before any tests and ensures 'vscode' module resolves to our mock

// Direct CommonJS require for Module access
const Module = require("module");

// Load VS Code mock via require so this file remains a CommonJS script
// (no ES module import declarations) - required for TypeScript 6.0 compatibility
// where require/NodeJS globals are not available in module-scope files.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vscode = require("./vscode-mock") as Record<string, unknown>;

// Store original _resolveFilename
const originalResolveFilename = Module._resolveFilename;

// Override module resolution for 'vscode' requests
Module._resolveFilename = function (
  request: string,
  parent: any,
  isMain?: boolean,
  options?: any,
) {
  if (request === "vscode") {
    return "vscode-mock";
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Register mock in cache with complete Module interface
(require.cache as any)["vscode-mock"] = {
  id: "vscode-mock",
  filename: "vscode-mock",
  loaded: true,
  children: [],
  parent: null,
  paths: [],
  isPreloading: false,
  path: "vscode-mock",
  require: require,
  exports: vscode,
} as NodeJS.Module;

console.log("✓ VS Code mock registered for unit tests");
