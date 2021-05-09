/// <reference types="node" />
export interface BaseActionRequest {
    gasLimit?: string | undefined;
    gasPrice?: string | undefined;
}
export interface Transfer extends BaseActionRequest {
    amount: string;
    recipient: string;
    payload: string;
}
export interface Execution extends BaseActionRequest {
    contract: string;
    amount: string;
    data: Buffer;
}
export interface ClaimFromRewardingFund extends BaseActionRequest {
    amount: string;
    data: Buffer | {};
}
export interface StakeCreate extends BaseActionRequest {
    candidateName: string;
    stakedAmount: string;
    stakedDuration: number;
    autoStake: boolean;
    payload: string;
}
export interface StakeUnstake extends BaseActionRequest {
    bucketIndex: number;
    payload: string;
}
export interface StakeWithdraw extends BaseActionRequest {
    bucketIndex: number;
    payload: string;
}
export interface StakeAddDeposit extends BaseActionRequest {
    bucketIndex: number;
    amount: string;
    payload: string;
}
export interface StakeRestake extends BaseActionRequest {
    bucketIndex: number;
    stakedDuration: number;
    autoStake: boolean;
    payload: string;
}
export interface StakeChangeCandidate extends BaseActionRequest {
    bucketIndex: number;
    candidateName: string;
    payload: string;
}
export interface StakeTransferOwnership extends BaseActionRequest {
    bucketIndex: number;
    voterAddress: string;
    payload: string;
}
export interface CandidateRegister extends BaseActionRequest {
    name: string;
    operatorAddress: string;
    rewardAddress: string;
    stakedAmount: string;
    stakedDuration: number;
    autoStake: boolean;
    ownerAddress: string;
    payload: string;
}
export interface CandidateUpdate extends BaseActionRequest {
    name: string;
    operatorAddress: string;
    rewardAddress: string;
}
export declare enum ActionErrorCode {
    ErrExistedAction = 0,
    ErrBalance = 1,
    ErrNonce = 2,
    ErrAddress = 3,
    ErrGasPrice = 4,
    ErrUnknown = 5
}
export declare class ActionError extends Error {
    code: ActionErrorCode;
    constructor(code: ActionErrorCode, message: string);
}
