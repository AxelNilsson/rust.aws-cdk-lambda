import * as cdk from 'aws-cdk-lib';
import { DockerRunOptions } from 'aws-cdk-lib';
import { Architecture, AssetCode, Runtime } from 'aws-cdk-lib/aws-lambda';
/**
 * Options for bundling
 */
export interface BundlingProps extends DockerRunOptions {
    /**
     * CDK output (staging) directory for the lambda function
     */
    readonly handlerDir: string;
    /**
     * The runtime of the lambda function
     */
    readonly runtime: Runtime;
    /**
     * The system architecture of the lambda function
     */
    readonly architecture: Architecture;
}
/**
 * Bundling
 */
export declare class Bundling implements cdk.BundlingOptions {
    private readonly props;
    static bundle(options: BundlingProps): AssetCode;
    readonly image: cdk.DockerImage;
    readonly local?: cdk.ILocalBundling;
    constructor(props: BundlingProps);
}
