import BigNumber from "bignumber.js";
import { Account } from "../account/account";
import { Options } from "../contract/contract";
export interface Method {
    name: string;
    inputsNames: [string];
    inputsTypes: [string];
}
export interface DecodeData {
    method: string;
    data: {
        [key: string]: any;
    };
}
export interface ExecuteOption {
    account: Account;
    gasPrice: string;
    gasLimit: string;
}
export declare class XRC20 {
    address: string;
    private readonly contract;
    private readonly methods;
    private tokenName;
    private tokenSymbol;
    private tokenDecimals;
    private tokenTotalSupply;
    constructor(address: string, options?: Options);
    name(): Promise<string>;
    symbol(): Promise<string>;
    decimals(): Promise<BigNumber>;
    totalSupply(): Promise<BigNumber>;
    balanceOf(owner: string): Promise<BigNumber>;
    transfer(to: string, value: BigNumber, options: ExecuteOption): Promise<string>;
    allowance(owner: string, spender: string, options: ExecuteOption): Promise<string>;
    approve(spender: string, value: BigNumber, options: ExecuteOption): Promise<string>;
    transferFrom(from: string, to: string, value: BigNumber, options: ExecuteOption): Promise<string>;
    private readMethod;
    private executeMethod;
    decode(data: string): DecodeData;
}
