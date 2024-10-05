"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaArchitecture = exports.getPackageName = exports.createFile = exports.ensureDirExists = exports.logTime = exports.asBool = void 0;
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const fs_1 = require("fs");
const path_1 = require("path");
const perf_hooks_1 = require("perf_hooks");
const toml = __importStar(require("toml"));
const truthyValues = ['T', 'TRUE', 'OK', 'ON', '1', 'Y', 'YES'];
function asBool(value, defaultValue = 'F') {
    return truthyValues.includes((value !== null && value !== void 0 ? value : defaultValue).toUpperCase());
}
exports.asBool = asBool;
function logTime(start, message) {
    const elapsedSec = ((perf_hooks_1.performance.now() - start) / 1000).toFixed(6);
    console.log(`${message}: ${elapsedSec}s`);
}
exports.logTime = logTime;
function ensureDirExists(dir, recursive = true) {
    if (!(0, fs_1.existsSync)(dir))
        (0, fs_1.mkdirSync)(dir, { recursive });
}
exports.ensureDirExists = ensureDirExists;
function createFile(filePath, data) {
    if (!(0, fs_1.existsSync)(filePath)) {
        (0, fs_1.writeFileSync)(filePath, data);
    }
}
exports.createFile = createFile;
function getPackageName(entry) {
    const tomlFilePath = (0, path_1.join)(entry, 'Cargo.toml');
    // console.trace(`Parsing TOML file at ${tomlFilePath}`);
    try {
        const contents = (0, fs_1.readFileSync)(tomlFilePath, 'utf8');
        let data = toml.parse(contents);
        return data.package.name;
    }
    catch (err) {
        throw new Error(`Unable to parse package name from \`${tomlFilePath}\`\n` +
            `  ${err}\n` +
            `  Resolution: Pass the executable as the \`bin\` parameter, ` +
            `or as \`package\` for a workspace.`);
    }
}
exports.getPackageName = getPackageName;
function lambdaArchitecture(target) {
    return target.startsWith('x86_64')
        ? aws_lambda_1.Architecture.X86_64
        : aws_lambda_1.Architecture.ARM_64;
}
exports.lambdaArchitecture = lambdaArchitecture;
