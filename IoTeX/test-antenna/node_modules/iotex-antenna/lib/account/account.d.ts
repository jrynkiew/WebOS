/// <reference types="node" />
import { SignerPlugin } from "../action/method";
export interface IAccount {
    address: string;
    privateKey: string;
    publicKey: string;
    sign(data: string | Buffer | Uint8Array): Promise<Buffer>;
    recover(message: string, signature: Buffer, preFixed: boolean): string;
    hashMessage(data: string | Buffer | Uint8Array): Buffer;
}
export declare class Account implements IAccount {
    address: string;
    privateKey: string;
    publicKey: string;
    static fromPrivateKey(privateKey: string): IAccount;
    static fromAddress(address: string): IAccount;
    sign(data: string | Buffer | Uint8Array): Promise<Buffer>;
    recover(message: string | Buffer | Uint8Array, signature: Buffer, preFixed?: boolean): string;
    hashMessage(data: string | Buffer | Uint8Array): Buffer;
}
export declare class RemoteAccount extends Account {
    address: string;
    privateKey: string;
    publicKey: string;
    private readonly sp;
    constructor(address: string, sp: SignerPlugin);
    sign(data: string | Buffer | Uint8Array): Promise<Buffer>;
}
