/// <reference types="node" />
export interface IRequest {
    reqId: number;
    type: "SIGN_AND_SEND" | "GET_ACCOUNTS" | "SIGN_MSG";
    envelop?: string;
    origin?: string;
    msg?: string | Buffer | Uint8Array;
}
