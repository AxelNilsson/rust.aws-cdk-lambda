"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const _1 = require(".");
let _builtWorkspaces = false, _builtBinaries = false;
/**
 * Build with `cargo lambda`
 */
function build(options) {
    try {
        let outputName;
        let shouldCompile;
        let extra_args;
        // Build binary
        if (options.bin) {
            outputName = options.bin;
            if (_builtBinaries) {
                shouldCompile = false;
                extra_args = undefined;
            }
            else if (_1.Settings.BUILD_INDIVIDUALLY) {
                shouldCompile = true;
                extra_args = ['--bin', outputName];
            }
            else {
                _builtBinaries = true;
                shouldCompile = true;
                extra_args = ['--bins'];
            }
        }
        // Build package - i.e. workspace member
        else {
            outputName = options.package;
            if (_builtWorkspaces) {
                shouldCompile = false;
                extra_args = undefined;
            }
            else if (_1.Settings.BUILD_INDIVIDUALLY) {
                shouldCompile = true;
                extra_args = ['--package', outputName];
            }
            else {
                _builtWorkspaces = true;
                shouldCompile = true;
                extra_args = ['--workspace'];
            }
        }
        if (shouldCompile) {
            // Check if directory `./target/{{target}}/release` exists
            const releaseDirExists = (0, fs_1.existsSync)(options.outDir);
            // Base arguments for `cargo lambda`
            const buildArgs = ['--quiet', '--color', 'always'];
            let extraBuildArgs = options.extraBuildArgs || _1.Settings.EXTRA_BUILD_ARGS;
            let features = options.features || _1.Settings.FEATURES;
            if (extraBuildArgs) {
                buildArgs.push(...extraBuildArgs);
            }
            if (features) {
                buildArgs.push('--features', features.join(','));
            }
            // Set process environment (optional)
            let inputEnv = options.buildEnvironment ||
                _1.Settings.BUILD_ENVIRONMENT;
            const buildEnv = inputEnv
                ? {
                    ...process.env,
                    ...inputEnv,
                }
                : undefined;
            if (releaseDirExists) {
                console.log(`🍺  Building Rust code...`);
            }
            else {
                // The `release` directory doesn't exist for the specified
                // target. This is most likely an initial run, so `cargo lambda`
                // will take much longer than usual to cross-compile the code.
                //
                // Print out an informative message that the `build` step is
                // expected to take longer than usual.
                console.log(`🍺  Building Rust code with \`cargo lambda\`. This may take a few minutes...`);
            }
            const args = [
                'lambda',
                'build',
                '--lambda-dir',
                options.outDir,
                '--release',
                '--target',
                options.target,
                ...buildArgs,
                ...extra_args,
            ];
            const cargo = (0, child_process_1.spawnSync)('cargo', args, {
                cwd: options.entry,
                env: buildEnv,
            });
            if (cargo.status !== 0) {
                console.error(cargo.stderr.toString().trim());
                console.error(`💥  Run \`cargo lambda\` errored.`);
                process.exit(1);
                // Note: I don't want to raise an error here, as that will clutter the
                // output with the stack trace here. But maybe, there's a way to
                // suppress that?
                // throw new Error(cargo.stderr.toString().trim());
            }
        }
    }
    catch (err) {
        throw new Error(`Failed to build file at ${options.entry}: ${err}`);
    }
}
exports.build = build;
