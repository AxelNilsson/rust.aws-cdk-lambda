/// <reference types="node" />
export interface BaseBuildProps {
    /**
     * Executable name to pass to `--bin`
     */
    readonly bin?: string;
    /**
     * Workspace package name to pass to `--package`
     */
    readonly package?: string;
    /**
     * The target to use `cargo lambda` to compile to.
     *
     * Normally you'll need to first add the target to your toolchain:
     *    $ rustup target add <target>
     *
     * The target defaults to `aarch64-unknown-linux-gnu` if not passed.
     */
    readonly target?: string;
    /**
     * A list of features to activate when compiling Rust code.
     */
    readonly features?: string[];
    /**
     * Key-value pairs that are passed in at compile time, i.e. to `cargo
     * build` or `cargo lambda`.
     *
     * Use environment variables to apply configuration changes, such
     * as test and production environment configurations, without changing your
     * Lambda function source code.
     *
     * @default - No environment variables.
     */
    readonly buildEnvironment?: NodeJS.ProcessEnv;
    /**
     * Additional arguments that are passed in at build time to `cargo lambda`.
     *
     * ## Examples
     *
     * - `--all-features`
     * - `--no-default-features`
     */
    readonly extraBuildArgs?: string[];
}
/**
 * Build options
 */
export interface BuildOptions extends BaseBuildProps {
    /**
     * Entry file
     */
    readonly entry: string;
    /**
     * The output directory
     */
    readonly outDir: string;
    readonly target: string;
}
/**
 * Build with `cargo lambda`
 */
export declare function build(options: BuildOptions): void;
