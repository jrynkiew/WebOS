import { SignerPlugin } from "./action/method";
import { Contract } from "./contract/contract";
import { Iotx } from "./iotx";
import { WsSignerPlugin } from "./plugin/ws";
import { IRpcMethod } from "./rpc-method/types";
export declare type Opts = {
    signer?: SignerPlugin;
    timeout?: number;
    apiToken?: string;
};
export default class Antenna {
    iotx: Iotx;
    constructor(provider: string, opts?: Opts);
    static modules: {
        Iotx: typeof Iotx;
        WsSignerPlugin: typeof WsSignerPlugin;
        Contract: typeof Contract;
    };
    setProvider(provider: string | IRpcMethod): void;
    currentProvider(): IRpcMethod;
}
