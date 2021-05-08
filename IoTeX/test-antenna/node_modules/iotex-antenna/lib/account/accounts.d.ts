/// <reference types="node" />
import { Account } from "./account";
import { IAccount } from "./account";
export declare class Accounts extends Array<IAccount> {
    private readonly wallet;
    constructor();
    create(entropy?: string): IAccount;
    privateKeyToAccount(privateKey: string): IAccount;
    addressToAccount(address: string): IAccount;
    addAccount(account: Account): IAccount;
    getAccount(address: string): IAccount | undefined;
    removeAccount(address: string): void;
    sign(data: string | Buffer | Uint8Array, privateKey: string): Promise<Buffer>;
}
