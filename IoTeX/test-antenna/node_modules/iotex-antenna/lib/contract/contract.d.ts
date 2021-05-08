/// <reference types="node" />
import { IAccount } from "../account/account";
import { SignerPlugin } from "../action/method";
import { Execution } from "../action/types";
import { IRpcMethod } from "../rpc-method/types";
import { ABIDefinition } from "./abi";
import { AbiByFunc } from "./abi-to-byte";
export declare type Options = {
    data?: Buffer;
    provider?: IRpcMethod;
    signer?: SignerPlugin;
};
export declare class Contract {
    private readonly abi?;
    private readonly address?;
    private readonly options?;
    provider?: IRpcMethod;
    readonly methods: {
        [funcName: string]: Function;
    };
    readonly decodeMethods: {
        [key: string]: DecodeMethod;
    };
    setProvider(provider: IRpcMethod): void;
    constructor(jsonInterface?: Array<ABIDefinition>, address?: string, options?: Options);
    getABI(): AbiByFunc | undefined;
    getAddress(): string | undefined;
    deploy(account: IAccount, inputs: Array<any>, amount?: string, gasLimit?: string | undefined, gasPrice?: string): Promise<string>;
    pureEncodeMethod(amount: string, method: string, ...args: Array<any>): Execution;
    encodeMethod(amount: string, method: string, input: {
        [key: string]: any;
    }, gasLimit?: string | undefined, gasPrice?: string): Execution;
    decodeMethodResult(method: string, result: string): any | Array<any>;
    decodeInput(data: string): DecodeData;
}
export interface MethodExecuteParameter {
    account: IAccount;
    amount?: string;
    gasLimit?: string;
    gasPrice?: string;
}
export interface DecodeData {
    method: string;
    data: {
        [key: string]: any;
    };
}
export interface DecodeMethod {
    name: string;
    inputsNames: [string];
    inputsTypes: [string];
}
