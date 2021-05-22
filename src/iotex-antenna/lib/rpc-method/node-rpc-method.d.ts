import { ClientReadableStream, IEstimateActionGasConsumptionRequest, IEstimateActionGasConsumptionResponse, IEstimateGasForActionRequest, IEstimateGasForActionResponse, IGetAccountRequest, IGetAccountResponse, IGetActionsRequest, IGetActionsResponse, IGetBlockMetasRequest, IGetBlockMetasResponse, IGetChainMetaRequest, IGetChainMetaResponse, IGetEpochMetaRequest, IGetEpochMetaResponse, IGetLogsRequest, IGetLogsResponse, IGetReceiptByActionRequest, IGetReceiptByActionResponse, IGetServerMetaRequest, IGetServerMetaResponse, IReadContractRequest, IReadContractResponse, IReadStateRequest, IReadStateResponse, IRpcMethod, ISendActionRequest, ISendActionResponse, IStreamBlocksRequest, IStreamBlocksResponse, IStreamLogsRequest, IStreamLogsResponse, ISuggestGasPriceRequest, ISuggestGasPriceResponse } from "./types";
declare type Opts = {
    timeout?: number;
    enableSsl?: boolean;
    apiToken?: string;
};
export default class RpcMethod implements IRpcMethod {
    client: IRpcMethod;
    timeout: number;
    apiToken?: string;
    private credentials;
    constructor(hostname: string, options?: Opts);
    setProvider(provider: string | IRpcMethod): void;
    getDeadline(): number;
    private getMetadata;
    getAccount(req: IGetAccountRequest): Promise<IGetAccountResponse>;
    getBlockMetas(req: IGetBlockMetasRequest): Promise<IGetBlockMetasResponse>;
    getChainMeta(req: IGetChainMetaRequest): Promise<IGetChainMetaResponse>;
    getServerMeta(req: IGetServerMetaRequest): Promise<IGetServerMetaResponse>;
    getActions(req: IGetActionsRequest): Promise<IGetActionsResponse>;
    suggestGasPrice(req: ISuggestGasPriceRequest): Promise<ISuggestGasPriceResponse>;
    getReceiptByAction(req: IGetReceiptByActionRequest): Promise<IGetReceiptByActionResponse>;
    readContract(req: IReadContractRequest): Promise<IReadContractResponse>;
    sendAction(req: ISendActionRequest): Promise<ISendActionResponse>;
    estimateGasForAction(req: IEstimateGasForActionRequest): Promise<IEstimateGasForActionResponse>;
    readState(req: IReadStateRequest): Promise<IReadStateResponse>;
    getEpochMeta(req: IGetEpochMetaRequest): Promise<IGetEpochMetaResponse>;
    getLogs(req: IGetLogsRequest): Promise<IGetLogsResponse>;
    estimateActionGasConsumption(req: IEstimateActionGasConsumptionRequest): Promise<IEstimateActionGasConsumptionResponse>;
    streamBlocks(req: IStreamBlocksRequest): ClientReadableStream<IStreamBlocksResponse>;
    streamLogs(req: IStreamLogsRequest): ClientReadableStream<IStreamLogsResponse>;
}
export {};
