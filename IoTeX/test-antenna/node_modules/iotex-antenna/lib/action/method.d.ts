/// <reference types="node" />
import { Account, IAccount } from "../account/account";
import { IAction, IRpcMethod } from "../rpc-method/types";
import { Envelop, SealedEnvelop } from "./envelop";
import { CandidateRegister, CandidateUpdate, ClaimFromRewardingFund, Execution, StakeAddDeposit, StakeChangeCandidate, StakeCreate, StakeRestake, StakeTransferOwnership, StakeUnstake, StakeWithdraw, Transfer } from "./types";
export interface PluginOpts {
    address: string;
}
export interface SignerPlugin {
    signAndSend?(envelop: Envelop, options?: PluginOpts): Promise<string>;
    signOnly?(envelop: Envelop, options?: PluginOpts): Promise<SealedEnvelop>;
    getAccount?(address: string): Promise<IAccount>;
    getAccounts?(): Promise<Array<IAccount>>;
    signMessage?(data: string | Buffer | Uint8Array): Promise<Buffer>;
}
export declare type AbstractMethodOpts = {
    signer?: SignerPlugin | undefined;
};
export declare class AbstractMethod {
    client: IRpcMethod;
    account: Account;
    signer?: SignerPlugin;
    constructor(client: IRpcMethod, account: Account, opts?: AbstractMethodOpts);
    baseEnvelop(gasLimit?: string, gasPrice?: string): Promise<Envelop>;
    signAction(envelop: Envelop): Promise<SealedEnvelop>;
    sendAction(envelop: Envelop): Promise<string>;
}
export declare class TransferMethod extends AbstractMethod {
    transfer: Transfer;
    constructor(client: IRpcMethod, account: Account, transfer: Transfer, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
}
export declare class ExecutionMethod extends AbstractMethod {
    execution: Execution;
    constructor(client: IRpcMethod, account: Account, execution: Execution, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class ClaimFromRewardingFundMethod extends AbstractMethod {
    claimFronRewardFund: ClaimFromRewardingFund;
    constructor(client: IRpcMethod, account: Account, claim: ClaimFromRewardingFund, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeCreateMethod extends AbstractMethod {
    target: StakeCreate;
    constructor(client: IRpcMethod, account: Account, target: StakeCreate, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeUnstakeMethod extends AbstractMethod {
    target: StakeUnstake;
    constructor(client: IRpcMethod, account: Account, target: StakeUnstake, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeWithdrawMethod extends AbstractMethod {
    target: StakeWithdraw;
    constructor(client: IRpcMethod, account: Account, target: StakeWithdraw, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeAddDepositMethod extends AbstractMethod {
    target: StakeAddDeposit;
    constructor(client: IRpcMethod, account: Account, target: StakeAddDeposit, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeRestakeMethod extends AbstractMethod {
    target: StakeRestake;
    constructor(client: IRpcMethod, account: Account, target: StakeRestake, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeChangeCandidateMethod extends AbstractMethod {
    target: StakeChangeCandidate;
    constructor(client: IRpcMethod, account: Account, target: StakeChangeCandidate, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class StakeTransferOwnershipMethod extends AbstractMethod {
    target: StakeTransferOwnership;
    constructor(client: IRpcMethod, account: Account, target: StakeTransferOwnership, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class CandidateRegisterMethod extends AbstractMethod {
    target: CandidateRegister;
    constructor(client: IRpcMethod, account: Account, target: CandidateRegister, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
export declare class CandidateUpdateMethod extends AbstractMethod {
    target: CandidateUpdate;
    constructor(client: IRpcMethod, account: Account, target: CandidateUpdate, opts?: AbstractMethodOpts);
    execute(): Promise<string>;
    sign(): Promise<IAction>;
}
