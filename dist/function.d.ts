import { Construct } from 'constructs';
import { BaseBuildProps } from './build';
import { Function, FunctionOptions } from 'aws-cdk-lib/aws-lambda';
/**
 * Properties for a RustFunction
 */
export interface RustFunctionProps extends FunctionOptions, BaseBuildProps {
    /**
     * Path to directory with Cargo.toml
     *
     * @default - Directory from where cdk binary is invoked
     */
    readonly directory?: string;
    /**
     * The build directory
     *
     * @default - `.build` in the entry file directory
     */
    readonly buildDir?: string;
    /**
     * The cache directory
     *
     * Parcel uses a filesystem cache for fast rebuilds.
     *
     * @default - `.cache` in the root directory
     */
    readonly cacheDir?: string;
    /**
     * Determines whether we want to set up library logging - i.e. set the
     * `RUST_LOG` environment variable - for the lambda function.
     */
    readonly setupLogging?: boolean;
}
/**
 * A Rust Lambda function built using `cargo lambda`
 */
export declare class RustFunction extends Function {
    constructor(scope: Construct, id: string, props: RustFunctionProps);
}
