import { Architecture } from 'aws-cdk-lib/aws-lambda';
import { LAMBDA_TARGETS } from './settings';
/**
 * Base layout of a `Cargo.toml` file in a Rust project
 *
 * Note: This is only used when `RustFunctionProps.bin` is not defined.
 */
export interface CargoTomlProps {
    readonly package: {
        name: string;
    };
}
export declare function asBool(value: any, defaultValue?: string): boolean;
export declare function logTime(start: number, message: string): void;
export declare function ensureDirExists(dir: string, recursive?: boolean): void;
export declare function createFile(filePath: string, data: string): void;
export declare function getPackageName(entry: string): string;
export declare function lambdaArchitecture(target: LAMBDA_TARGETS): Architecture;
