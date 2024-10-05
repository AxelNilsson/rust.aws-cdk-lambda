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
exports.Bundling = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const path_1 = require("path");
/**
 * Bundling
 */
class Bundling {
    static bundle(options) {
        const bundling = new Bundling(options);
        return aws_lambda_1.Code.fromAsset((0, path_1.dirname)(options.handlerDir), {
            assetHashType: cdk.AssetHashType.OUTPUT,
            bundling: {
                image: bundling.image,
                local: bundling.local,
            },
        });
    }
    constructor(props) {
        // Local bundling
        this.props = props;
        this.image = cdk.DockerImage.fromRegistry('dummy'); // Do not build if we don't need to
        this.local = {
            tryBundle(outputDir) {
                // TODO
                console.log(`BUNDLING...: ${outputDir}`);
                return true;
            },
        };
    }
}
exports.Bundling = Bundling;
