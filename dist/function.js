"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustFunction = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const path_1 = require("path");
const perf_hooks_1 = require("perf_hooks");
const _1 = require(".");
const build_1 = require("./build");
// import { Bundling } from './bundling';
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const utils_1 = require("./utils");
/**
 * A Rust Lambda function built using `cargo lambda`
 */
class RustFunction extends aws_lambda_1.Function {
    constructor(scope, id, props) {
        const entry = props.directory || _1.Settings.ENTRY;
        const handler = 'does.not.matter';
        const target = props.target || _1.Settings.TARGET;
        const arch = props.architecture || (0, utils_1.lambdaArchitecture)(target);
        const buildDir = props.buildDir || _1.Settings.BUILD_DIR;
        let executable;
        let binName;
        if (props.package) {
            binName = undefined;
            executable = props.package;
        }
        else {
            binName = props.bin || (0, utils_1.getPackageName)(entry);
            executable = binName;
        }
        const handlerDir = (0, path_1.join)(buildDir, executable);
        // Check if we really need to build with `cargo-lambda`.
        // In certain cases, such as calling `cdk destroy`
        // or `cdk list`, the compile step should not run.
        const thisStack = aws_cdk_lib_1.Stack.of(scope);
        const shouldBuild = thisStack.bundlingRequired;
        // Check if `build` context value is passed in
        // to command-line. For example:
        //     $ cdk deploy -c build=no
        if (_1.Settings.SKIP_BUILD === undefined)
            _1.Settings.SKIP_BUILD = !(0, utils_1.asBool)(scope.node.tryGetContext('build'), 'T');
        // Build with `cargo-lambda`
        if (shouldBuild && !_1.Settings.SKIP_BUILD) {
            let start = perf_hooks_1.performance.now();
            (0, build_1.build)({
                ...props,
                entry,
                bin: binName,
                target: target,
                outDir: buildDir,
            });
            (0, utils_1.logTime)(start, `🎯  Cross-compile \`${executable}\``);
        }
        // Else, skip the build (or bundle) step.
        //
        // At a minimum, we need to ensure the output directory
        // exists -- otherwise, CDK complains that it can't
        // locate the asset.
        else
            (0, utils_1.ensureDirExists)(handlerDir);
        let lambdaEnv = props.environment;
        // Sets up logging if needed.
        //   Ref: https://rust-lang-nursery.github.io/rust-cookbook/development_tools/debugging/config_log.html
        if (props.setupLogging) {
            lambdaEnv = lambdaEnv || {};
            // Need to use the *underscore*- separated variant, which is
            // coincidentally how Rust imports are done.
            let underscoredName = executable.split('-').join('_');
            // Set the `RUST_LOG` environment variable.
            lambdaEnv.RUST_LOG = `${_1.Settings.DEFAULT_LOG_LEVEL},${underscoredName}=${_1.Settings.MODULE_LOG_LEVEL}`;
        }
        super(scope, id, {
            ...props,
            runtime: _1.Settings.RUNTIME,
            architecture: arch,
            code: aws_lambda_1.Code.fromAsset(handlerDir),
            // code: Bundling.bundle({
            //     handlerDir,
            //     runtime: Settings.RUNTIME,
            //     architecture: arch,
            // }),
            handler: handler,
            environment: lambdaEnv,
        });
    }
}
exports.RustFunction = RustFunction;
