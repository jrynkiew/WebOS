/// <reference types="node" />
import WebSocket from "isomorphic-ws";
import { Account } from "../../account/account";
import { Envelop } from "../../action/envelop";
import { SignerPlugin } from "../../action/method";
export interface WsSignerPluginOptions {
    retryCount: number;
    retryDuration: number;
}
export interface WsRequest {
    [key: string]: any;
}
export declare class WsSignerPlugin implements SignerPlugin {
    ws: WebSocket;
    private readonly provider;
    private readonly options;
    constructor(provider?: string, options?: WsSignerPluginOptions);
    private init;
    send(req: WsRequest): void;
    private reconnectAndSend;
    signAndSend(envelop: Envelop): Promise<string>;
    getAccount(address: string): Promise<Account>;
    getAccounts(): Promise<Array<Account>>;
    getOrigin(plugin?: string): string;
    signMessage(data: string | Buffer | Uint8Array): Promise<Buffer>;
}
