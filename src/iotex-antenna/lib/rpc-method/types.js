"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toActionTransfer = toActionTransfer;
exports.toTimestamp = toTimestamp;
exports.toActionExecution = toActionExecution;
exports.toActionStartSubChain = toActionStartSubChain;
exports.toActionStopSubChain = toActionStopSubChain;
exports.toActionPutBlock = toActionPutBlock;
exports.toActionCreateDeposit = toActionCreateDeposit;
exports.toActionSettleDeposit = toActionSettleDeposit;
exports.toActionCreatePlumChain = toActionCreatePlumChain;
exports.toActionTerminatePlumChain = toActionTerminatePlumChain;
exports.toActionPlumPutBlock = toActionPlumPutBlock;
exports.toActionPlumCreateDeposit = toActionPlumCreateDeposit;
exports.toActionPlumStartExit = toActionPlumStartExit;
exports.toActionPlumChallengeExit = toActionPlumChallengeExit;
exports.toActionPlumResponseChallengeExit = toActionPlumResponseChallengeExit;
exports.toActionPlumFinalizeExit = toActionPlumFinalizeExit;
exports.toActionPlumSettleDeposit = toActionPlumSettleDeposit;
exports.toActionPlumTransfer = toActionPlumTransfer;
exports.toActionDepositToRewardingFund = toActionDepositToRewardingFund;
exports.toActionClaimFromRewardingFund = toActionClaimFromRewardingFund;
exports.toActionGrantReward = toActionGrantReward;
exports.toActionStakeCreate = toActionStakeCreate;
exports.toActionStakeReclaim = toActionStakeReclaim;
exports.toActionStakeAddDeposit = toActionStakeAddDeposit;
exports.toActionStakeRestake = toActionStakeRestake;
exports.toActionStakeChangeCandidate = toActionStakeChangeCandidate;
exports.toActionStakeTransferOwnership = toActionStakeTransferOwnership;
exports.toActionCandidateRegister = toActionCandidateRegister;
exports.toActionCandidateBasicInfo = toActionCandidateBasicInfo;
exports.toAction = toAction;
exports.fromPbReceipt = fromPbReceipt;
exports.IReadStakingDataRequestToBuffer = exports.IReadStakingDataMethodToBuffer = exports.ClientReadableStream = exports.StreamLogsRequest = exports.StreamBlocksRequest = exports.EstimateActionGasConsumptionRequest = exports.GetLogsRequest = exports.GetEpochMetaRequest = exports.ReadStateRequest = exports.EstimateGasForActionRequest = exports.SendActionResponse = exports.SendActionRequest = exports.ReadContractRequest = exports.GetReceiptByActionRequest = exports.ReceiptStatus = exports.SuggestGasPriceRequest = exports.GetActionsRequest = exports.IReadStakingDataMethodName = exports.GetBlockMetasRequest = exports.GetServerMetaRequest = exports.GetChainMetaRequest = exports.GetAccountRequest = void 0;

var _events = require("events");

var _timestamp_pb = require("google-protobuf/google/protobuf/timestamp_pb");

var _api_pb = _interopRequireDefault(require("../../protogen/proto/api/api_pb"));

var _read_state_pb = require("../../protogen/proto/api/read_state_pb");

var _action_pb = _interopRequireDefault(require("../../protogen/proto/types/action_pb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const GetAccountRequest = {
  to(req) {
    const pbReq = new _api_pb.default.GetAccountRequest();
    pbReq.setAddress(req.address);
    return pbReq;
  },

  from(pbRes) {
    const meta = pbRes.getAccountmeta();

    if (!meta) {
      return {
        accountMeta: undefined
      };
    }

    return {
      accountMeta: {
        address: meta.getAddress(),
        balance: meta.getBalance(),
        nonce: meta.getNonce(),
        pendingNonce: meta.getPendingnonce(),
        numActions: meta.getNumactions()
      }
    };
  }

}; // interface for get chain meta

exports.GetAccountRequest = GetAccountRequest;
const GetChainMetaRequest = {
  // @ts-ignore
  to(req) {
    return new _api_pb.default.GetChainMetaRequest();
  },

  from(pbRes) {
    const meta = pbRes.getChainmeta();
    const res = {
      chainMeta: meta
    };

    if (meta) {
      const epochData = meta.getEpoch();
      res.chainMeta = {
        height: meta.getHeight(),
        numActions: meta.getNumactions(),
        tps: meta.getTps(),
        epoch: {
          num: epochData && epochData.getNum(),
          height: epochData && epochData.getHeight(),
          gravityChainStartHeight: epochData && epochData.getGravitychainstartheight()
        }
      };
    }

    return res;
  }

}; // interface for get server metas

exports.GetChainMetaRequest = GetChainMetaRequest;
// @ts-ignore
const GetServerMetaRequest = {
  // @ts-ignore
  to(req) {
    return new _api_pb.default.GetServerMetaRequest();
  },

  from(pbRes) {
    const meta = pbRes.getServermeta();

    if (!meta) {
      return {
        serverMeta: undefined
      };
    }

    return {
      serverMeta: {
        packageVersion: meta.getPackageversion(),
        packageCommitID: meta.getPackagecommitid(),
        gitStatus: meta.getGitstatus(),
        goVersion: meta.getGoversion(),
        buildTime: meta.getBuildtime()
      }
    };
  }

}; // interface for get block metas
// Properties of a GetBlockMetasByIndexRequest.

exports.GetServerMetaRequest = GetServerMetaRequest;
const GetBlockMetasRequest = {
  to(req) {
    const pbReq = new _api_pb.default.GetBlockMetasRequest();

    if (req.byIndex) {
      const pbReqByIndex = new _api_pb.default.GetBlockMetasByIndexRequest();

      if (req.byIndex.start) {
        pbReqByIndex.setStart(req.byIndex.start);
      }

      if (req.byIndex.count) {
        pbReqByIndex.setCount(req.byIndex.count);
      }

      pbReq.setByindex(pbReqByIndex);
    } else if (req.byHash) {
      const pbReqByHash = new _api_pb.default.GetBlockMetaByHashRequest();
      pbReqByHash.setBlkhash(req.byHash.blkHash);
      pbReq.setByhash(pbReqByHash);
    }

    return pbReq;
  },

  from(pbRes) {
    const metas = pbRes.getBlkmetasList();
    const res = {
      blkMetas: metas,
      total: pbRes.getTotal()
    };

    if (metas) {
      const parsedMetas = [];

      for (let i = 0; i < metas.length; i++) {
        parsedMetas[i] = {
          hash: metas[i].getHash(),
          height: metas[i].getHeight(),
          timestamp: metas[i].getTimestamp(),
          numActions: metas[i].getNumactions(),
          producerAddress: metas[i].getProduceraddress(),
          transferAmount: metas[i].getTransferamount(),
          txRoot: metas[i].getTxroot(),
          receiptRoot: metas[i].getReceiptroot(),
          deltaStateDigest: metas[i].getDeltastatedigest()
        };
      }

      res.blkMetas = parsedMetas;
    }

    return res;
  }

}; // interface for get actions
// Properties of a GetActionsByIndexRequest.

exports.GetBlockMetasRequest = GetBlockMetasRequest;
let IReadStakingDataMethodName;
exports.IReadStakingDataMethodName = IReadStakingDataMethodName;

(function (IReadStakingDataMethodName) {
  IReadStakingDataMethodName[IReadStakingDataMethodName["INVALID"] = 0] = "INVALID";
  IReadStakingDataMethodName[IReadStakingDataMethodName["BUCKETS"] = 1] = "BUCKETS";
  IReadStakingDataMethodName[IReadStakingDataMethodName["BUCKETS_BY_VOTER"] = 2] = "BUCKETS_BY_VOTER";
  IReadStakingDataMethodName[IReadStakingDataMethodName["BUCKETS_BY_CANDIDATE"] = 3] = "BUCKETS_BY_CANDIDATE";
  IReadStakingDataMethodName[IReadStakingDataMethodName["CANDIDATES"] = 4] = "CANDIDATES";
  IReadStakingDataMethodName[IReadStakingDataMethodName["CANDIDATE_BY_NAME"] = 5] = "CANDIDATE_BY_NAME";
  IReadStakingDataMethodName[IReadStakingDataMethodName["BUCKETS_BY_INDEXES"] = 6] = "BUCKETS_BY_INDEXES";
  IReadStakingDataMethodName[IReadStakingDataMethodName["CANDIDATE_BY_ADDRESS"] = 7] = "CANDIDATE_BY_ADDRESS";
  IReadStakingDataMethodName[IReadStakingDataMethodName["TOTAL_STAKING_AMOUNT"] = 8] = "TOTAL_STAKING_AMOUNT";
  IReadStakingDataMethodName[IReadStakingDataMethodName["BUCKETS_COUNT"] = 9] = "BUCKETS_COUNT";
})(IReadStakingDataMethodName || (exports.IReadStakingDataMethodName = IReadStakingDataMethodName = {}));

function toActionTransfer(req) {
  if (!req) {
    return undefined;
  }

  const pbTransfer = new _action_pb.default.Transfer();
  pbTransfer.setAmount(req.amount);
  pbTransfer.setRecipient(req.recipient);
  pbTransfer.setPayload(req.payload);
  return pbTransfer;
}

function toTimestamp(timestamp) {
  const ts = new _timestamp_pb.Timestamp();

  if (timestamp) {
    ts.setSeconds(timestamp.seconds);
    ts.setNanos(timestamp.nanos);
  }

  return ts;
}

function toActionExecution(req) {
  if (!req) {
    return undefined;
  }

  const pbExecution = new _action_pb.default.Execution();
  pbExecution.setAmount(req.amount);
  pbExecution.setContract(req.contract);
  pbExecution.setData(req.data);
  return pbExecution;
}

function toActionStartSubChain(req) {
  if (!req) {
    return undefined;
  }

  const pbStartSubChain = new _action_pb.default.StartSubChain();
  pbStartSubChain.setChainid(req.chainID);
  pbStartSubChain.setSecuritydeposit(req.securityDeposit);
  pbStartSubChain.setOperationdeposit(req.operationDeposit);
  pbStartSubChain.setStartheight(req.startHeight);
  pbStartSubChain.setParentheightoffset(req.parentHeightOffset);
  return pbStartSubChain;
}

function toActionStopSubChain(req) {
  if (!req) {
    return undefined;
  }

  const pbStopSubChain = new _action_pb.default.StopSubChain(); // @ts-ignore

  pbStopSubChain.setChainid(req.chainID); // @ts-ignore

  pbStopSubChain.setStopheight(req.stopHeight); // @ts-ignore

  pbStopSubChain.setSubchainaddress(req.subChainAddress);
  return pbStopSubChain;
}

function toActionPutBlock(req) {
  if (!req) {
    return undefined;
  }

  const roots = req.roots;
  const rootList = [];

  if (req.roots && roots) {
    for (let i = 0; i < req.roots.length; i++) {
      const rootItem = req.roots && req.roots[i];
      const mkroot = new _action_pb.default.MerkleRoot();
      mkroot.setName(rootItem.name);
      mkroot.setValue(rootItem.value);
      rootList[i] = mkroot;
    }
  }

  const pbPutBlock = new _action_pb.default.PutBlock();
  pbPutBlock.setSubchainaddress(req.subChainAddress);
  pbPutBlock.setHeight(req.height);
  pbPutBlock.setRootsList(rootList);
  return pbPutBlock;
}

function toActionCreateDeposit(req) {
  if (!req) {
    return undefined;
  }

  const pbCreateDeposit = new _action_pb.default.CreateDeposit();
  pbCreateDeposit.setChainid(req.chainID);
  pbCreateDeposit.setAmount(req.amount);
  pbCreateDeposit.setRecipient(req.recipient);
  return pbCreateDeposit;
}

function toActionSettleDeposit(req) {
  if (!req) {
    return undefined;
  }

  const pbSettleDeposit = new _action_pb.default.SettleDeposit();
  pbSettleDeposit.setAmount(req.amount);
  pbSettleDeposit.setRecipient(req.recipient);
  pbSettleDeposit.setIndex(req.index);
  return pbSettleDeposit;
}

function toActionCreatePlumChain(req) {
  if (!req) {
    return undefined;
  }

  return new _action_pb.default.CreatePlumChain();
}

function toActionTerminatePlumChain(req) {
  if (!req) {
    return undefined;
  }

  const pbTerminatePlumChain = new _action_pb.default.TerminatePlumChain();
  pbTerminatePlumChain.setSubchainaddress(req.subChainAddress);
  return pbTerminatePlumChain;
}

function toActionPlumPutBlock(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumPutBlock = new _action_pb.default.PlumPutBlock();
  pbPlumPutBlock.setSubchainaddress(req.subChainAddress);
  pbPlumPutBlock.setHeight(req.height);
  return pbPlumPutBlock;
}

function toActionPlumCreateDeposit(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumCreateDeposit = new _action_pb.default.PlumCreateDeposit(); // @ts-ignore

  pbPlumCreateDeposit.setSubchainaddress(req.subChainAddress); // @ts-ignore

  pbPlumCreateDeposit.setAmount(req.amount); // @ts-ignore

  pbPlumCreateDeposit.setRecipient(req.recipient);
  return pbPlumCreateDeposit;
}

function toActionPlumStartExit(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumStartExit = new _action_pb.default.PlumStartExit();
  pbPlumStartExit.setSubchainaddress(req.subChainAddress);
  pbPlumStartExit.setPrevioustransfer(req.previousTransfer);
  pbPlumStartExit.setPrevioustransferblockproof(req.previousTransferBlockProof);
  pbPlumStartExit.setPrevioustransferblockheight(req.previousTransferBlockHeight);
  pbPlumStartExit.setExittransfer(req.exitTransfer);
  pbPlumStartExit.setExittransferblockproof(req.exitTransferBlockProof);
  pbPlumStartExit.setExittransferblockheight(req.exitTransferBlockHeight);
  return pbPlumStartExit;
}

function toActionPlumChallengeExit(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumChallengeExit = new _action_pb.default.PlumChallengeExit();
  pbPlumChallengeExit.setSubchainaddress(req.subChainAddress);
  pbPlumChallengeExit.setCoinid(req.coinID);
  pbPlumChallengeExit.setChallengetransfer(req.challengeTransfer);
  pbPlumChallengeExit.setChallengetransferblockproof(req.challengeTransferBlockProof);
  pbPlumChallengeExit.setChallengetransferblockheight(req.challengeTransferBlockHeight);
  return pbPlumChallengeExit;
}

function toActionPlumResponseChallengeExit(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumResponseChallengeExit = new _action_pb.default.PlumResponseChallengeExit();
  pbPlumResponseChallengeExit.setSubchainaddress(req.subChainAddress);
  pbPlumResponseChallengeExit.setCoinid(req.coinID);
  pbPlumResponseChallengeExit.setChallengetransfer(req.challengeTransfer);
  pbPlumResponseChallengeExit.setResponsetransfer(req.responseTransfer);
  pbPlumResponseChallengeExit.setResponsetransferblockproof(req.responseTransferBlockProof);
  return pbPlumResponseChallengeExit;
}

function toActionPlumFinalizeExit(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumFinalizeExit = new _action_pb.default.PlumFinalizeExit();
  pbPlumFinalizeExit.setSubchainaddress(req.subChainAddress);
  pbPlumFinalizeExit.setCoinid(req.coinID);
  return pbPlumFinalizeExit;
}

function toActionPlumSettleDeposit(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumSettleDeposit = new _action_pb.default.PlumSettleDeposit();
  pbPlumSettleDeposit.setCoinid(req.coinID);
  return pbPlumSettleDeposit;
}

function toActionPlumTransfer(req) {
  if (!req) {
    return undefined;
  }

  const pbPlumTransfer = new _action_pb.default.PlumTransfer();
  pbPlumTransfer.setCoinid(req.coinID);
  pbPlumTransfer.setDenomination(req.denomination);
  pbPlumTransfer.setOwner(req.owner);
  pbPlumTransfer.setRecipient(req.recipient);
  return pbPlumTransfer;
}

function toActionDepositToRewardingFund(req) {
  if (!req) {
    return undefined;
  }

  const pbDepositToRewardingFund = new _action_pb.default.DepositToRewardingFund();
  pbDepositToRewardingFund.setAmount(req.amount);
  pbDepositToRewardingFund.setData(req.data);
  return pbDepositToRewardingFund;
}

function toActionClaimFromRewardingFund(req) {
  if (!req) {
    return undefined;
  }

  const pbClaimFromRewardingFund = new _action_pb.default.ClaimFromRewardingFund(); // @ts-ignore

  pbClaimFromRewardingFund.setAmount(req.amount); // @ts-ignore

  pbClaimFromRewardingFund.setData(req.data);
  return pbClaimFromRewardingFund;
}

function toActionGrantReward(req) {
  if (!req) {
    return undefined;
  }

  const pbGrantReward = new _action_pb.default.GrantReward();
  pbGrantReward.setType(req.type);
  return pbGrantReward;
}

function toActionStakeCreate(req) {
  if (!req) {
    return undefined;
  }

  const pbStakeCreate = new _action_pb.default.StakeCreate();
  pbStakeCreate.setCandidatename(req.candidateName);
  pbStakeCreate.setStakedamount(req.stakedAmount);
  pbStakeCreate.setStakedduration(req.stakedDuration);
  pbStakeCreate.setAutostake(req.autoStake);
  pbStakeCreate.setPayload(req.payload);
  return pbStakeCreate;
}

function toActionStakeReclaim(req) {
  if (!req) {
    return undefined;
  }

  const pbStakeReclaim = new _action_pb.default.StakeReclaim();
  pbStakeReclaim.setBucketindex(req.bucketIndex);
  pbStakeReclaim.setPayload(req.payload);
  return pbStakeReclaim;
}

function toActionStakeAddDeposit(req) {
  if (!req) {
    return undefined;
  }

  const pbStakeAddDeposit = new _action_pb.default.StakeAddDeposit();
  pbStakeAddDeposit.setBucketindex(req.bucketIndex);
  pbStakeAddDeposit.setAmount(req.amount);
  pbStakeAddDeposit.setPayload(req.payload);
  return pbStakeAddDeposit;
}

function toActionStakeRestake(req) {
  if (!req) {
    return undefined;
  }

  const pbStakeRestake = new _action_pb.default.StakeRestake();
  pbStakeRestake.setBucketindex(req.bucketIndex);
  pbStakeRestake.setStakedduration(req.stakedDuration);
  pbStakeRestake.setAutostake(req.autoStake);
  pbStakeRestake.setPayload(req.payload);
  return pbStakeRestake;
}

function toActionStakeChangeCandidate(req) {
  if (!req) {
    return undefined;
  }

  const pbStakeChangeCandidate = new _action_pb.default.StakeChangeCandidate();
  pbStakeChangeCandidate.setBucketindex(req.bucketIndex);
  pbStakeChangeCandidate.setCandidatename(req.candidateName);
  pbStakeChangeCandidate.setPayload(req.payload);
  return pbStakeChangeCandidate;
}

function toActionStakeTransferOwnership(req) {
  if (!req) {
    return undefined;
  }

  const pbStakeTransferOwnership = new _action_pb.default.StakeTransferOwnership();
  pbStakeTransferOwnership.setBucketindex(req.bucketIndex);
  pbStakeTransferOwnership.setVoteraddress(req.voterAddress);
  pbStakeTransferOwnership.setPayload(req.payload);
  return pbStakeTransferOwnership;
}

function toActionCandidateRegister(req) {
  if (!req) {
    return undefined;
  }

  const pbCandidateRegister = new _action_pb.default.CandidateRegister();
  const pbCandidateBasicInfo = new _action_pb.default.CandidateBasicInfo();
  pbCandidateBasicInfo.setName(req.candidate.name);
  pbCandidateBasicInfo.setOperatoraddress(req.candidate.operatorAddress);
  pbCandidateBasicInfo.setRewardaddress(req.candidate.rewardAddress);
  pbCandidateRegister.setCandidate(pbCandidateBasicInfo);
  pbCandidateRegister.setStakedamount(req.stakedAmount);
  pbCandidateRegister.setStakedduration(req.stakedDuration);
  pbCandidateRegister.setAutostake(req.autoStake);
  pbCandidateRegister.setOwneraddress(req.ownerAddress);
  pbCandidateRegister.setPayload(req.payload);
  return pbCandidateRegister;
}

function toActionCandidateBasicInfo(req) {
  if (!req) {
    return undefined;
  }

  const pbCandidateBasicInfo = new _action_pb.default.CandidateBasicInfo();
  pbCandidateBasicInfo.setName(req.name);
  pbCandidateBasicInfo.setOperatoraddress(req.operatorAddress);
  pbCandidateBasicInfo.setRewardaddress(req.rewardAddress);
  return pbCandidateBasicInfo;
}

function toAction(req) {
  const pbActionCore = new _action_pb.default.ActionCore();
  const core = req && req.core;

  if (core) {
    pbActionCore.setVersion(core.version);
    pbActionCore.setNonce(Number(core.nonce));
    pbActionCore.setGaslimit(Number(core.gasLimit));
    pbActionCore.setGasprice(core.gasPrice);
    pbActionCore.setTransfer(toActionTransfer(core.transfer));
    pbActionCore.setExecution(toActionExecution(core.execution));
    pbActionCore.setStartsubchain(toActionStartSubChain(core.startSubChain));
    pbActionCore.setStopsubchain(toActionStopSubChain(core.stopSubChain));
    pbActionCore.setPutblock(toActionPutBlock(core.putBlock));
    pbActionCore.setCreatedeposit(toActionCreateDeposit(core.createDeposit));
    pbActionCore.setSettledeposit(toActionSettleDeposit(core.settleDeposit));
    pbActionCore.setCreateplumchain(toActionCreatePlumChain(core.createPlumChain));
    pbActionCore.setTerminateplumchain(toActionTerminatePlumChain(core.terminatePlumChain));
    pbActionCore.setPlumputblock(toActionPlumPutBlock(core.plumPutBlock));
    pbActionCore.setPlumcreatedeposit(toActionPlumCreateDeposit(core.plumCreateDeposit));
    pbActionCore.setPlumstartexit(toActionPlumStartExit(core.plumStartExit));
    pbActionCore.setPlumchallengeexit(toActionPlumChallengeExit(core.plumChallengeExit));
    pbActionCore.setPlumresponsechallengeexit(toActionPlumResponseChallengeExit(core.plumResponseChallengeExit));
    pbActionCore.setPlumfinalizeexit(toActionPlumFinalizeExit(core.plumFinalizeExit));
    pbActionCore.setPlumsettledeposit(toActionPlumSettleDeposit(core.plumSettleDeposit));
    pbActionCore.setPlumtransfer(toActionPlumTransfer(core.plumTransfer));
    pbActionCore.setDeposittorewardingfund(toActionDepositToRewardingFund(core.depositToRewardingFund));
    pbActionCore.setClaimfromrewardingfund(toActionClaimFromRewardingFund(core.claimFromRewardingFund));
    pbActionCore.setGrantreward(toActionGrantReward(core.grantReward));
    pbActionCore.setStakecreate(toActionStakeCreate(core.stakeCreate));
    pbActionCore.setStakeunstake(toActionStakeReclaim(core.stakeUnstake));
    pbActionCore.setStakewithdraw(toActionStakeReclaim(core.stakeWithdraw));
    pbActionCore.setStakeadddeposit(toActionStakeAddDeposit(core.stakeAddDeposit));
    pbActionCore.setStakerestake(toActionStakeRestake(core.stakeRestake));
    pbActionCore.setStakechangecandidate(toActionStakeChangeCandidate(core.stakeChangeCandidate));
    pbActionCore.setStaketransferownership(toActionStakeTransferOwnership(core.stakeTransferOwnership));
    pbActionCore.setCandidateregister(toActionCandidateRegister(core.candidateRegister));
    pbActionCore.setCandidateupdate(toActionCandidateBasicInfo(core.candidateUpdate));
  }

  const pbAction = new _action_pb.default.Action();
  pbAction.setCore(pbActionCore);

  if (req.senderPubKey) {
    pbAction.setSenderpubkey(req.senderPubKey);
  }

  if (req.signature) {
    pbAction.setSignature(req.signature);
  }

  return pbAction;
}

const GetActionsRequest = {
  byAddrTo(byAddr) {
    const pbReqByAddr = new _api_pb.default.GetActionsByAddressRequest();

    if (byAddr.address) {
      pbReqByAddr.setAddress(byAddr.address);
    }

    if (byAddr.start) {
      pbReqByAddr.setStart(byAddr.start);
    }

    if (byAddr.count) {
      pbReqByAddr.setCount(byAddr.count);
    }

    return pbReqByAddr;
  },

  byBlkTo(byBlk) {
    const pbReqByBlk = new _api_pb.default.GetActionsByBlockRequest();

    if (byBlk.blkHash) {
      pbReqByBlk.setBlkhash(byBlk.blkHash);
    }

    if (byBlk.start) {
      pbReqByBlk.setStart(byBlk.start);
    }

    if (byBlk.count) {
      pbReqByBlk.setCount(byBlk.count);
    }

    return pbReqByBlk;
  },

  byHashTo(byHash) {
    const pbReqByHash = new _api_pb.default.GetActionByHashRequest();

    if (byHash.actionHash) {
      pbReqByHash.setActionhash(byHash.actionHash);
    }

    if (byHash.checkingPending) {
      pbReqByHash.setCheckpending(byHash.checkingPending);
    }

    return pbReqByHash;
  },

  byIndexTo(byIndex) {
    const pbReqByIndex = new _api_pb.default.GetActionsByIndexRequest();

    if (byIndex.start) {
      pbReqByIndex.setStart(byIndex.start);
    }

    if (byIndex.count) {
      pbReqByIndex.setCount(byIndex.count);
    }

    return pbReqByIndex;
  },

  unconfirmedByAddrTo(unconfirmedByAddr) {
    const pbReqUnconfirmedByAddr = new _api_pb.default.GetUnconfirmedActionsByAddressRequest();

    if (unconfirmedByAddr.start) {
      pbReqUnconfirmedByAddr.setStart(unconfirmedByAddr.start);
    }

    if (unconfirmedByAddr.count) {
      pbReqUnconfirmedByAddr.setCount(unconfirmedByAddr.count);
    }

    if (unconfirmedByAddr.address) {
      pbReqUnconfirmedByAddr.setAddress(unconfirmedByAddr.address);
    }

    return pbReqUnconfirmedByAddr;
  },

  to(req) {
    const pbReq = new _api_pb.default.GetActionsRequest();

    if (req.byAddr) {
      pbReq.setByaddr(GetActionsRequest.byAddrTo(req.byAddr));
    }

    if (req.byBlk) {
      pbReq.setByblk(GetActionsRequest.byBlkTo(req.byBlk));
    }

    if (req.byHash) {
      pbReq.setByhash(GetActionsRequest.byHashTo(req.byHash));
    }

    if (req.byIndex) {
      pbReq.setByindex(GetActionsRequest.byIndexTo(req.byIndex));
    }

    if (req.unconfirmedByAddr) {
      pbReq.setUnconfirmedbyaddr(GetActionsRequest.unconfirmedByAddrTo(req.unconfirmedByAddr));
    }

    return pbReq;
  },

  fromTransfer(pbRes) {
    let transferData = pbRes;

    if (pbRes) {
      transferData = {
        amount: pbRes.getAmount(),
        recipient: pbRes.getRecipient(),
        payload: pbRes.getPayload()
      };
    }

    return transferData;
  },

  fromVote(pbRes) {
    let voteData = pbRes;

    if (voteData) {
      voteData = {
        timestamp: pbRes.getTimestamp(),
        voteeAddress: pbRes.getVoteeaddress()
      };
    }

    return voteData;
  },

  fromExecution(pbRes) {
    if (!pbRes) {
      return;
    }

    return {
      amount: pbRes.getAmount(),
      contract: pbRes.getContract(),
      // @ts-ignore
      data: Buffer.from(pbRes.getData())
    };
  },

  fromStartSubChain(pbRes) {
    let startSubChainData = pbRes;

    if (startSubChainData) {
      startSubChainData = {
        chainID: pbRes.chainID,
        securityDeposit: pbRes.securityDeposit,
        operationDeposit: pbRes.operationDeposit,
        startHeight: pbRes.startHeight,
        parentHeightOffset: pbRes.parentHeightOffset
      };
    }

    return startSubChainData;
  },

  fromStopSubChain(pbRes) {
    let stopSubChainData = pbRes;

    if (stopSubChainData) {
      stopSubChainData = {
        chainID: pbRes.chainID,
        stopHeight: pbRes.stopHeight,
        subChainAddress: pbRes.subChainAddress
      };
    }

    return stopSubChainData;
  },

  fromPutBlock(pbRes) {
    let putBlockData = pbRes;

    if (putBlockData) {
      const rootsData = pbRes.roots;

      if (rootsData) {
        for (let i = 0; i < pbRes.roots.length; i++) {
          rootsData[i] = {
            name: pbRes.roots[i].name,
            value: pbRes.roots[i].value
          };
        }
      }

      putBlockData = {
        subChainAddress: pbRes.subChainAddress,
        height: pbRes.height,
        roots: rootsData
      };
    }

    return putBlockData;
  },

  fromCreateDeposit(pbRes) {
    let createDepositData = pbRes;

    if (createDepositData) {
      createDepositData = {
        chainID: pbRes.chainID,
        amount: pbRes.amount,
        recipient: pbRes.recipient
      };
    }

    return createDepositData;
  },

  fromSettleDeposit(pbRes) {
    let settleDepositData = pbRes;

    if (settleDepositData) {
      settleDepositData = {
        amount: pbRes.amount,
        recipient: pbRes.recipient,
        index: pbRes.index
      };
    }

    return settleDepositData;
  },

  fromCreatePlumChain(pbRes) {
    let createPlumChainData = pbRes;

    if (createPlumChainData) {
      createPlumChainData = {};
    }

    return createPlumChainData;
  },

  fromTerminatePlumChain(pbRes) {
    let terminatePlumChainData = pbRes;

    if (terminatePlumChainData) {
      terminatePlumChainData = {
        subChainAddress: pbRes.subChainAddress
      };
    }

    return terminatePlumChainData;
  },

  fromPlumPutBlock(pbRes) {
    let plumPutBlockData = pbRes;

    if (plumPutBlockData) {
      plumPutBlockData = {
        subChainAddress: pbRes.subChainAddress,
        height: pbRes.height,
        roots: pbRes.roots
      };
    }

    return plumPutBlockData;
  },

  fromPlumCreateDeposit(pbRes) {
    let plumCreateDepositData = pbRes;

    if (plumCreateDepositData) {
      plumCreateDepositData = {
        subChainAddress: pbRes.subChainAddress,
        amount: pbRes.amount,
        recipient: pbRes.recipient
      };
    }

    return plumCreateDepositData;
  },

  fromPlumStartExit(pbRes) {
    let plumStartExitData = pbRes;

    if (plumStartExitData) {
      plumStartExitData = {
        subChainAddress: pbRes.subChainAddress,
        previousTransfer: pbRes.previousTransfer,
        previousTransferBlockProof: pbRes.previousTransferBlockProof,
        previousTransferBlockHeight: pbRes.previousTransferBlockHeight,
        exitTransfer: pbRes.exitTransfer,
        exitTransferBlockProof: pbRes.exitTransferBlockProof,
        exitTransferBlockHeight: pbRes.exitTransferBlockHeight
      };
    }

    return plumStartExitData;
  },

  fromPlumChallengeExit(pbRes) {
    let plumChallengeExitData = pbRes;

    if (plumChallengeExitData) {
      plumChallengeExitData = {
        subChainAddress: pbRes.subChainAddress,
        coinID: pbRes.coinID,
        challengeTransfer: pbRes.challengeTransfer,
        challengeTransferBlockProof: pbRes.challengeTransferBlockProof,
        challengeTransferBlockHeight: pbRes.challengeTransferBlockHeight
      };
    }

    return plumChallengeExitData;
  },

  fromPlumResponseChallengeExit(pbRes) {
    let plumResponseChallengeExitData = pbRes;

    if (plumResponseChallengeExitData) {
      plumResponseChallengeExitData = {
        subChainAddress: pbRes.subChainAddress,
        coinID: pbRes.coinID,
        challengeTransfer: pbRes.challengeTransfer,
        responseTransfer: pbRes.responseTransfer,
        responseTransferBlockProof: pbRes.responseTransferBlockProof,
        previousTransferBlockHeight: pbRes.previousTransferBlockHeight
      };
    }

    return plumResponseChallengeExitData;
  },

  fromPlumFinalizeExit(pbRes) {
    let plumFinalizeExitData = pbRes;

    if (plumFinalizeExitData) {
      plumFinalizeExitData = {
        subChainAddress: pbRes.subChainAddress,
        coinID: pbRes.coinID
      };
    }

    return plumFinalizeExitData;
  },

  fromPlumSettleDeposit(pbRes) {
    let plumSettleDepositData = pbRes;

    if (plumSettleDepositData) {
      plumSettleDepositData = {
        coinID: pbRes.coinID
      };
    }

    return plumSettleDepositData;
  },

  fromPlumTransfer(pbRes) {
    let plumTransferData = pbRes;

    if (plumTransferData) {
      plumTransferData = {
        coinID: pbRes.coinID,
        denomination: pbRes.denomination,
        owner: pbRes.owner,
        recipient: pbRes.recipient
      };
    }

    return plumTransferData;
  },

  fromDepositToRewardingFund(pbRes) {
    let depositToRewardingFundData = pbRes;

    if (depositToRewardingFundData) {
      depositToRewardingFundData = {
        amount: pbRes.amount,
        data: pbRes.data
      };
    }

    return depositToRewardingFundData;
  },

  fromClaimFromRewardingFund(pbRes) {
    let claimFromRewardingFundData = pbRes;

    if (claimFromRewardingFundData) {
      claimFromRewardingFundData = {
        amount: pbRes.amount,
        data: pbRes.data
      };
    }

    return claimFromRewardingFundData;
  },

  fromSetReward(pbRes) {
    let setRewardData = pbRes;

    if (setRewardData) {
      setRewardData = {
        amount: pbRes.amount,
        data: pbRes.data,
        type: pbRes.type
      };
    }

    return setRewardData;
  },

  fromGrantReward(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      type: pbRes.getType(),
      height: pbRes.getHeight()
    };
  },

  fromStakeCreate(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      candidateName: pbRes.getCandidatename(),
      stakedAmount: pbRes.getStakedamount(),
      stakedDuration: pbRes.getStakedduration(),
      autoStake: pbRes.getAutostake(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromStakeReclaim(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      bucketIndex: pbRes.getBucketindex(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromStakeAddDeposit(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      bucketIndex: pbRes.getBucketindex(),
      amount: pbRes.getAmount(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromStakeRestake(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      bucketIndex: pbRes.getBucketindex(),
      stakedDuration: pbRes.getStakedduration(),
      autoStake: pbRes.getAutostake(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromStakeChangeCandidate(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      bucketIndex: pbRes.getBucketindex(),
      candidateName: pbRes.getCandidatename(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromStakeTransferOwnership(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      bucketIndex: pbRes.getBucketindex(),
      voterAddress: pbRes.getVoteraddress(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromCandidateRegister(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      candidate: {
        // @ts-ignore
        name: pbRes.getCandidate().getName(),
        // @ts-ignore
        operatorAddress: pbRes.getCandidate().getOperatoraddress(),
        // @ts-ignore
        rewardAddress: pbRes.getCandidate().getRewardaddress()
      },
      stakedAmount: pbRes.getStakedamount(),
      stakedDuration: pbRes.getStakedduration(),
      autoStake: pbRes.getAutostake(),
      ownerAddress: pbRes.getOwneraddress(),
      // @ts-ignore
      payload: Buffer.from(pbRes.getPayload())
    };
  },

  fromCandidateUpdate(pbRes) {
    if (!pbRes) {
      return undefined;
    }

    return {
      name: pbRes.getName(),
      operatorAddress: pbRes.getOperatoraddress(),
      rewardAddress: pbRes.getRewardaddress()
    };
  },

  getPutPollResult(req) {
    if (!req) {
      return undefined;
    }

    let candidateList;
    const rawCandidates = req.getCandidates();

    if (rawCandidates) {
      candidateList = {
        candidates: []
      };
      const rawCandidatesList = rawCandidates.getCandidatesList();

      if (rawCandidatesList) {
        for (const rawCandidate of rawCandidatesList) {
          candidateList.candidates.push({
            address: rawCandidate.getAddress(),
            votes: rawCandidate.getVotes(),
            pubKey: rawCandidate.getPubkey(),
            rewardAddress: rawCandidate.getRewardaddress()
          });
        }
      }
    }

    return {
      height: req.getHeight(),
      candidates: candidateList
    };
  },

  // tslint:disable-next-line:max-func-body-length
  from(pbRes) {
    const res = {
      actionInfo: []
    };
    const rawActionInfoList = pbRes.getActioninfoList();

    if (!rawActionInfoList) {
      return res;
    }

    for (const rawActionInfo of rawActionInfoList) {
      const actionInfo = {
        actHash: rawActionInfo.getActhash(),
        blkHash: rawActionInfo.getBlkhash(),
        timestamp: rawActionInfo.getTimestamp()
      };
      const rawAction = rawActionInfo.getAction();

      if (rawAction) {
        const rawActionCore = rawAction.getCore();
        let actionCore;

        if (rawActionCore) {
          actionCore = {
            version: rawActionCore.getVersion(),
            nonce: String(rawActionCore.getNonce()),
            gasLimit: String(rawActionCore.getGaslimit()),
            gasPrice: rawActionCore.getGasprice(),
            transfer: GetActionsRequest.fromTransfer(rawActionCore.getTransfer()),
            execution: GetActionsRequest.fromExecution(rawActionCore.getExecution()),
            startSubChain: GetActionsRequest.fromStartSubChain(rawActionCore.getStartsubchain()),
            stopSubChain: GetActionsRequest.fromStopSubChain(rawActionCore.getStopsubchain()),
            putBlock: GetActionsRequest.fromPutBlock(rawActionCore.getPutblock()),
            createDeposit: GetActionsRequest.fromCreateDeposit(rawActionCore.getCreatedeposit()),
            settleDeposit: GetActionsRequest.fromSettleDeposit(rawActionCore.getSettledeposit()),
            createPlumChain: GetActionsRequest.fromCreatePlumChain(rawActionCore.getCreateplumchain()),
            terminatePlumChain: GetActionsRequest.fromTerminatePlumChain(rawActionCore.getTerminateplumchain()),
            plumPutBlock: GetActionsRequest.fromPlumPutBlock(rawActionCore.getPlumputblock()),
            plumCreateDeposit: GetActionsRequest.fromPlumCreateDeposit(rawActionCore.getPlumcreatedeposit()),
            plumStartExit: GetActionsRequest.fromPlumStartExit(rawActionCore.getPlumstartexit()),
            plumChallengeExit: GetActionsRequest.fromPlumChallengeExit(rawActionCore.getPlumchallengeexit()),
            plumResponseChallengeExit: GetActionsRequest.fromPlumResponseChallengeExit(rawActionCore.getPlumresponsechallengeexit()),
            plumFinalizeExit: GetActionsRequest.fromPlumFinalizeExit(rawActionCore.getPlumfinalizeexit()),
            plumSettleDeposit: GetActionsRequest.fromPlumSettleDeposit(rawActionCore.getPlumsettledeposit()),
            plumTransfer: GetActionsRequest.fromPlumTransfer(rawActionCore.getPlumtransfer()),
            depositToRewardingFund: GetActionsRequest.fromDepositToRewardingFund(rawActionCore.getDeposittorewardingfund()),
            claimFromRewardingFund: GetActionsRequest.fromClaimFromRewardingFund(rawActionCore.getClaimfromrewardingfund()),
            grantReward: GetActionsRequest.fromGrantReward(rawActionCore.getGrantreward()),
            stakeCreate: GetActionsRequest.fromStakeCreate(rawActionCore.getStakecreate()),
            stakeUnstake: GetActionsRequest.fromStakeReclaim(rawActionCore.getStakeunstake()),
            stakeWithdraw: GetActionsRequest.fromStakeReclaim(rawActionCore.getStakewithdraw()),
            stakeAddDeposit: GetActionsRequest.fromStakeAddDeposit(rawActionCore.getStakeadddeposit()),
            stakeRestake: GetActionsRequest.fromStakeRestake(rawActionCore.getStakerestake()),
            stakeChangeCandidate: GetActionsRequest.fromStakeChangeCandidate(rawActionCore.getStakechangecandidate()),
            stakeTransferOwnership: GetActionsRequest.fromStakeTransferOwnership(rawActionCore.getStaketransferownership()),
            candidateRegister: GetActionsRequest.fromCandidateRegister(rawActionCore.getCandidateregister()),
            candidateUpdate: GetActionsRequest.fromCandidateUpdate(rawActionCore.getCandidateupdate()),
            putPollResult: GetActionsRequest.getPutPollResult(rawActionCore.getPutpollresult())
          };
        }

        actionInfo.action = {
          core: actionCore,
          senderPubKey: rawAction.getSenderpubkey(),
          signature: rawAction.getSignature()
        };
      }

      res.actionInfo.push(actionInfo);
    }

    return res;
  }

}; // Properties of a SuggestGasPrice Request.

exports.GetActionsRequest = GetActionsRequest;
const SuggestGasPriceRequest = {
  // @ts-ignore
  to(req) {
    return new _api_pb.default.SuggestGasPriceRequest();
  },

  from(pbRes) {
    const gasPrice = pbRes.getGasprice();
    return {
      gasPrice
    };
  }

}; // Properties of a GetReceiptByActionRequest.

exports.SuggestGasPriceRequest = SuggestGasPriceRequest;
let ReceiptStatus; // Properties of an Receipt.

exports.ReceiptStatus = ReceiptStatus;

(function (ReceiptStatus) {
  ReceiptStatus[ReceiptStatus["Failure"] = 0] = "Failure";
  ReceiptStatus[ReceiptStatus["Success"] = 1] = "Success";
  ReceiptStatus[ReceiptStatus["ErrUnknown"] = 100] = "ErrUnknown";
  ReceiptStatus[ReceiptStatus["ErrOutOfGas"] = 101] = "ErrOutOfGas";
  ReceiptStatus[ReceiptStatus["ErrCodeStoreOutOfGas"] = 102] = "ErrCodeStoreOutOfGas";
  ReceiptStatus[ReceiptStatus["ErrDepth"] = 103] = "ErrDepth";
  ReceiptStatus[ReceiptStatus["ErrContractAddressCollision"] = 104] = "ErrContractAddressCollision";
  ReceiptStatus[ReceiptStatus["ErrNoCompatibleInterpreter"] = 105] = "ErrNoCompatibleInterpreter";
  ReceiptStatus[ReceiptStatus["ErrExecutionReverted"] = 106] = "ErrExecutionReverted";
  ReceiptStatus[ReceiptStatus["ErrMaxCodeSizeExceeded"] = 107] = "ErrMaxCodeSizeExceeded";
  ReceiptStatus[ReceiptStatus["ErrWriteProtection"] = 108] = "ErrWriteProtection";
  ReceiptStatus[ReceiptStatus["ErrLoadAccount"] = 200] = "ErrLoadAccount";
  ReceiptStatus[ReceiptStatus["ErrNotEnoughBalance"] = 201] = "ErrNotEnoughBalance";
  ReceiptStatus[ReceiptStatus["ErrInvalidBucketIndex"] = 202] = "ErrInvalidBucketIndex";
  ReceiptStatus[ReceiptStatus["ErrUnauthorizedOperator"] = 203] = "ErrUnauthorizedOperator";
  ReceiptStatus[ReceiptStatus["ErrInvalidBucketType"] = 204] = "ErrInvalidBucketType";
  ReceiptStatus[ReceiptStatus["ErrCandidateNotExist"] = 205] = "ErrCandidateNotExist";
  ReceiptStatus[ReceiptStatus["ErrReduceDurationBeforeMaturity"] = 206] = "ErrReduceDurationBeforeMaturity";
  ReceiptStatus[ReceiptStatus["ErrUnstakeBeforeMaturity"] = 207] = "ErrUnstakeBeforeMaturity";
  ReceiptStatus[ReceiptStatus["ErrWithdrawBeforeUnstake"] = 208] = "ErrWithdrawBeforeUnstake";
  ReceiptStatus[ReceiptStatus["ErrWithdrawBeforeMaturity"] = 209] = "ErrWithdrawBeforeMaturity";
  ReceiptStatus[ReceiptStatus["ErrCandidateAlreadyExist"] = 210] = "ErrCandidateAlreadyExist";
  ReceiptStatus[ReceiptStatus["ErrCandidateConflict"] = 211] = "ErrCandidateConflict";
})(ReceiptStatus || (exports.ReceiptStatus = ReceiptStatus = {}));

function fromPbReceiptInfo(pbReceiptInfo) {
  if (!pbReceiptInfo) {
    return undefined;
  }

  return {
    receipt: fromPbReceipt(pbReceiptInfo.getReceipt()),
    blkHash: pbReceiptInfo.getBlkhash()
  };
}

const GetReceiptByActionRequest = {
  to(req) {
    const pbReq = new _api_pb.default.GetReceiptByActionRequest();

    if (req.actionHash) {
      pbReq.setActionhash(req.actionHash);
    }

    return pbReq;
  },

  from(pbRes) {
    return {
      receiptInfo: fromPbReceiptInfo(pbRes.getReceiptinfo())
    };
  }

};
exports.GetReceiptByActionRequest = GetReceiptByActionRequest;

function fromPbReceipt(pbReceipt) {
  if (!pbReceipt) {
    return undefined;
  }

  return {
    status: pbReceipt.getStatus(),
    blkHeight: pbReceipt.getBlkheight(),
    actHash: pbReceipt.getActhash(),
    gasConsumed: pbReceipt.getGasconsumed(),
    contractAddress: pbReceipt.getContractaddress(),
    logs: fromPbLogList(pbReceipt.getLogsList())
  };
}

function fromPbLogList(pbLogList) {
  if (!pbLogList) {
    return undefined;
  }

  const res = [];

  for (const log of pbLogList) {
    res.push({
      contractAddress: log.getContractaddress(),
      topics: log.getTopicsList(),
      data: log.getData(),
      blkHeight: log.getBlkheight(),
      actHash: log.getActhash(),
      index: log.getIndex()
    });
  }

  return res;
} // Properties of a ReadContractRequest.


const ReadContractRequest = {
  to(req) {
    const pbReq = new _api_pb.default.ReadContractRequest();
    pbReq.setCalleraddress(req.callerAddress);

    if (req.execution) {
      pbReq.setExecution(toActionExecution(req.execution));
    }

    return pbReq;
  },

  from(pbRes) {
    return {
      data: pbRes.getData(),
      receipt: fromPbReceipt(pbRes.getReceipt())
    };
  }

}; // Properties of a SendActionRequest.

exports.ReadContractRequest = ReadContractRequest;
const SendActionRequest = {
  to(req) {
    const pbReq = new _api_pb.default.SendActionRequest();

    if (req.action) {
      pbReq.setAction(toAction(req.action));
    }

    return pbReq;
  }

};
exports.SendActionRequest = SendActionRequest;
const SendActionResponse = {
  from(resp) {
    return {
      actionHash: resp.getActionhash()
    };
  }

}; // Properties of a EstimateGasForActionRequest.

exports.SendActionResponse = SendActionResponse;
const EstimateGasForActionRequest = {
  to(req) {
    const pbReq = new _api_pb.default.EstimateGasForActionRequest();

    if (req.action) {
      pbReq.setAction(toAction(req.action));
    }

    return pbReq;
  },

  from(pbRes) {
    return {
      gas: pbRes.getGas()
    };
  }

};
exports.EstimateGasForActionRequest = EstimateGasForActionRequest;
const ReadStateRequest = {
  to(req) {
    const pbReq = new _api_pb.default.ReadStateRequest();
    pbReq.setProtocolid(req.protocolID);
    pbReq.setMethodname(req.methodName);
    pbReq.setArgumentsList(req.arguments);
    return pbReq;
  },

  from(pbRes) {
    return {
      data: pbRes.getData()
    };
  }

}; // Properties of a BlockProducerInfo.

exports.ReadStateRequest = ReadStateRequest;
const GetEpochMetaRequest = {
  to(req) {
    const pbReq = new _api_pb.default.GetEpochMetaRequest();

    if (req.epochNumber) {
      pbReq.setEpochnumber(req.epochNumber);
    }

    return pbReq;
  },

  from(pbRes) {
    const epoch = pbRes.getEpochdata();
    const bpInfo = pbRes.getBlockproducersinfoList();
    const res = {
      epochData: {
        num: epoch.getNum(),
        height: epoch.getHeight(),
        gravityChainStartHeight: epoch.getGravitychainstartheight()
      },
      totalBlocks: pbRes.getTotalblocks(),
      blockProducersInfo: bpInfo
    };

    if (bpInfo) {
      const parsedBpinfo = [];

      for (let i = 0; i < bpInfo.length; i++) {
        parsedBpinfo[i] = {
          address: bpInfo[i].getAddress(),
          votes: bpInfo[i].getVotes(),
          active: bpInfo[i].getActive(),
          production: bpInfo[i].getProduction()
        };
      }

      res.blockProducersInfo = parsedBpinfo;
    }

    return res;
  }

};
exports.GetEpochMetaRequest = GetEpochMetaRequest;
const GetLogsRequest = {
  to(req) {
    const pbReq = new _api_pb.default.GetLogsRequest();

    if (req.filter) {
      const filter = new _api_pb.default.LogsFilter();
      filter.setAddressList(req.filter.address);
      const topics = [];

      for (let i = 0; i < req.filter.topics.length; i++) {
        const topic = new _api_pb.default.Topics();
        topic.setTopicList(req.filter.topics[i].topic);
        topics.push(topic);
      }

      filter.setTopicsList(topics);
      pbReq.setFilter(filter);
    }

    if (req.byBlock) {
      const byBlock = new _api_pb.default.GetLogsByBlock();
      byBlock.setBlockhash(req.byBlock.blockHash);
      pbReq.setByblock(byBlock);
    }

    if (req.byRange) {
      const byRange = new _api_pb.default.GetLogsByRange();
      byRange.setFromblock(req.byRange.fromBlock);
      byRange.setToblock(req.byRange.toBlock);
      byRange.setPaginationsize(req.byRange.paginationSize);
      pbReq.setByrange(byRange);
    }

    return pbReq;
  },

  from(pbRes) {
    return {
      logs: fromPbLogList(pbRes.getLogsList())
    };
  }

};
exports.GetLogsRequest = GetLogsRequest;
const EstimateActionGasConsumptionRequest = {
  to(req) {
    const pbReq = new _api_pb.default.EstimateActionGasConsumptionRequest();

    if (req.transfer) {
      pbReq.setTransfer(toActionTransfer(req.transfer));
    }

    if (req.execution) {
      pbReq.setExecution(toActionExecution(req.execution));
    }

    pbReq.setCalleraddress(req.callerAddress);
    return pbReq;
  },

  from(pbRes) {
    return {
      gas: pbRes.getGas()
    };
  }

};
exports.EstimateActionGasConsumptionRequest = EstimateActionGasConsumptionRequest;

function fromPbTimestamp(timestamp) {
  if (timestamp) {
    return {
      seconds: timestamp.getSeconds(),
      nanos: timestamp.getNanos()
    };
  }

  return undefined;
}

function fromPbBlockHeaderCore(blockHeaderCore) {
  if (blockHeaderCore) {
    return {
      version: blockHeaderCore.getVersion(),
      height: blockHeaderCore.getHeight(),
      timestamp: fromPbTimestamp(blockHeaderCore.getTimestamp()),
      prevBlockHash: Buffer.from(blockHeaderCore.getPrevblockhash_asU8()),
      txRoot: Buffer.from(blockHeaderCore.getTxroot_asU8()),
      deltaStateDigest: Buffer.from(blockHeaderCore.getDeltastatedigest_asU8()),
      receiptRoot: Buffer.from(blockHeaderCore.getReceiptroot_asU8()),
      logsBloom: Buffer.from(blockHeaderCore.getLogsbloom_asU8())
    };
  }

  return undefined;
}

function fromPbBlockHeader(blockHeader) {
  if (blockHeader) {
    return {
      core: fromPbBlockHeaderCore(blockHeader.getCore()),
      producerPubkey: Buffer.from(blockHeader.getProducerpubkey_asU8()),
      signature: Buffer.from(blockHeader.getSignature_asU8())
    };
  }

  return undefined;
}

function fromPbBlockBody(blockBody) {
  if (blockBody) {
    const res = [];

    for (const rawAction of blockBody.getActionsList()) {
      const rawActionCore = rawAction.getCore();
      let actionCore;

      if (rawActionCore) {
        actionCore = {
          version: rawActionCore.getVersion(),
          nonce: String(rawActionCore.getNonce()),
          gasLimit: String(rawActionCore.getGaslimit()),
          gasPrice: rawActionCore.getGasprice(),
          transfer: GetActionsRequest.fromTransfer(rawActionCore.getTransfer()),
          execution: GetActionsRequest.fromExecution(rawActionCore.getExecution()),
          startSubChain: GetActionsRequest.fromStartSubChain(rawActionCore.getStartsubchain()),
          stopSubChain: GetActionsRequest.fromStopSubChain(rawActionCore.getStopsubchain()),
          putBlock: GetActionsRequest.fromPutBlock(rawActionCore.getPutblock()),
          createDeposit: GetActionsRequest.fromCreateDeposit(rawActionCore.getCreatedeposit()),
          settleDeposit: GetActionsRequest.fromSettleDeposit(rawActionCore.getSettledeposit()),
          createPlumChain: GetActionsRequest.fromCreatePlumChain(rawActionCore.getCreateplumchain()),
          terminatePlumChain: GetActionsRequest.fromTerminatePlumChain(rawActionCore.getTerminateplumchain()),
          plumPutBlock: GetActionsRequest.fromPlumPutBlock(rawActionCore.getPlumputblock()),
          plumCreateDeposit: GetActionsRequest.fromPlumCreateDeposit(rawActionCore.getPlumcreatedeposit()),
          plumStartExit: GetActionsRequest.fromPlumStartExit(rawActionCore.getPlumstartexit()),
          plumChallengeExit: GetActionsRequest.fromPlumChallengeExit(rawActionCore.getPlumchallengeexit()),
          plumResponseChallengeExit: GetActionsRequest.fromPlumResponseChallengeExit(rawActionCore.getPlumresponsechallengeexit()),
          plumFinalizeExit: GetActionsRequest.fromPlumFinalizeExit(rawActionCore.getPlumfinalizeexit()),
          plumSettleDeposit: GetActionsRequest.fromPlumSettleDeposit(rawActionCore.getPlumsettledeposit()),
          plumTransfer: GetActionsRequest.fromPlumTransfer(rawActionCore.getPlumtransfer()),
          depositToRewardingFund: GetActionsRequest.fromDepositToRewardingFund(rawActionCore.getDeposittorewardingfund()),
          claimFromRewardingFund: GetActionsRequest.fromClaimFromRewardingFund(rawActionCore.getClaimfromrewardingfund()),
          grantReward: GetActionsRequest.fromGrantReward(rawActionCore.getGrantreward()),
          putPollResult: GetActionsRequest.getPutPollResult(rawActionCore.getPutpollresult())
        };
      }

      const action = {
        core: actionCore,
        senderPubKey: rawAction.getSenderpubkey(),
        signature: rawAction.getSignature()
      };
      res.push(action);
    }

    return {
      actions: res
    };
  }

  return undefined;
}

function fromPbEndorsements(endorsements) {
  const res = [];

  for (const endorsement of endorsements) {
    res.push({
      timestamp: fromPbTimestamp(endorsement.getTimestamp()),
      endorser: Buffer.from(endorsement.getEndorser_asU8()),
      signature: Buffer.from(endorsement.getSignature_asU8())
    });
  }

  return res;
}

function fromPbBlockFooter(blockFooter) {
  if (blockFooter) {
    return {
      endorsements: fromPbEndorsements(blockFooter.getEndorsementsList()),
      timestamp: fromPbTimestamp(blockFooter.getTimestamp())
    };
  }

  return undefined;
}

function fromPbBlock(block) {
  if (block) {
    return {
      header: fromPbBlockHeader(block.getHeader()),
      body: fromPbBlockBody(block.getBody()),
      footer: fromPbBlockFooter(block.getFooter())
    };
  }

  return undefined;
}

function fromPbReceipts(receipts) {
  const res = [];

  for (const receipt of receipts) {
    res.push({
      status: receipt.getStatus(),
      blkHeight: receipt.getBlkheight(),
      actHash: receipt.getActhash(),
      gasConsumed: receipt.getGasconsumed(),
      contractAddress: receipt.getContractaddress(),
      logs: fromPbLogList(receipt.getLogsList())
    });
  }

  return res;
}

function fromPbBlockInfo(blockInfo) {
  if (blockInfo) {
    return {
      block: fromPbBlock(blockInfo.getBlock()),
      receipts: fromPbReceipts(blockInfo.getReceiptsList())
    };
  }

  return undefined;
}

const StreamBlocksRequest = {
  // @ts-ignore
  to(req) {
    return new _api_pb.default.StreamBlocksRequest();
  },

  from(pbRes) {
    return {
      block: fromPbBlockInfo(pbRes.getBlock())
    };
  }

};
exports.StreamBlocksRequest = StreamBlocksRequest;
const StreamLogsRequest = {
  // @ts-ignore
  to(req) {
    const pbReq = new _api_pb.default.StreamLogsRequest();

    if (req.filter) {
      const filter = new _api_pb.default.LogsFilter();
      filter.setAddressList(req.filter.address);
      const topics = [];

      for (let i = 0; i < req.filter.topics.length; i++) {
        const topic = new _api_pb.default.Topics();
        topic.setTopicList(req.filter.topics[i].topic);
        topics.push(topic);
      }

      filter.setTopicsList(topics);
      pbReq.setFilter(filter);
    }

    return pbReq;
  },

  fromPbLog(log) {
    if (log) {
      return {
        contractAddress: log.getContractaddress(),
        topics: log.getTopicsList(),
        data: log.getData(),
        blkHeight: log.getBlkheight(),
        actHash: log.getActhash(),
        index: log.getIndex()
      };
    }

    return undefined;
  },

  from(pbRes) {
    return {
      log: StreamLogsRequest.fromPbLog(pbRes.getLog())
    };
  }

}; // @ts-ignore

exports.StreamLogsRequest = StreamLogsRequest;

// @ts-ignore
class ClientReadableStream extends _events.EventEmitter {
  constructor(origin, type) {
    super();

    _defineProperty(this, "origin", void 0);

    this.origin = origin;
    origin.on("error", err => {
      this.emit("error", err);
    });
    origin.on("status", status => {
      this.emit("status", status);
    });
    origin.on("data", response => {
      if (type === "StreamBlocks") {
        // @ts-ignore
        this.emit("data", StreamBlocksRequest.from(response));
      }

      if (type === "StreamLogs") {
        // @ts-ignore
        this.emit("data", StreamLogsRequest.from(response));
      }
    });
    origin.on("end", () => {
      this.emit("end");
    });
  }

  cancel() {
    this.origin.cancel();
  }

}

exports.ClientReadableStream = ClientReadableStream;

const IReadStakingDataMethodToBuffer = req => {
  const pbObj = new _read_state_pb.ReadStakingDataMethod();

  switch (req.method.valueOf()) {
    case _read_state_pb.ReadStakingDataMethod.Name.INVALID.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.INVALID);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.BUCKETS.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.BUCKETS);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.BUCKETS_BY_VOTER.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.BUCKETS_BY_VOTER);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.BUCKETS_BY_CANDIDATE.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.BUCKETS_BY_CANDIDATE);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.CANDIDATES.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.CANDIDATES);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.CANDIDATE_BY_NAME.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.CANDIDATE_BY_NAME);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.BUCKETS_BY_INDEXES.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.BUCKETS_BY_INDEXES);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.CANDIDATE_BY_ADDRESS.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.CANDIDATE_BY_ADDRESS);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.TOTAL_STAKING_AMOUNT.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.TOTAL_STAKING_AMOUNT);
      break;

    case _read_state_pb.ReadStakingDataMethod.Name.BUCKETS_COUNT.valueOf():
      pbObj.setMethod(_read_state_pb.ReadStakingDataMethod.Name.BUCKETS_COUNT);
      break;

    default:
      throw new Error(`unknow method ${req.method}`);
  }

  return Buffer.from(pbObj.serializeBinary());
};

exports.IReadStakingDataMethodToBuffer = IReadStakingDataMethodToBuffer;

const IReadStakingDataRequestToBuffer = req => {
  const pbObj = new _read_state_pb.ReadStakingDataRequest();

  if (req.buckets) {
    const buckets = new _read_state_pb.ReadStakingDataRequest.VoteBuckets();
    const pagination = new _read_state_pb.PaginationParam();
    pagination.setOffset(req.buckets.pagination.offset);
    pagination.setLimit(req.buckets.pagination.limit);
    buckets.setPagination(pagination);
    pbObj.setBuckets(buckets);
  }

  if (req.bucketsByVoter) {
    const bucketsByVoter = new _read_state_pb.ReadStakingDataRequest.VoteBucketsByVoter();
    const pagination = new _read_state_pb.PaginationParam();
    pagination.setOffset(req.bucketsByVoter.pagination.offset);
    pagination.setLimit(req.bucketsByVoter.pagination.limit);
    bucketsByVoter.setPagination(pagination);
    bucketsByVoter.setVoteraddress(req.bucketsByVoter.voterAddress);
    pbObj.setBucketsbyvoter(bucketsByVoter);
  }

  if (req.bucketsByCandidate) {
    const bucketsByCandidate = new _read_state_pb.ReadStakingDataRequest.VoteBucketsByCandidate();
    const pagination = new _read_state_pb.PaginationParam();
    pagination.setOffset(req.bucketsByCandidate.pagination.offset);
    pagination.setLimit(req.bucketsByCandidate.pagination.limit);
    bucketsByCandidate.setPagination(pagination);
    bucketsByCandidate.setCandname(req.bucketsByCandidate.candName);
    pbObj.setBucketsbycandidate(bucketsByCandidate);
  }

  if (req.candidates) {
    const candidates = new _read_state_pb.ReadStakingDataRequest.Candidates();
    const pagination = new _read_state_pb.PaginationParam();
    pagination.setOffset(req.candidates.pagination.offset);
    pagination.setLimit(req.candidates.pagination.limit);
    candidates.setPagination(pagination);
    pbObj.setCandidates(candidates);
  }

  if (req.candidateByName) {
    const candidateByName = new _read_state_pb.ReadStakingDataRequest.CandidateByName();
    candidateByName.setCandname(req.candidateByName.candName);
    pbObj.setCandidatebyname(candidateByName);
  }

  if (req.bucketsByIndexes) {
    const bucketsByIndexes = new _read_state_pb.ReadStakingDataRequest.VoteBucketsByIndexes();
    bucketsByIndexes.setIndexList(req.bucketsByIndexes.index);
    pbObj.setBucketsbyindexes(bucketsByIndexes);
  }

  if (req.candidateByAddress) {
    const candidateByAddress = new _read_state_pb.ReadStakingDataRequest.CandidateByAddress();
    candidateByAddress.setOwneraddr(req.candidateByAddress.ownerAddr);
    pbObj.setCandidatebyaddress(candidateByAddress);
  }

  if (req.totalStakingAmount) {
    const totalStakingAmount = new _read_state_pb.ReadStakingDataRequest.TotalStakingAmount();
    pbObj.setTotalstakingamount(totalStakingAmount);
  }

  if (req.bucketsCount) {
    const bucketsCount = new _read_state_pb.ReadStakingDataRequest.BucketsCount();
    pbObj.setBucketscount(bucketsCount);
  }

  return Buffer.from(pbObj.serializeBinary());
};

exports.IReadStakingDataRequestToBuffer = IReadStakingDataRequestToBuffer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ycGMtbWV0aG9kL3R5cGVzLnRzIl0sIm5hbWVzIjpbIkdldEFjY291bnRSZXF1ZXN0IiwidG8iLCJyZXEiLCJwYlJlcSIsImFwaVBiIiwic2V0QWRkcmVzcyIsImFkZHJlc3MiLCJmcm9tIiwicGJSZXMiLCJtZXRhIiwiZ2V0QWNjb3VudG1ldGEiLCJhY2NvdW50TWV0YSIsInVuZGVmaW5lZCIsImdldEFkZHJlc3MiLCJiYWxhbmNlIiwiZ2V0QmFsYW5jZSIsIm5vbmNlIiwiZ2V0Tm9uY2UiLCJwZW5kaW5nTm9uY2UiLCJnZXRQZW5kaW5nbm9uY2UiLCJudW1BY3Rpb25zIiwiZ2V0TnVtYWN0aW9ucyIsIkdldENoYWluTWV0YVJlcXVlc3QiLCJnZXRDaGFpbm1ldGEiLCJyZXMiLCJjaGFpbk1ldGEiLCJlcG9jaERhdGEiLCJnZXRFcG9jaCIsImhlaWdodCIsImdldEhlaWdodCIsInRwcyIsImdldFRwcyIsImVwb2NoIiwibnVtIiwiZ2V0TnVtIiwiZ3Jhdml0eUNoYWluU3RhcnRIZWlnaHQiLCJnZXRHcmF2aXR5Y2hhaW5zdGFydGhlaWdodCIsIkdldFNlcnZlck1ldGFSZXF1ZXN0IiwiZ2V0U2VydmVybWV0YSIsInNlcnZlck1ldGEiLCJwYWNrYWdlVmVyc2lvbiIsImdldFBhY2thZ2V2ZXJzaW9uIiwicGFja2FnZUNvbW1pdElEIiwiZ2V0UGFja2FnZWNvbW1pdGlkIiwiZ2l0U3RhdHVzIiwiZ2V0R2l0c3RhdHVzIiwiZ29WZXJzaW9uIiwiZ2V0R292ZXJzaW9uIiwiYnVpbGRUaW1lIiwiZ2V0QnVpbGR0aW1lIiwiR2V0QmxvY2tNZXRhc1JlcXVlc3QiLCJieUluZGV4IiwicGJSZXFCeUluZGV4IiwiR2V0QmxvY2tNZXRhc0J5SW5kZXhSZXF1ZXN0Iiwic3RhcnQiLCJzZXRTdGFydCIsImNvdW50Iiwic2V0Q291bnQiLCJzZXRCeWluZGV4IiwiYnlIYXNoIiwicGJSZXFCeUhhc2giLCJHZXRCbG9ja01ldGFCeUhhc2hSZXF1ZXN0Iiwic2V0QmxraGFzaCIsImJsa0hhc2giLCJzZXRCeWhhc2giLCJtZXRhcyIsImdldEJsa21ldGFzTGlzdCIsImJsa01ldGFzIiwidG90YWwiLCJnZXRUb3RhbCIsInBhcnNlZE1ldGFzIiwiaSIsImxlbmd0aCIsImhhc2giLCJnZXRIYXNoIiwidGltZXN0YW1wIiwiZ2V0VGltZXN0YW1wIiwicHJvZHVjZXJBZGRyZXNzIiwiZ2V0UHJvZHVjZXJhZGRyZXNzIiwidHJhbnNmZXJBbW91bnQiLCJnZXRUcmFuc2ZlcmFtb3VudCIsInR4Um9vdCIsImdldFR4cm9vdCIsInJlY2VpcHRSb290IiwiZ2V0UmVjZWlwdHJvb3QiLCJkZWx0YVN0YXRlRGlnZXN0IiwiZ2V0RGVsdGFzdGF0ZWRpZ2VzdCIsIklSZWFkU3Rha2luZ0RhdGFNZXRob2ROYW1lIiwidG9BY3Rpb25UcmFuc2ZlciIsInBiVHJhbnNmZXIiLCJhY3Rpb25QYiIsIlRyYW5zZmVyIiwic2V0QW1vdW50IiwiYW1vdW50Iiwic2V0UmVjaXBpZW50IiwicmVjaXBpZW50Iiwic2V0UGF5bG9hZCIsInBheWxvYWQiLCJ0b1RpbWVzdGFtcCIsInRzIiwiVGltZXN0YW1wIiwic2V0U2Vjb25kcyIsInNlY29uZHMiLCJzZXROYW5vcyIsIm5hbm9zIiwidG9BY3Rpb25FeGVjdXRpb24iLCJwYkV4ZWN1dGlvbiIsIkV4ZWN1dGlvbiIsInNldENvbnRyYWN0IiwiY29udHJhY3QiLCJzZXREYXRhIiwiZGF0YSIsInRvQWN0aW9uU3RhcnRTdWJDaGFpbiIsInBiU3RhcnRTdWJDaGFpbiIsIlN0YXJ0U3ViQ2hhaW4iLCJzZXRDaGFpbmlkIiwiY2hhaW5JRCIsInNldFNlY3VyaXR5ZGVwb3NpdCIsInNlY3VyaXR5RGVwb3NpdCIsInNldE9wZXJhdGlvbmRlcG9zaXQiLCJvcGVyYXRpb25EZXBvc2l0Iiwic2V0U3RhcnRoZWlnaHQiLCJzdGFydEhlaWdodCIsInNldFBhcmVudGhlaWdodG9mZnNldCIsInBhcmVudEhlaWdodE9mZnNldCIsInRvQWN0aW9uU3RvcFN1YkNoYWluIiwicGJTdG9wU3ViQ2hhaW4iLCJTdG9wU3ViQ2hhaW4iLCJzZXRTdG9waGVpZ2h0Iiwic3RvcEhlaWdodCIsInNldFN1YmNoYWluYWRkcmVzcyIsInN1YkNoYWluQWRkcmVzcyIsInRvQWN0aW9uUHV0QmxvY2siLCJyb290cyIsInJvb3RMaXN0Iiwicm9vdEl0ZW0iLCJta3Jvb3QiLCJNZXJrbGVSb290Iiwic2V0TmFtZSIsIm5hbWUiLCJzZXRWYWx1ZSIsInZhbHVlIiwicGJQdXRCbG9jayIsIlB1dEJsb2NrIiwic2V0SGVpZ2h0Iiwic2V0Um9vdHNMaXN0IiwidG9BY3Rpb25DcmVhdGVEZXBvc2l0IiwicGJDcmVhdGVEZXBvc2l0IiwiQ3JlYXRlRGVwb3NpdCIsInRvQWN0aW9uU2V0dGxlRGVwb3NpdCIsInBiU2V0dGxlRGVwb3NpdCIsIlNldHRsZURlcG9zaXQiLCJzZXRJbmRleCIsImluZGV4IiwidG9BY3Rpb25DcmVhdGVQbHVtQ2hhaW4iLCJDcmVhdGVQbHVtQ2hhaW4iLCJ0b0FjdGlvblRlcm1pbmF0ZVBsdW1DaGFpbiIsInBiVGVybWluYXRlUGx1bUNoYWluIiwiVGVybWluYXRlUGx1bUNoYWluIiwidG9BY3Rpb25QbHVtUHV0QmxvY2siLCJwYlBsdW1QdXRCbG9jayIsIlBsdW1QdXRCbG9jayIsInRvQWN0aW9uUGx1bUNyZWF0ZURlcG9zaXQiLCJwYlBsdW1DcmVhdGVEZXBvc2l0IiwiUGx1bUNyZWF0ZURlcG9zaXQiLCJ0b0FjdGlvblBsdW1TdGFydEV4aXQiLCJwYlBsdW1TdGFydEV4aXQiLCJQbHVtU3RhcnRFeGl0Iiwic2V0UHJldmlvdXN0cmFuc2ZlciIsInByZXZpb3VzVHJhbnNmZXIiLCJzZXRQcmV2aW91c3RyYW5zZmVyYmxvY2twcm9vZiIsInByZXZpb3VzVHJhbnNmZXJCbG9ja1Byb29mIiwic2V0UHJldmlvdXN0cmFuc2ZlcmJsb2NraGVpZ2h0IiwicHJldmlvdXNUcmFuc2ZlckJsb2NrSGVpZ2h0Iiwic2V0RXhpdHRyYW5zZmVyIiwiZXhpdFRyYW5zZmVyIiwic2V0RXhpdHRyYW5zZmVyYmxvY2twcm9vZiIsImV4aXRUcmFuc2ZlckJsb2NrUHJvb2YiLCJzZXRFeGl0dHJhbnNmZXJibG9ja2hlaWdodCIsImV4aXRUcmFuc2ZlckJsb2NrSGVpZ2h0IiwidG9BY3Rpb25QbHVtQ2hhbGxlbmdlRXhpdCIsInBiUGx1bUNoYWxsZW5nZUV4aXQiLCJQbHVtQ2hhbGxlbmdlRXhpdCIsInNldENvaW5pZCIsImNvaW5JRCIsInNldENoYWxsZW5nZXRyYW5zZmVyIiwiY2hhbGxlbmdlVHJhbnNmZXIiLCJzZXRDaGFsbGVuZ2V0cmFuc2ZlcmJsb2NrcHJvb2YiLCJjaGFsbGVuZ2VUcmFuc2ZlckJsb2NrUHJvb2YiLCJzZXRDaGFsbGVuZ2V0cmFuc2ZlcmJsb2NraGVpZ2h0IiwiY2hhbGxlbmdlVHJhbnNmZXJCbG9ja0hlaWdodCIsInRvQWN0aW9uUGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdCIsInBiUGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdCIsIlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQiLCJzZXRSZXNwb25zZXRyYW5zZmVyIiwicmVzcG9uc2VUcmFuc2ZlciIsInNldFJlc3BvbnNldHJhbnNmZXJibG9ja3Byb29mIiwicmVzcG9uc2VUcmFuc2ZlckJsb2NrUHJvb2YiLCJ0b0FjdGlvblBsdW1GaW5hbGl6ZUV4aXQiLCJwYlBsdW1GaW5hbGl6ZUV4aXQiLCJQbHVtRmluYWxpemVFeGl0IiwidG9BY3Rpb25QbHVtU2V0dGxlRGVwb3NpdCIsInBiUGx1bVNldHRsZURlcG9zaXQiLCJQbHVtU2V0dGxlRGVwb3NpdCIsInRvQWN0aW9uUGx1bVRyYW5zZmVyIiwicGJQbHVtVHJhbnNmZXIiLCJQbHVtVHJhbnNmZXIiLCJzZXREZW5vbWluYXRpb24iLCJkZW5vbWluYXRpb24iLCJzZXRPd25lciIsIm93bmVyIiwidG9BY3Rpb25EZXBvc2l0VG9SZXdhcmRpbmdGdW5kIiwicGJEZXBvc2l0VG9SZXdhcmRpbmdGdW5kIiwiRGVwb3NpdFRvUmV3YXJkaW5nRnVuZCIsInRvQWN0aW9uQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZCIsInBiQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZCIsIkNsYWltRnJvbVJld2FyZGluZ0Z1bmQiLCJ0b0FjdGlvbkdyYW50UmV3YXJkIiwicGJHcmFudFJld2FyZCIsIkdyYW50UmV3YXJkIiwic2V0VHlwZSIsInR5cGUiLCJ0b0FjdGlvblN0YWtlQ3JlYXRlIiwicGJTdGFrZUNyZWF0ZSIsIlN0YWtlQ3JlYXRlIiwic2V0Q2FuZGlkYXRlbmFtZSIsImNhbmRpZGF0ZU5hbWUiLCJzZXRTdGFrZWRhbW91bnQiLCJzdGFrZWRBbW91bnQiLCJzZXRTdGFrZWRkdXJhdGlvbiIsInN0YWtlZER1cmF0aW9uIiwic2V0QXV0b3N0YWtlIiwiYXV0b1N0YWtlIiwidG9BY3Rpb25TdGFrZVJlY2xhaW0iLCJwYlN0YWtlUmVjbGFpbSIsIlN0YWtlUmVjbGFpbSIsInNldEJ1Y2tldGluZGV4IiwiYnVja2V0SW5kZXgiLCJ0b0FjdGlvblN0YWtlQWRkRGVwb3NpdCIsInBiU3Rha2VBZGREZXBvc2l0IiwiU3Rha2VBZGREZXBvc2l0IiwidG9BY3Rpb25TdGFrZVJlc3Rha2UiLCJwYlN0YWtlUmVzdGFrZSIsIlN0YWtlUmVzdGFrZSIsInRvQWN0aW9uU3Rha2VDaGFuZ2VDYW5kaWRhdGUiLCJwYlN0YWtlQ2hhbmdlQ2FuZGlkYXRlIiwiU3Rha2VDaGFuZ2VDYW5kaWRhdGUiLCJ0b0FjdGlvblN0YWtlVHJhbnNmZXJPd25lcnNoaXAiLCJwYlN0YWtlVHJhbnNmZXJPd25lcnNoaXAiLCJTdGFrZVRyYW5zZmVyT3duZXJzaGlwIiwic2V0Vm90ZXJhZGRyZXNzIiwidm90ZXJBZGRyZXNzIiwidG9BY3Rpb25DYW5kaWRhdGVSZWdpc3RlciIsInBiQ2FuZGlkYXRlUmVnaXN0ZXIiLCJDYW5kaWRhdGVSZWdpc3RlciIsInBiQ2FuZGlkYXRlQmFzaWNJbmZvIiwiQ2FuZGlkYXRlQmFzaWNJbmZvIiwiY2FuZGlkYXRlIiwic2V0T3BlcmF0b3JhZGRyZXNzIiwib3BlcmF0b3JBZGRyZXNzIiwic2V0UmV3YXJkYWRkcmVzcyIsInJld2FyZEFkZHJlc3MiLCJzZXRDYW5kaWRhdGUiLCJzZXRPd25lcmFkZHJlc3MiLCJvd25lckFkZHJlc3MiLCJ0b0FjdGlvbkNhbmRpZGF0ZUJhc2ljSW5mbyIsInRvQWN0aW9uIiwicGJBY3Rpb25Db3JlIiwiQWN0aW9uQ29yZSIsImNvcmUiLCJzZXRWZXJzaW9uIiwidmVyc2lvbiIsInNldE5vbmNlIiwiTnVtYmVyIiwic2V0R2FzbGltaXQiLCJnYXNMaW1pdCIsInNldEdhc3ByaWNlIiwiZ2FzUHJpY2UiLCJzZXRUcmFuc2ZlciIsInRyYW5zZmVyIiwic2V0RXhlY3V0aW9uIiwiZXhlY3V0aW9uIiwic2V0U3RhcnRzdWJjaGFpbiIsInN0YXJ0U3ViQ2hhaW4iLCJzZXRTdG9wc3ViY2hhaW4iLCJzdG9wU3ViQ2hhaW4iLCJzZXRQdXRibG9jayIsInB1dEJsb2NrIiwic2V0Q3JlYXRlZGVwb3NpdCIsImNyZWF0ZURlcG9zaXQiLCJzZXRTZXR0bGVkZXBvc2l0Iiwic2V0dGxlRGVwb3NpdCIsInNldENyZWF0ZXBsdW1jaGFpbiIsImNyZWF0ZVBsdW1DaGFpbiIsInNldFRlcm1pbmF0ZXBsdW1jaGFpbiIsInRlcm1pbmF0ZVBsdW1DaGFpbiIsInNldFBsdW1wdXRibG9jayIsInBsdW1QdXRCbG9jayIsInNldFBsdW1jcmVhdGVkZXBvc2l0IiwicGx1bUNyZWF0ZURlcG9zaXQiLCJzZXRQbHVtc3RhcnRleGl0IiwicGx1bVN0YXJ0RXhpdCIsInNldFBsdW1jaGFsbGVuZ2VleGl0IiwicGx1bUNoYWxsZW5nZUV4aXQiLCJzZXRQbHVtcmVzcG9uc2VjaGFsbGVuZ2VleGl0IiwicGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdCIsInNldFBsdW1maW5hbGl6ZWV4aXQiLCJwbHVtRmluYWxpemVFeGl0Iiwic2V0UGx1bXNldHRsZWRlcG9zaXQiLCJwbHVtU2V0dGxlRGVwb3NpdCIsInNldFBsdW10cmFuc2ZlciIsInBsdW1UcmFuc2ZlciIsInNldERlcG9zaXR0b3Jld2FyZGluZ2Z1bmQiLCJkZXBvc2l0VG9SZXdhcmRpbmdGdW5kIiwic2V0Q2xhaW1mcm9tcmV3YXJkaW5nZnVuZCIsImNsYWltRnJvbVJld2FyZGluZ0Z1bmQiLCJzZXRHcmFudHJld2FyZCIsImdyYW50UmV3YXJkIiwic2V0U3Rha2VjcmVhdGUiLCJzdGFrZUNyZWF0ZSIsInNldFN0YWtldW5zdGFrZSIsInN0YWtlVW5zdGFrZSIsInNldFN0YWtld2l0aGRyYXciLCJzdGFrZVdpdGhkcmF3Iiwic2V0U3Rha2VhZGRkZXBvc2l0Iiwic3Rha2VBZGREZXBvc2l0Iiwic2V0U3Rha2VyZXN0YWtlIiwic3Rha2VSZXN0YWtlIiwic2V0U3Rha2VjaGFuZ2VjYW5kaWRhdGUiLCJzdGFrZUNoYW5nZUNhbmRpZGF0ZSIsInNldFN0YWtldHJhbnNmZXJvd25lcnNoaXAiLCJzdGFrZVRyYW5zZmVyT3duZXJzaGlwIiwic2V0Q2FuZGlkYXRlcmVnaXN0ZXIiLCJjYW5kaWRhdGVSZWdpc3RlciIsInNldENhbmRpZGF0ZXVwZGF0ZSIsImNhbmRpZGF0ZVVwZGF0ZSIsInBiQWN0aW9uIiwiQWN0aW9uIiwic2V0Q29yZSIsInNlbmRlclB1YktleSIsInNldFNlbmRlcnB1YmtleSIsInNpZ25hdHVyZSIsInNldFNpZ25hdHVyZSIsIkdldEFjdGlvbnNSZXF1ZXN0IiwiYnlBZGRyVG8iLCJieUFkZHIiLCJwYlJlcUJ5QWRkciIsIkdldEFjdGlvbnNCeUFkZHJlc3NSZXF1ZXN0IiwiYnlCbGtUbyIsImJ5QmxrIiwicGJSZXFCeUJsayIsIkdldEFjdGlvbnNCeUJsb2NrUmVxdWVzdCIsImJ5SGFzaFRvIiwiR2V0QWN0aW9uQnlIYXNoUmVxdWVzdCIsImFjdGlvbkhhc2giLCJzZXRBY3Rpb25oYXNoIiwiY2hlY2tpbmdQZW5kaW5nIiwic2V0Q2hlY2twZW5kaW5nIiwiYnlJbmRleFRvIiwiR2V0QWN0aW9uc0J5SW5kZXhSZXF1ZXN0IiwidW5jb25maXJtZWRCeUFkZHJUbyIsInVuY29uZmlybWVkQnlBZGRyIiwicGJSZXFVbmNvbmZpcm1lZEJ5QWRkciIsIkdldFVuY29uZmlybWVkQWN0aW9uc0J5QWRkcmVzc1JlcXVlc3QiLCJzZXRCeWFkZHIiLCJzZXRCeWJsayIsInNldFVuY29uZmlybWVkYnlhZGRyIiwiZnJvbVRyYW5zZmVyIiwidHJhbnNmZXJEYXRhIiwiZ2V0QW1vdW50IiwiZ2V0UmVjaXBpZW50IiwiZ2V0UGF5bG9hZCIsImZyb21Wb3RlIiwidm90ZURhdGEiLCJ2b3RlZUFkZHJlc3MiLCJnZXRWb3RlZWFkZHJlc3MiLCJmcm9tRXhlY3V0aW9uIiwiZ2V0Q29udHJhY3QiLCJCdWZmZXIiLCJnZXREYXRhIiwiZnJvbVN0YXJ0U3ViQ2hhaW4iLCJzdGFydFN1YkNoYWluRGF0YSIsImZyb21TdG9wU3ViQ2hhaW4iLCJzdG9wU3ViQ2hhaW5EYXRhIiwiZnJvbVB1dEJsb2NrIiwicHV0QmxvY2tEYXRhIiwicm9vdHNEYXRhIiwiZnJvbUNyZWF0ZURlcG9zaXQiLCJjcmVhdGVEZXBvc2l0RGF0YSIsImZyb21TZXR0bGVEZXBvc2l0Iiwic2V0dGxlRGVwb3NpdERhdGEiLCJmcm9tQ3JlYXRlUGx1bUNoYWluIiwiY3JlYXRlUGx1bUNoYWluRGF0YSIsImZyb21UZXJtaW5hdGVQbHVtQ2hhaW4iLCJ0ZXJtaW5hdGVQbHVtQ2hhaW5EYXRhIiwiZnJvbVBsdW1QdXRCbG9jayIsInBsdW1QdXRCbG9ja0RhdGEiLCJmcm9tUGx1bUNyZWF0ZURlcG9zaXQiLCJwbHVtQ3JlYXRlRGVwb3NpdERhdGEiLCJmcm9tUGx1bVN0YXJ0RXhpdCIsInBsdW1TdGFydEV4aXREYXRhIiwiZnJvbVBsdW1DaGFsbGVuZ2VFeGl0IiwicGx1bUNoYWxsZW5nZUV4aXREYXRhIiwiZnJvbVBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQiLCJwbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0RGF0YSIsImZyb21QbHVtRmluYWxpemVFeGl0IiwicGx1bUZpbmFsaXplRXhpdERhdGEiLCJmcm9tUGx1bVNldHRsZURlcG9zaXQiLCJwbHVtU2V0dGxlRGVwb3NpdERhdGEiLCJmcm9tUGx1bVRyYW5zZmVyIiwicGx1bVRyYW5zZmVyRGF0YSIsImZyb21EZXBvc2l0VG9SZXdhcmRpbmdGdW5kIiwiZGVwb3NpdFRvUmV3YXJkaW5nRnVuZERhdGEiLCJmcm9tQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZCIsImNsYWltRnJvbVJld2FyZGluZ0Z1bmREYXRhIiwiZnJvbVNldFJld2FyZCIsInNldFJld2FyZERhdGEiLCJmcm9tR3JhbnRSZXdhcmQiLCJnZXRUeXBlIiwiZnJvbVN0YWtlQ3JlYXRlIiwiZ2V0Q2FuZGlkYXRlbmFtZSIsImdldFN0YWtlZGFtb3VudCIsImdldFN0YWtlZGR1cmF0aW9uIiwiZ2V0QXV0b3N0YWtlIiwiZnJvbVN0YWtlUmVjbGFpbSIsImdldEJ1Y2tldGluZGV4IiwiZnJvbVN0YWtlQWRkRGVwb3NpdCIsImZyb21TdGFrZVJlc3Rha2UiLCJmcm9tU3Rha2VDaGFuZ2VDYW5kaWRhdGUiLCJmcm9tU3Rha2VUcmFuc2Zlck93bmVyc2hpcCIsImdldFZvdGVyYWRkcmVzcyIsImZyb21DYW5kaWRhdGVSZWdpc3RlciIsImdldENhbmRpZGF0ZSIsImdldE5hbWUiLCJnZXRPcGVyYXRvcmFkZHJlc3MiLCJnZXRSZXdhcmRhZGRyZXNzIiwiZ2V0T3duZXJhZGRyZXNzIiwiZnJvbUNhbmRpZGF0ZVVwZGF0ZSIsImdldFB1dFBvbGxSZXN1bHQiLCJjYW5kaWRhdGVMaXN0IiwicmF3Q2FuZGlkYXRlcyIsImdldENhbmRpZGF0ZXMiLCJjYW5kaWRhdGVzIiwicmF3Q2FuZGlkYXRlc0xpc3QiLCJnZXRDYW5kaWRhdGVzTGlzdCIsInJhd0NhbmRpZGF0ZSIsInB1c2giLCJ2b3RlcyIsImdldFZvdGVzIiwicHViS2V5IiwiZ2V0UHVia2V5IiwiYWN0aW9uSW5mbyIsInJhd0FjdGlvbkluZm9MaXN0IiwiZ2V0QWN0aW9uaW5mb0xpc3QiLCJyYXdBY3Rpb25JbmZvIiwiYWN0SGFzaCIsImdldEFjdGhhc2giLCJnZXRCbGtoYXNoIiwicmF3QWN0aW9uIiwiZ2V0QWN0aW9uIiwicmF3QWN0aW9uQ29yZSIsImdldENvcmUiLCJhY3Rpb25Db3JlIiwiZ2V0VmVyc2lvbiIsIlN0cmluZyIsImdldEdhc2xpbWl0IiwiZ2V0R2FzcHJpY2UiLCJnZXRUcmFuc2ZlciIsImdldEV4ZWN1dGlvbiIsImdldFN0YXJ0c3ViY2hhaW4iLCJnZXRTdG9wc3ViY2hhaW4iLCJnZXRQdXRibG9jayIsImdldENyZWF0ZWRlcG9zaXQiLCJnZXRTZXR0bGVkZXBvc2l0IiwiZ2V0Q3JlYXRlcGx1bWNoYWluIiwiZ2V0VGVybWluYXRlcGx1bWNoYWluIiwiZ2V0UGx1bXB1dGJsb2NrIiwiZ2V0UGx1bWNyZWF0ZWRlcG9zaXQiLCJnZXRQbHVtc3RhcnRleGl0IiwiZ2V0UGx1bWNoYWxsZW5nZWV4aXQiLCJnZXRQbHVtcmVzcG9uc2VjaGFsbGVuZ2VleGl0IiwiZ2V0UGx1bWZpbmFsaXplZXhpdCIsImdldFBsdW1zZXR0bGVkZXBvc2l0IiwiZ2V0UGx1bXRyYW5zZmVyIiwiZ2V0RGVwb3NpdHRvcmV3YXJkaW5nZnVuZCIsImdldENsYWltZnJvbXJld2FyZGluZ2Z1bmQiLCJnZXRHcmFudHJld2FyZCIsImdldFN0YWtlY3JlYXRlIiwiZ2V0U3Rha2V1bnN0YWtlIiwiZ2V0U3Rha2V3aXRoZHJhdyIsImdldFN0YWtlYWRkZGVwb3NpdCIsImdldFN0YWtlcmVzdGFrZSIsImdldFN0YWtlY2hhbmdlY2FuZGlkYXRlIiwiZ2V0U3Rha2V0cmFuc2Zlcm93bmVyc2hpcCIsImdldENhbmRpZGF0ZXJlZ2lzdGVyIiwiZ2V0Q2FuZGlkYXRldXBkYXRlIiwicHV0UG9sbFJlc3VsdCIsImdldFB1dHBvbGxyZXN1bHQiLCJhY3Rpb24iLCJnZXRTZW5kZXJwdWJrZXkiLCJnZXRTaWduYXR1cmUiLCJTdWdnZXN0R2FzUHJpY2VSZXF1ZXN0IiwiUmVjZWlwdFN0YXR1cyIsImZyb21QYlJlY2VpcHRJbmZvIiwicGJSZWNlaXB0SW5mbyIsInJlY2VpcHQiLCJmcm9tUGJSZWNlaXB0IiwiZ2V0UmVjZWlwdCIsIkdldFJlY2VpcHRCeUFjdGlvblJlcXVlc3QiLCJyZWNlaXB0SW5mbyIsImdldFJlY2VpcHRpbmZvIiwicGJSZWNlaXB0Iiwic3RhdHVzIiwiZ2V0U3RhdHVzIiwiYmxrSGVpZ2h0IiwiZ2V0QmxraGVpZ2h0IiwiZ2FzQ29uc3VtZWQiLCJnZXRHYXNjb25zdW1lZCIsImNvbnRyYWN0QWRkcmVzcyIsImdldENvbnRyYWN0YWRkcmVzcyIsImxvZ3MiLCJmcm9tUGJMb2dMaXN0IiwiZ2V0TG9nc0xpc3QiLCJwYkxvZ0xpc3QiLCJsb2ciLCJ0b3BpY3MiLCJnZXRUb3BpY3NMaXN0IiwiZ2V0SW5kZXgiLCJSZWFkQ29udHJhY3RSZXF1ZXN0Iiwic2V0Q2FsbGVyYWRkcmVzcyIsImNhbGxlckFkZHJlc3MiLCJTZW5kQWN0aW9uUmVxdWVzdCIsInNldEFjdGlvbiIsIlNlbmRBY3Rpb25SZXNwb25zZSIsInJlc3AiLCJnZXRBY3Rpb25oYXNoIiwiRXN0aW1hdGVHYXNGb3JBY3Rpb25SZXF1ZXN0IiwiZ2FzIiwiZ2V0R2FzIiwiUmVhZFN0YXRlUmVxdWVzdCIsInNldFByb3RvY29saWQiLCJwcm90b2NvbElEIiwic2V0TWV0aG9kbmFtZSIsIm1ldGhvZE5hbWUiLCJzZXRBcmd1bWVudHNMaXN0IiwiYXJndW1lbnRzIiwiR2V0RXBvY2hNZXRhUmVxdWVzdCIsImVwb2NoTnVtYmVyIiwic2V0RXBvY2hudW1iZXIiLCJnZXRFcG9jaGRhdGEiLCJicEluZm8iLCJnZXRCbG9ja3Byb2R1Y2Vyc2luZm9MaXN0IiwidG90YWxCbG9ja3MiLCJnZXRUb3RhbGJsb2NrcyIsImJsb2NrUHJvZHVjZXJzSW5mbyIsInBhcnNlZEJwaW5mbyIsImFjdGl2ZSIsImdldEFjdGl2ZSIsInByb2R1Y3Rpb24iLCJnZXRQcm9kdWN0aW9uIiwiR2V0TG9nc1JlcXVlc3QiLCJmaWx0ZXIiLCJMb2dzRmlsdGVyIiwic2V0QWRkcmVzc0xpc3QiLCJ0b3BpYyIsIlRvcGljcyIsInNldFRvcGljTGlzdCIsInNldFRvcGljc0xpc3QiLCJzZXRGaWx0ZXIiLCJieUJsb2NrIiwiR2V0TG9nc0J5QmxvY2siLCJzZXRCbG9ja2hhc2giLCJibG9ja0hhc2giLCJzZXRCeWJsb2NrIiwiYnlSYW5nZSIsIkdldExvZ3NCeVJhbmdlIiwic2V0RnJvbWJsb2NrIiwiZnJvbUJsb2NrIiwic2V0VG9ibG9jayIsInRvQmxvY2siLCJzZXRQYWdpbmF0aW9uc2l6ZSIsInBhZ2luYXRpb25TaXplIiwic2V0QnlyYW5nZSIsIkVzdGltYXRlQWN0aW9uR2FzQ29uc3VtcHRpb25SZXF1ZXN0IiwiZnJvbVBiVGltZXN0YW1wIiwiZ2V0U2Vjb25kcyIsImdldE5hbm9zIiwiZnJvbVBiQmxvY2tIZWFkZXJDb3JlIiwiYmxvY2tIZWFkZXJDb3JlIiwicHJldkJsb2NrSGFzaCIsImdldFByZXZibG9ja2hhc2hfYXNVOCIsImdldFR4cm9vdF9hc1U4IiwiZ2V0RGVsdGFzdGF0ZWRpZ2VzdF9hc1U4IiwiZ2V0UmVjZWlwdHJvb3RfYXNVOCIsImxvZ3NCbG9vbSIsImdldExvZ3NibG9vbV9hc1U4IiwiZnJvbVBiQmxvY2tIZWFkZXIiLCJibG9ja0hlYWRlciIsInByb2R1Y2VyUHVia2V5IiwiZ2V0UHJvZHVjZXJwdWJrZXlfYXNVOCIsImdldFNpZ25hdHVyZV9hc1U4IiwiZnJvbVBiQmxvY2tCb2R5IiwiYmxvY2tCb2R5IiwiZ2V0QWN0aW9uc0xpc3QiLCJhY3Rpb25zIiwiZnJvbVBiRW5kb3JzZW1lbnRzIiwiZW5kb3JzZW1lbnRzIiwiZW5kb3JzZW1lbnQiLCJlbmRvcnNlciIsImdldEVuZG9yc2VyX2FzVTgiLCJmcm9tUGJCbG9ja0Zvb3RlciIsImJsb2NrRm9vdGVyIiwiZ2V0RW5kb3JzZW1lbnRzTGlzdCIsImZyb21QYkJsb2NrIiwiYmxvY2siLCJoZWFkZXIiLCJnZXRIZWFkZXIiLCJib2R5IiwiZ2V0Qm9keSIsImZvb3RlciIsImdldEZvb3RlciIsImZyb21QYlJlY2VpcHRzIiwicmVjZWlwdHMiLCJmcm9tUGJCbG9ja0luZm8iLCJibG9ja0luZm8iLCJnZXRCbG9jayIsImdldFJlY2VpcHRzTGlzdCIsIlN0cmVhbUJsb2Nrc1JlcXVlc3QiLCJTdHJlYW1Mb2dzUmVxdWVzdCIsImZyb21QYkxvZyIsImdldExvZyIsIkNsaWVudFJlYWRhYmxlU3RyZWFtIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJvcmlnaW4iLCJvbiIsImVyciIsImVtaXQiLCJyZXNwb25zZSIsImNhbmNlbCIsIklSZWFkU3Rha2luZ0RhdGFNZXRob2RUb0J1ZmZlciIsInBiT2JqIiwiUmVhZFN0YWtpbmdEYXRhTWV0aG9kIiwibWV0aG9kIiwidmFsdWVPZiIsIk5hbWUiLCJJTlZBTElEIiwic2V0TWV0aG9kIiwiQlVDS0VUUyIsIkJVQ0tFVFNfQllfVk9URVIiLCJCVUNLRVRTX0JZX0NBTkRJREFURSIsIkNBTkRJREFURVMiLCJDQU5ESURBVEVfQllfTkFNRSIsIkJVQ0tFVFNfQllfSU5ERVhFUyIsIkNBTkRJREFURV9CWV9BRERSRVNTIiwiVE9UQUxfU1RBS0lOR19BTU9VTlQiLCJCVUNLRVRTX0NPVU5UIiwiRXJyb3IiLCJzZXJpYWxpemVCaW5hcnkiLCJJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdFRvQnVmZmVyIiwiUmVhZFN0YWtpbmdEYXRhUmVxdWVzdCIsImJ1Y2tldHMiLCJWb3RlQnVja2V0cyIsInBhZ2luYXRpb24iLCJQYWdpbmF0aW9uUGFyYW0iLCJzZXRPZmZzZXQiLCJvZmZzZXQiLCJzZXRMaW1pdCIsImxpbWl0Iiwic2V0UGFnaW5hdGlvbiIsInNldEJ1Y2tldHMiLCJidWNrZXRzQnlWb3RlciIsIlZvdGVCdWNrZXRzQnlWb3RlciIsInNldEJ1Y2tldHNieXZvdGVyIiwiYnVja2V0c0J5Q2FuZGlkYXRlIiwiVm90ZUJ1Y2tldHNCeUNhbmRpZGF0ZSIsInNldENhbmRuYW1lIiwiY2FuZE5hbWUiLCJzZXRCdWNrZXRzYnljYW5kaWRhdGUiLCJDYW5kaWRhdGVzIiwic2V0Q2FuZGlkYXRlcyIsImNhbmRpZGF0ZUJ5TmFtZSIsIkNhbmRpZGF0ZUJ5TmFtZSIsInNldENhbmRpZGF0ZWJ5bmFtZSIsImJ1Y2tldHNCeUluZGV4ZXMiLCJWb3RlQnVja2V0c0J5SW5kZXhlcyIsInNldEluZGV4TGlzdCIsInNldEJ1Y2tldHNieWluZGV4ZXMiLCJjYW5kaWRhdGVCeUFkZHJlc3MiLCJDYW5kaWRhdGVCeUFkZHJlc3MiLCJzZXRPd25lcmFkZHIiLCJvd25lckFkZHIiLCJzZXRDYW5kaWRhdGVieWFkZHJlc3MiLCJ0b3RhbFN0YWtpbmdBbW91bnQiLCJUb3RhbFN0YWtpbmdBbW91bnQiLCJzZXRUb3RhbHN0YWtpbmdhbW91bnQiLCJidWNrZXRzQ291bnQiLCJCdWNrZXRzQ291bnQiLCJzZXRCdWNrZXRzY291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBVUE7O0FBS0E7Ozs7OztBQXVETyxNQUFNQSxpQkFBaUIsR0FBRztBQUMvQkMsRUFBQUEsRUFBRSxDQUFDQyxHQUFELEVBQStCO0FBQy9CLFVBQU1DLEtBQUssR0FBRyxJQUFJQyxnQkFBTUosaUJBQVYsRUFBZDtBQUNBRyxJQUFBQSxLQUFLLENBQUNFLFVBQU4sQ0FBaUJILEdBQUcsQ0FBQ0ksT0FBckI7QUFDQSxXQUFPSCxLQUFQO0FBQ0QsR0FMOEI7O0FBTy9CSSxFQUFBQSxJQUFJLENBQUNDLEtBQUQsRUFBaUQ7QUFDbkQsVUFBTUMsSUFBSSxHQUFHRCxLQUFLLENBQUNFLGNBQU4sRUFBYjs7QUFDQSxRQUFJLENBQUNELElBQUwsRUFBVztBQUNULGFBQU87QUFDTEUsUUFBQUEsV0FBVyxFQUFFQztBQURSLE9BQVA7QUFHRDs7QUFFRCxXQUFPO0FBQ0xELE1BQUFBLFdBQVcsRUFBRTtBQUNYTCxRQUFBQSxPQUFPLEVBQUVHLElBQUksQ0FBQ0ksVUFBTCxFQURFO0FBRVhDLFFBQUFBLE9BQU8sRUFBRUwsSUFBSSxDQUFDTSxVQUFMLEVBRkU7QUFHWEMsUUFBQUEsS0FBSyxFQUFFUCxJQUFJLENBQUNRLFFBQUwsRUFISTtBQUlYQyxRQUFBQSxZQUFZLEVBQUVULElBQUksQ0FBQ1UsZUFBTCxFQUpIO0FB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Q0E5RE0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gXCJldmVudHNcIjtcbmltcG9ydCB7IFRpbWVzdGFtcCB9IGZyb20gXCJnb29nbGUtcHJvdG9idWYvZ29vZ2xlL3Byb3RvYnVmL3RpbWVzdGFtcF9wYlwiO1xuaW1wb3J0ICogYXMgZ3JwY1dlYiBmcm9tIFwiZ3JwYy13ZWJcIjtcbmltcG9ydCBhcGlQYiwge1xuICBCbG9ja0luZm8sXG4gIEdldEFjY291bnRSZXNwb25zZSxcbiAgR2V0QWN0aW9uc1Jlc3BvbnNlLFxuICBHZXRMb2dzUmVzcG9uc2UsXG4gIEdldFJlY2VpcHRCeUFjdGlvblJlc3BvbnNlLFxuICBHZXRTZXJ2ZXJNZXRhUmVzcG9uc2UsXG4gIFJlYWRTdGF0ZVJlc3BvbnNlLFxuICBUb3BpY3Ncbn0gZnJvbSBcIi4uLy4uL3Byb3RvZ2VuL3Byb3RvL2FwaS9hcGlfcGJcIjtcbmltcG9ydCB7XG4gIFBhZ2luYXRpb25QYXJhbSxcbiAgUmVhZFN0YWtpbmdEYXRhTWV0aG9kLFxuICBSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0XG59IGZyb20gXCIuLi8uLi9wcm90b2dlbi9wcm90by9hcGkvcmVhZF9zdGF0ZV9wYlwiO1xuaW1wb3J0IGFjdGlvblBiLCB7XG4gIEV4ZWN1dGlvbixcbiAgTG9nLFxuICBQdXRQb2xsUmVzdWx0LFxuICBSZWNlaXB0XG59IGZyb20gXCIuLi8uLi9wcm90b2dlbi9wcm90by90eXBlcy9hY3Rpb25fcGJcIjtcbmltcG9ydCB7XG4gIEJsb2NrLFxuICBCbG9ja0JvZHksXG4gIEJsb2NrRm9vdGVyLFxuICBCbG9ja0hlYWRlcixcbiAgQmxvY2tIZWFkZXJDb3JlXG59IGZyb20gXCIuLi8uLi9wcm90b2dlbi9wcm90by90eXBlcy9ibG9ja2NoYWluX3BiXCI7XG5pbXBvcnQgeyBFbmRvcnNlbWVudCB9IGZyb20gXCIuLi8uLi9wcm90b2dlbi9wcm90by90eXBlcy9lbmRvcnNlbWVudF9wYlwiO1xuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgVGltZXN0YW1wLlxuZXhwb3J0IGludGVyZmFjZSBJVGltZXN0YW1wIHtcbiAgLy8gVGltZXN0YW1wIHNlY29uZHNcbiAgc2Vjb25kczogbnVtYmVyO1xuXG4gIC8vIFRpbWVzdGFtcCBuYW5vc1xuICBuYW5vczogbnVtYmVyO1xufVxuXG4vLyBpbnRlcmZhY2UgZm9yIGdldCBhY2NvdW50XG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0QWNjb3VudFJlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRBY2NvdW50UmVxdWVzdCB7XG4gIC8vIEdldEFjY291bnRSZXF1ZXN0IGFkZHJlc3NcbiAgYWRkcmVzczogc3RyaW5nO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGFuIEFjY291bnRNZXRhLlxuZXhwb3J0IGludGVyZmFjZSBJQWNjb3VudE1ldGEge1xuICAvLyBBY2NvdW50TWV0YSBhZGRyZXNzXG4gIGFkZHJlc3M6IHN0cmluZztcblxuICAvLyBBY2NvdW50TWV0YSBiYWxhbmNlXG4gIGJhbGFuY2U6IHN0cmluZztcblxuICAvLyBBY2NvdW50TWV0YSBub25jZS4gVHlwZSBpcyBzdHJpbmcgaW4gbm9kZSBidXQgbnVtYmVyIGluIGJyb3dzZXIuXG4gIG5vbmNlOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLy8gQWNjb3VudE1ldGEgcGVuZGluZ05vbmNlLiBUeXBlIGlzIHN0cmluZyBpbiBub2RlIGJ1dCBudW1iZXIgaW4gYnJvd3Nlci5cbiAgcGVuZGluZ05vbmNlOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLy8gQWNjb3VudE1ldGEgbnVtQWN0aW9ucyByZWxhdGVkIHRvIHRoZSBhY2NvdW50LiBUeXBlIGlzIHN0cmluZyBpbiBub2RlIGJ1dCBudW1iZXIgaW4gYnJvd3Nlci5cbiAgbnVtQWN0aW9uczogc3RyaW5nIHwgbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0QWNjb3VudFJlc3BvbnNlLlxuZXhwb3J0IGludGVyZmFjZSBJR2V0QWNjb3VudFJlc3BvbnNlIHtcbiAgLy8gR2V0QWNjb3VudFJlc3BvbnNlIGFjY291bnRNZXRhXG4gIGFjY291bnRNZXRhOiBJQWNjb3VudE1ldGEgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjb25zdCBHZXRBY2NvdW50UmVxdWVzdCA9IHtcbiAgdG8ocmVxOiBJR2V0QWNjb3VudFJlcXVlc3QpOiBhbnkge1xuICAgIGNvbnN0IHBiUmVxID0gbmV3IGFwaVBiLkdldEFjY291bnRSZXF1ZXN0KCk7XG4gICAgcGJSZXEuc2V0QWRkcmVzcyhyZXEuYWRkcmVzcyk7XG4gICAgcmV0dXJuIHBiUmVxO1xuICB9LFxuXG4gIGZyb20ocGJSZXM6IEdldEFjY291bnRSZXNwb25zZSk6IElHZXRBY2NvdW50UmVzcG9uc2Uge1xuICAgIGNvbnN0IG1ldGEgPSBwYlJlcy5nZXRBY2NvdW50bWV0YSgpO1xuICAgIGlmICghbWV0YSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWNjb3VudE1ldGE6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNjb3VudE1ldGE6IHtcbiAgICAgICAgYWRkcmVzczogbWV0YS5nZXRBZGRyZXNzKCksXG4gICAgICAgIGJhbGFuY2U6IG1ldGEuZ2V0QmFsYW5jZSgpLFxuICAgICAgICBub25jZTogbWV0YS5nZXROb25jZSgpLFxuICAgICAgICBwZW5kaW5nTm9uY2U6IG1ldGEuZ2V0UGVuZGluZ25vbmNlKCksXG4gICAgICAgIG51bUFjdGlvbnM6IG1ldGEuZ2V0TnVtYWN0aW9ucygpXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxuLy8gaW50ZXJmYWNlIGZvciBnZXQgY2hhaW4gbWV0YVxuZXhwb3J0IGludGVyZmFjZSBJRXBvY2hEYXRhIHtcbiAgbnVtOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBncmF2aXR5Q2hhaW5TdGFydEhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElDaGFpbk1ldGEge1xuICBoZWlnaHQ6IHN0cmluZztcbiAgbnVtQWN0aW9uczogc3RyaW5nO1xuICB0cHM6IHN0cmluZztcbiAgZXBvY2g6IElFcG9jaERhdGE7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldENoYWluTWV0YVJlcXVlc3Qge31cblxuZXhwb3J0IGludGVyZmFjZSBJR2V0Q2hhaW5NZXRhUmVzcG9uc2Uge1xuICBjaGFpbk1ldGE6IElDaGFpbk1ldGE7XG59XG5cbmV4cG9ydCBjb25zdCBHZXRDaGFpbk1ldGFSZXF1ZXN0ID0ge1xuICAvLyBAdHMtaWdub3JlXG4gIHRvKHJlcTogSUdldENoYWluTWV0YVJlcXVlc3QpOiBhbnkge1xuICAgIHJldHVybiBuZXcgYXBpUGIuR2V0Q2hhaW5NZXRhUmVxdWVzdCgpO1xuICB9LFxuXG4gIGZyb20ocGJSZXM6IGFueSk6IElHZXRDaGFpbk1ldGFSZXNwb25zZSB7XG4gICAgY29uc3QgbWV0YSA9IHBiUmVzLmdldENoYWlubWV0YSgpO1xuICAgIGNvbnN0IHJlcyA9IHtcbiAgICAgIGNoYWluTWV0YTogbWV0YVxuICAgIH07XG4gICAgaWYgKG1ldGEpIHtcbiAgICAgIGNvbnN0IGVwb2NoRGF0YSA9IG1ldGEuZ2V0RXBvY2goKTtcbiAgICAgIHJlcy5jaGFpbk1ldGEgPSB7XG4gICAgICAgIGhlaWdodDogbWV0YS5nZXRIZWlnaHQoKSxcbiAgICAgICAgbnVtQWN0aW9uczogbWV0YS5nZXROdW1hY3Rpb25zKCksXG4gICAgICAgIHRwczogbWV0YS5nZXRUcHMoKSxcbiAgICAgICAgZXBvY2g6IHtcbiAgICAgICAgICBudW06IGVwb2NoRGF0YSAmJiBlcG9jaERhdGEuZ2V0TnVtKCksXG4gICAgICAgICAgaGVpZ2h0OiBlcG9jaERhdGEgJiYgZXBvY2hEYXRhLmdldEhlaWdodCgpLFxuICAgICAgICAgIGdyYXZpdHlDaGFpblN0YXJ0SGVpZ2h0OlxuICAgICAgICAgICAgZXBvY2hEYXRhICYmIGVwb2NoRGF0YS5nZXRHcmF2aXR5Y2hhaW5zdGFydGhlaWdodCgpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbi8vIGludGVyZmFjZSBmb3IgZ2V0IHNlcnZlciBtZXRhc1xuZXhwb3J0IGludGVyZmFjZSBJU2VydmVyTWV0YSB7XG4gIHBhY2thZ2VWZXJzaW9uOiBzdHJpbmc7XG4gIHBhY2thZ2VDb21taXRJRDogc3RyaW5nO1xuICBnaXRTdGF0dXM6IHN0cmluZztcbiAgZ29WZXJzaW9uOiBzdHJpbmc7XG4gIGJ1aWxkVGltZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRTZXJ2ZXJNZXRhUmVxdWVzdCB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRTZXJ2ZXJNZXRhUmVzcG9uc2Uge1xuICBzZXJ2ZXJNZXRhOiBJU2VydmVyTWV0YSB8IHVuZGVmaW5lZDtcbn1cbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBjb25zdCBHZXRTZXJ2ZXJNZXRhUmVxdWVzdCA9IHtcbiAgLy8gQHRzLWlnbm9yZVxuICB0byhyZXE6IElHZXRTZXJ2ZXJNZXRhUmVxdWVzdCk6IGFwaVBiLkdldFNlcnZlck1ldGFSZXF1ZXN0IHtcbiAgICByZXR1cm4gbmV3IGFwaVBiLkdldFNlcnZlck1ldGFSZXF1ZXN0KCk7XG4gIH0sXG5cbiAgZnJvbShwYlJlczogR2V0U2VydmVyTWV0YVJlc3BvbnNlKTogSUdldFNlcnZlck1ldGFSZXNwb25zZSB7XG4gICAgY29uc3QgbWV0YSA9IHBiUmVzLmdldFNlcnZlcm1ldGEoKTtcbiAgICBpZiAoIW1ldGEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNlcnZlck1ldGE6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2VydmVyTWV0YToge1xuICAgICAgICBwYWNrYWdlVmVyc2lvbjogbWV0YS5nZXRQYWNrYWdldmVyc2lvbigpLFxuICAgICAgICBwYWNrYWdlQ29tbWl0SUQ6IG1ldGEuZ2V0UGFja2FnZWNvbW1pdGlkKCksXG4gICAgICAgIGdpdFN0YXR1czogbWV0YS5nZXRHaXRzdGF0dXMoKSxcbiAgICAgICAgZ29WZXJzaW9uOiBtZXRhLmdldEdvdmVyc2lvbigpLFxuICAgICAgICBidWlsZFRpbWU6IG1ldGEuZ2V0QnVpbGR0aW1lKClcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG4vLyBpbnRlcmZhY2UgZm9yIGdldCBibG9jayBtZXRhc1xuLy8gUHJvcGVydGllcyBvZiBhIEdldEJsb2NrTWV0YXNCeUluZGV4UmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldEJsb2NrTWV0YXNCeUluZGV4UmVxdWVzdCB7XG4gIC8vIEdldEJsb2NrTWV0YXNCeUluZGV4UmVxdWVzdCBzdGFydFxuICBzdGFydDogbnVtYmVyO1xuXG4gIC8vIEdldEJsb2NrTWV0YXNCeUluZGV4UmVxdWVzdCBjb3VudFxuICBjb3VudDogbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0QmxvY2tNZXRhc0J5SGFzaFJlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRCbG9ja01ldGFzQnlIYXNoUmVxdWVzdCB7XG4gIC8vIEdldEJsb2NrTWV0YXNCeUhhc2hSZXF1ZXN0IGFkZHJlc3NcbiAgYmxrSGFzaDogc3RyaW5nO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0QmxvY2tNZXRhc1JlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRCbG9ja01ldGFzUmVxdWVzdCB7XG4gIC8vIEdldEJsb2NrTWV0YXNSZXF1ZXN0IGJ5SW5kZXhcbiAgYnlJbmRleD86IElHZXRCbG9ja01ldGFzQnlJbmRleFJlcXVlc3Q7XG5cbiAgLy8gR2V0QmxvY2tNZXRhc1JlcXVlc3QgYnlIYXNoXG4gIGJ5SGFzaD86IElHZXRCbG9ja01ldGFzQnlIYXNoUmVxdWVzdDtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhbiBibG9ja01ldGEuXG5leHBvcnQgaW50ZXJmYWNlIElCbG9ja01ldGEge1xuICAvLyBCbG9ja01ldGEgaGFzaFxuICBoYXNoOiBzdHJpbmc7XG5cbiAgLy8gQmxvY2tNZXRhIGhlaWdodFxuICBoZWlnaHQ6IG51bWJlcjtcblxuICAvLyBCbG9ja01ldGEgdGltZXN0YW1wXG4gIHRpbWVzdGFtcDogSVRpbWVzdGFtcDtcblxuICAvLyBCbG9ja01ldGEgbnVtQWN0aW9uc1xuICBudW1BY3Rpb25zOiBudW1iZXI7XG5cbiAgLy8gQmxvY2tNZXRhIHByb2R1Y2VyQWRkcmVzc1xuICBwcm9kdWNlckFkZHJlc3M6IHN0cmluZztcblxuICAvLyBCbG9ja01ldGEgdHJhbnNmZXJBbW91bnRcbiAgdHJhbnNmZXJBbW91bnQ6IHN0cmluZztcblxuICAvLyBCbG9ja01ldGEgdHhSb290XG4gIHR4Um9vdDogc3RyaW5nO1xuXG4gIC8vIEJsb2NrTWV0YSByZWNlaXB0Um9vdFxuICByZWNlaXB0Um9vdDogc3RyaW5nO1xuXG4gIC8vIEJsb2NrTWV0YSBkZWx0YVN0YXRlRGlnZXN0XG4gIGRlbHRhU3RhdGVEaWdlc3Q6IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIEdldEJsb2NrTWV0YXNSZXNwb25zZS5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldEJsb2NrTWV0YXNSZXNwb25zZSB7XG4gIC8vIEdldEJsb2NrTWV0YXNSZXNwb25zZSBibG9ja01ldGFzXG4gIGJsa01ldGFzOiBBcnJheTxJQmxvY2tNZXRhPjtcbiAgdG90YWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IEdldEJsb2NrTWV0YXNSZXF1ZXN0ID0ge1xuICB0byhyZXE6IElHZXRCbG9ja01ldGFzUmVxdWVzdCk6IGFueSB7XG4gICAgY29uc3QgcGJSZXEgPSBuZXcgYXBpUGIuR2V0QmxvY2tNZXRhc1JlcXVlc3QoKTtcbiAgICBpZiAocmVxLmJ5SW5kZXgpIHtcbiAgICAgIGNvbnN0IHBiUmVxQnlJbmRleCA9IG5ldyBhcGlQYi5HZXRCbG9ja01ldGFzQnlJbmRleFJlcXVlc3QoKTtcbiAgICAgIGlmIChyZXEuYnlJbmRleC5zdGFydCkge1xuICAgICAgICBwYlJlcUJ5SW5kZXguc2V0U3RhcnQocmVxLmJ5SW5kZXguc3RhcnQpO1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5ieUluZGV4LmNvdW50KSB7XG4gICAgICAgIHBiUmVxQnlJbmRleC5zZXRDb3VudChyZXEuYnlJbmRleC5jb3VudCk7XG4gICAgICB9XG4gICAgICBwYlJlcS5zZXRCeWluZGV4KHBiUmVxQnlJbmRleCk7XG4gICAgfSBlbHNlIGlmIChyZXEuYnlIYXNoKSB7XG4gICAgICBjb25zdCBwYlJlcUJ5SGFzaCA9IG5ldyBhcGlQYi5HZXRCbG9ja01ldGFCeUhhc2hSZXF1ZXN0KCk7XG4gICAgICBwYlJlcUJ5SGFzaC5zZXRCbGtoYXNoKHJlcS5ieUhhc2guYmxrSGFzaCk7XG4gICAgICBwYlJlcS5zZXRCeWhhc2gocGJSZXFCeUhhc2gpO1xuICAgIH1cbiAgICByZXR1cm4gcGJSZXE7XG4gIH0sXG5cbiAgZnJvbShwYlJlczogYW55KTogSUdldEJsb2NrTWV0YXNSZXNwb25zZSB7XG4gICAgY29uc3QgbWV0YXMgPSBwYlJlcy5nZXRCbGttZXRhc0xpc3QoKTtcbiAgICBjb25zdCByZXMgPSB7XG4gICAgICBibGtNZXRhczogbWV0YXMsXG4gICAgICB0b3RhbDogcGJSZXMuZ2V0VG90YWwoKVxuICAgIH07XG4gICAgaWYgKG1ldGFzKSB7XG4gICAgICBjb25zdCBwYXJzZWRNZXRhcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXRhcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJzZWRNZXRhc1tpXSA9IHtcbiAgICAgICAgICBoYXNoOiBtZXRhc1tpXS5nZXRIYXNoKCksXG4gICAgICAgICAgaGVpZ2h0OiBtZXRhc1tpXS5nZXRIZWlnaHQoKSxcbiAgICAgICAgICB0aW1lc3RhbXA6IG1ldGFzW2ldLmdldFRpbWVzdGFtcCgpLFxuICAgICAgICAgIG51bUFjdGlvbnM6IG1ldGFzW2ldLmdldE51bWFjdGlvbnMoKSxcbiAgICAgICAgICBwcm9kdWNlckFkZHJlc3M6IG1ldGFzW2ldLmdldFByb2R1Y2VyYWRkcmVzcygpLFxuICAgICAgICAgIHRyYW5zZmVyQW1vdW50OiBtZXRhc1tpXS5nZXRUcmFuc2ZlcmFtb3VudCgpLFxuICAgICAgICAgIHR4Um9vdDogbWV0YXNbaV0uZ2V0VHhyb290KCksXG4gICAgICAgICAgcmVjZWlwdFJvb3Q6IG1ldGFzW2ldLmdldFJlY2VpcHRyb290KCksXG4gICAgICAgICAgZGVsdGFTdGF0ZURpZ2VzdDogbWV0YXNbaV0uZ2V0RGVsdGFzdGF0ZWRpZ2VzdCgpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXMuYmxrTWV0YXMgPSBwYXJzZWRNZXRhcztcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuLy8gaW50ZXJmYWNlIGZvciBnZXQgYWN0aW9uc1xuLy8gUHJvcGVydGllcyBvZiBhIEdldEFjdGlvbnNCeUluZGV4UmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldEFjdGlvbnNCeUluZGV4UmVxdWVzdCB7XG4gIC8vIEdldEFjdGlvbnNCeUluZGV4UmVxdWVzdCBzdGFydFxuICBzdGFydDogbnVtYmVyO1xuXG4gIC8vIEdldEFjdGlvbnNCeUluZGV4UmVxdWVzdCBjb3VudFxuICBjb3VudDogbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0QWN0aW9uc0J5SGFzaFJlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRBY3Rpb25zQnlIYXNoUmVxdWVzdCB7XG4gIC8vIEdldEFjdGlvbnNCeUhhc2hSZXF1ZXN0IGFjdGlvbkhhc2hcbiAgYWN0aW9uSGFzaDogc3RyaW5nO1xuXG4gIC8vIEdldEFjdGlvbnNCeUhhc2hSZXF1ZXN0IGNoZWNraW5nUGVuZGluZ1xuICBjaGVja2luZ1BlbmRpbmc6IGJvb2xlYW47XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBHZXRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldEFjdGlvbnNCeUFkZHJlc3NSZXF1ZXN0IHtcbiAgLy8gR2V0QWN0aW9uc0J5QWRkcmVzc1JlcXVlc3QgYWRkcmVzc1xuICBhZGRyZXNzOiBzdHJpbmc7XG5cbiAgLy8gR2V0QWN0aW9uc0J5QWRkcmVzc1JlcXVlc3Qgc3RhcnRcbiAgc3RhcnQ6IG51bWJlcjtcblxuICAvLyBHZXRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdCBjb3VudFxuICBjb3VudDogbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0VW5jb25maXJtZWRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldFVuY29uZmlybWVkQWN0aW9uc0J5QWRkcmVzc1JlcXVlc3Qge1xuICAvLyBHZXRVbmNvbmZpcm1lZEFjdGlvbnNCeUFkZHJlc3NSZXF1ZXN0IGFkZHJlc3NcbiAgYWRkcmVzczogc3RyaW5nO1xuXG4gIC8vIEdldFVuY29uZmlybWVkQWN0aW9uc0J5QWRkcmVzc1JlcXVlc3Qgc3RhcnRcbiAgc3RhcnQ6IG51bWJlcjtcblxuICAvLyBHZXRVbmNvbmZpcm1lZEFjdGlvbnNCeUFkZHJlc3NSZXF1ZXN0IGNvdW50XG4gIGNvdW50OiBudW1iZXI7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBHZXRBY3Rpb25zQnlCbG9ja1JlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRBY3Rpb25zQnlCbG9ja1JlcXVlc3Qge1xuICAvLyBHZXRBY3Rpb25zQnlCbG9ja1JlcXVlc3QgYmxrSGFzaFxuICBibGtIYXNoOiBzdHJpbmc7XG5cbiAgLy8gR2V0QWN0aW9uc0J5QmxvY2tSZXF1ZXN0IHN0YXJ0XG4gIHN0YXJ0OiBudW1iZXI7XG5cbiAgLy8gR2V0QWN0aW9uc0J5QmxvY2tSZXF1ZXN0IGNvdW50XG4gIGNvdW50OiBudW1iZXI7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBHZXRBY3Rpb25zUmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldEFjdGlvbnNSZXF1ZXN0IHtcbiAgLy8gR2V0QWN0aW9uc1JlcXVlc3QgYnlJbmRleFxuICBieUluZGV4PzogSUdldEFjdGlvbnNCeUluZGV4UmVxdWVzdDtcblxuICAvLyBHZXRBY3Rpb25zUmVxdWVzdCBieUhhc2hcbiAgYnlIYXNoPzogSUdldEFjdGlvbnNCeUhhc2hSZXF1ZXN0O1xuXG4gIC8vIEdldEFjdGlvbnNSZXF1ZXN0IGJ5QWRkclxuICBieUFkZHI/OiBJR2V0QWN0aW9uc0J5QWRkcmVzc1JlcXVlc3Q7XG5cbiAgLy8gR2V0VW5jb25maXJtZWRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdCB1bmNvbmZpcm1lZEJ5QWRkclxuICB1bmNvbmZpcm1lZEJ5QWRkcj86IElHZXRVbmNvbmZpcm1lZEFjdGlvbnNCeUFkZHJlc3NSZXF1ZXN0O1xuXG4gIC8vIEdldEFjdGlvbnNCeUJsb2NrUmVxdWVzdCBieUJsa1xuICBieUJsaz86IElHZXRBY3Rpb25zQnlCbG9ja1JlcXVlc3Q7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBUcmFuc2Zlci5cbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zZmVyIHtcbiAgLy8gVHJhbnNmZXIgYW1vdW50XG4gIGFtb3VudDogc3RyaW5nO1xuXG4gIC8vIFRyYW5zZmVyIHJlY2lwaWVudFxuICByZWNpcGllbnQ6IHN0cmluZztcblxuICAvLyBUcmFuc2ZlciBwYXlsb2FkXG4gIHBheWxvYWQ6IEJ1ZmZlciB8IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIEV4ZWN1dGlvbi5cbmV4cG9ydCBpbnRlcmZhY2UgSUV4ZWN1dGlvbiB7XG4gIC8vIEV4ZWN1dGlvbiBhbW91bnRcbiAgYW1vdW50OiBzdHJpbmc7XG5cbiAgLy8gRXhlY3V0aW9uIGNvbnRyYWN0XG4gIGNvbnRyYWN0OiBzdHJpbmc7XG5cbiAgLy8gRXhlY3V0aW9uIGRhdGFcbiAgZGF0YTogQnVmZmVyIHwgc3RyaW5nO1xufVxuXG4vLyBjcmVhdGUgc3Rha2VcbmV4cG9ydCBpbnRlcmZhY2UgSVN0YWtlQ3JlYXRlIHtcbiAgY2FuZGlkYXRlTmFtZTogc3RyaW5nO1xuICBzdGFrZWRBbW91bnQ6IHN0cmluZztcbiAgc3Rha2VkRHVyYXRpb246IG51bWJlcjtcbiAgYXV0b1N0YWtlOiBib29sZWFuO1xuICBwYXlsb2FkOiBCdWZmZXIgfCBzdHJpbmc7XG59XG5cbi8vIHVuc3Rha2Ugb3Igd2l0aGRyYXdcbmV4cG9ydCBpbnRlcmZhY2UgSVN0YWtlUmVjbGFpbSB7XG4gIGJ1Y2tldEluZGV4OiBudW1iZXI7XG4gIHBheWxvYWQ6IEJ1ZmZlciB8IHN0cmluZztcbn1cblxuLy8gYWRkIHRoZSBhbW91bnQgb2YgYnVja2V0XG5leHBvcnQgaW50ZXJmYWNlIElTdGFrZUFkZERlcG9zaXQge1xuICBidWNrZXRJbmRleDogbnVtYmVyO1xuICBhbW91bnQ6IHN0cmluZztcbiAgcGF5bG9hZDogQnVmZmVyIHwgc3RyaW5nO1xufVxuXG4vLyByZXN0YWtlIHRoZSBkdXJhdGlvbiBhbmQgYXV0b1N0YWtlIGZsYWcgb2YgYnVja2V0XG5leHBvcnQgaW50ZXJmYWNlIElTdGFrZVJlc3Rha2Uge1xuICBidWNrZXRJbmRleDogbnVtYmVyO1xuICBzdGFrZWREdXJhdGlvbjogbnVtYmVyO1xuICBhdXRvU3Rha2U6IGJvb2xlYW47XG4gIHBheWxvYWQ6IEJ1ZmZlciB8IHN0cmluZztcbn1cblxuLy8gbW92ZSB0aGUgYnVja2V0IHRvIHZvdGUgZm9yIGFub3RoZXIgY2FuZGlkYXRlIG9yIHRyYW5zZmVyIHRoZSBvd25lcnNoaXAgb2YgYnVja2V0IHRvIGFub3RoZXIgdm90ZXJzXG5leHBvcnQgaW50ZXJmYWNlIElTdGFrZUNoYW5nZUNhbmRpZGF0ZSB7XG4gIGJ1Y2tldEluZGV4OiBudW1iZXI7XG4gIGNhbmRpZGF0ZU5hbWU6IHN0cmluZztcbiAgcGF5bG9hZDogQnVmZmVyIHwgc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTdGFrZVRyYW5zZmVyT3duZXJzaGlwIHtcbiAgYnVja2V0SW5kZXg6IG51bWJlcjtcbiAgdm90ZXJBZGRyZXNzOiBzdHJpbmc7XG4gIHBheWxvYWQ6IEJ1ZmZlciB8IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2FuZGlkYXRlQmFzaWNJbmZvIHtcbiAgbmFtZTogc3RyaW5nO1xuICBvcGVyYXRvckFkZHJlc3M6IHN0cmluZztcbiAgcmV3YXJkQWRkcmVzczogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElDYW5kaWRhdGVSZWdpc3RlciB7XG4gIGNhbmRpZGF0ZTogSUNhbmRpZGF0ZUJhc2ljSW5mbztcbiAgc3Rha2VkQW1vdW50OiBzdHJpbmc7XG4gIHN0YWtlZER1cmF0aW9uOiBudW1iZXI7XG4gIGF1dG9TdGFrZTogYm9vbGVhbjtcbiAgb3duZXJBZGRyZXNzOiBzdHJpbmc7XG4gIHBheWxvYWQ6IEJ1ZmZlciB8IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFN0YXJ0U3ViQ2hhaW4uXG5leHBvcnQgaW50ZXJmYWNlIElTdGFydFN1YkNoYWluIHtcbiAgLy8gU3RhcnRTdWJDaGFpbiBjaGFpbklEXG4gIGNoYWluSUQ6IG51bWJlcjtcblxuICAvLyBTdGFydFN1YkNoYWluIHNlY3VyaXR5RGVwb3NpdFxuICBzZWN1cml0eURlcG9zaXQ6IHN0cmluZztcblxuICAvLyBTdGFydFN1YkNoYWluIG9wZXJhdGlvbkRlcG9zaXRcbiAgb3BlcmF0aW9uRGVwb3NpdDogc3RyaW5nO1xuXG4gIC8vIFN0YXJ0U3ViQ2hhaW4gc3RhcnRIZWlnaHRcbiAgc3RhcnRIZWlnaHQ6IG51bWJlcjtcblxuICAvLyBTdGFydFN1YkNoYWluIHBhcmVudEhlaWdodE9mZnNldFxuICBwYXJlbnRIZWlnaHRPZmZzZXQ6IG51bWJlcjtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFN0b3BTdWJDaGFpbi5cbmV4cG9ydCBpbnRlcmZhY2UgSVN0b3BTdWJDaGFpbiB7XG4gIC8vIFN0b3BTdWJDaGFpbiBjaGFpbklEXG4gIGNoYWluSUQ6IG51bWJlcjtcblxuICAvLyBTdG9wU3ViQ2hhaW4gc3RvcEhlaWdodFxuICBzdG9wSGVpZ2h0OiBudW1iZXI7XG5cbiAgLy8gU3RvcFN1YkNoYWluIHN1YkNoYWluQWRkcmVzc1xuICBzdWJDaGFpbkFkZHJlc3M6IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIE1lcmtsZVJvb3QuXG5leHBvcnQgaW50ZXJmYWNlIElNZXJrbGVSb290IHtcbiAgLy8gTWVya2xlUm9vdCBuYW1lXG4gIG5hbWU6IHN0cmluZztcblxuICAvLyBNZXJrbGVSb290IHZhbHVlXG4gIHZhbHVlOiBCdWZmZXI7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBQdXRCbG9jay5cbmV4cG9ydCBpbnRlcmZhY2UgSVB1dEJsb2NrIHtcbiAgLy8gUHV0QmxvY2sgc3ViQ2hhaW5BZGRyZXNzXG4gIHN1YkNoYWluQWRkcmVzczogc3RyaW5nO1xuXG4gIC8vIFB1dEJsb2NrIGhlaWdodFxuICBoZWlnaHQ6IG51bWJlcjtcblxuICAvLyBQdXRCbG9jayByb290c1xuICByb290czogQXJyYXk8SU1lcmtsZVJvb3Q+O1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgQ3JlYXRlRGVwb3NpdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUNyZWF0ZURlcG9zaXQge1xuICAvLyBDcmVhdGVEZXBvc2l0IGNoYWluSURcbiAgY2hhaW5JRDogbnVtYmVyO1xuXG4gIC8vIENyZWF0ZURlcG9zaXQgYW1vdW50XG4gIGFtb3VudDogc3RyaW5nO1xuXG4gIC8vIENyZWF0ZURlcG9zaXQgcmVjZWlwdFxuICByZWNpcGllbnQ6IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFNldHRsZURlcG9zaXQuXG5leHBvcnQgaW50ZXJmYWNlIElTZXR0bGVEZXBvc2l0IHtcbiAgLy8gU2V0dGxlRGVwb3NpdCBhbW91bnRcbiAgYW1vdW50OiBzdHJpbmc7XG5cbiAgLy8gU2V0dGxlRGVwb3NpdCByZWNpcGllbnRcbiAgcmVjaXBpZW50OiBzdHJpbmc7XG5cbiAgLy8gU2V0dGxlRGVwb3NpdCBpbmRleFxuICBpbmRleDogbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgQ3JlYXRlUGx1bUNoYWluLlxuZXhwb3J0IGludGVyZmFjZSBJQ3JlYXRlUGx1bUNoYWluIHt9XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBUZXJtaW5hdGVQbHVtQ2hhaW4uXG5leHBvcnQgaW50ZXJmYWNlIElUZXJtaW5hdGVQbHVtQ2hhaW4ge1xuICAvLyBUZXJtaW5hdGVQbHVtQ2hhaW4gc3ViQ2hhaW5BZGRyZXNzXG4gIHN1YkNoYWluQWRkcmVzczogc3RyaW5nO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgUGx1bVB1dEJsb2NrLlxuZXhwb3J0IGludGVyZmFjZSBJUGx1bVB1dEJsb2NrIHtcbiAgLy8gUGx1bVB1dEJsb2NrIHN1YkNoYWluQWRkcmVzc1xuICBzdWJDaGFpbkFkZHJlc3M6IHN0cmluZztcblxuICAvLyBQbHVtUHV0QmxvY2sgaGVpZ2h0XG4gIGhlaWdodDogbnVtYmVyO1xuXG4gIC8vIFBsdW1QdXRCbG9jayBoZWlnaHRcbiAgcm9vdHM6IE1hcDxzdHJpbmcsIEJ1ZmZlciB8IHt9Pjtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFBsdW1DcmVhdGVEZXBvc2l0LlxuZXhwb3J0IGludGVyZmFjZSBJUGx1bUNyZWF0ZURlcG9zaXQge1xuICAvLyBQbHVtQ3JlYXRlRGVwb3NpdCBzdWJDaGFpbkFkZHJlc3NcbiAgc3ViQ2hhaW5BZGRyZXNzOiBzdHJpbmc7XG5cbiAgLy8gUGx1bUNyZWF0ZURlcG9zaXQgYW1vdW50XG4gIGFtb3VudDogc3RyaW5nO1xuXG4gIC8vIFBsdW1DcmVhdGVEZXBvc2l0IHJlY2lwaWVudFxuICByZWNpcGllbnQ6IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFBsdW1TdGFydEV4aXQuXG5leHBvcnQgaW50ZXJmYWNlIElQbHVtU3RhcnRFeGl0IHtcbiAgLy8gUGx1bVN0YXJ0RXhpdCBzdWJDaGFpbkFkZHJlc3NcbiAgc3ViQ2hhaW5BZGRyZXNzOiBzdHJpbmc7XG5cbiAgLy8gUGx1bVN0YXJ0RXhpdCBwcmV2aW91c1RyYW5zZmVyXG4gIHByZXZpb3VzVHJhbnNmZXI6IEJ1ZmZlcjtcblxuICAvLyBQbHVtU3RhcnRFeGl0IHByZXZpb3VzVHJhbnNmZXJCbG9ja1Byb29mXG4gIHByZXZpb3VzVHJhbnNmZXJCbG9ja1Byb29mOiBCdWZmZXI7XG5cbiAgLy8gUGx1bVN0YXJ0RXhpdCBwcmV2aW91c1RyYW5zZmVyQmxvY2tIZWlnaHRcbiAgcHJldmlvdXNUcmFuc2ZlckJsb2NrSGVpZ2h0OiBudW1iZXI7XG5cbiAgLy8gUGx1bVN0YXJ0RXhpdCBleGl0VHJhbnNmZXJcbiAgZXhpdFRyYW5zZmVyOiBCdWZmZXIgfCBzdHJpbmc7XG5cbiAgLy8gUGx1bVN0YXJ0RXhpdCBleGl0VHJhbnNmZXJCbG9ja1Byb29mXG4gIGV4aXRUcmFuc2ZlckJsb2NrUHJvb2Y6IEJ1ZmZlciB8IHN0cmluZztcblxuICAvLyBQbHVtU3RhcnRFeGl0IGV4aXRUcmFuc2ZlckJsb2NrSGVpZ2h0XG4gIGV4aXRUcmFuc2ZlckJsb2NrSGVpZ2h0OiBudW1iZXI7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBQbHVtQ2hhbGxlbmdlRXhpdC5cbmV4cG9ydCBpbnRlcmZhY2UgSVBsdW1DaGFsbGVuZ2VFeGl0IHtcbiAgLy8gUGx1bUNoYWxsZW5nZUV4aXQgc3ViQ2hhaW5BZGRyZXNzXG4gIHN1YkNoYWluQWRkcmVzczogc3RyaW5nO1xuXG4gIC8vIFBsdW1DaGFsbGVuZ2VFeGl0IGNoYWluSURcbiAgY29pbklEOiBudW1iZXI7XG5cbiAgLy8gUGx1bUNoYWxsZW5nZUV4aXQgY2hhbGxlbmdlVHJhbnNmZXJcbiAgY2hhbGxlbmdlVHJhbnNmZXI6IEJ1ZmZlciB8IHN0cmluZztcblxuICAvLyBQbHVtQ2hhbGxlbmdlRXhpdCBjaGFsbGVuZ2VUcmFuc2ZlckJsb2NrUHJvb2ZcbiAgY2hhbGxlbmdlVHJhbnNmZXJCbG9ja1Byb29mOiBCdWZmZXIgfCBzdHJpbmc7XG5cbiAgLy8gUGx1bUNoYWxsZW5nZUV4aXQgY2hhbGxlbmdlVHJhbnNmZXJCbG9ja0hlaWdodFxuICBjaGFsbGVuZ2VUcmFuc2ZlckJsb2NrSGVpZ2h0OiBudW1iZXI7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBQbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0LlxuZXhwb3J0IGludGVyZmFjZSBJUGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdCB7XG4gIC8vIFBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQgc3ViQ2hhaW5BZGRyZXNzXG4gIHN1YkNoYWluQWRkcmVzczogc3RyaW5nO1xuXG4gIC8vIFBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQgY29pbklEXG4gIGNvaW5JRDogbnVtYmVyO1xuXG4gIC8vIFBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQgY2hhbGxlbmdlVHJhbnNmZXJcbiAgY2hhbGxlbmdlVHJhbnNmZXI6IEJ1ZmZlcjtcblxuICAvLyBQbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0IHJlc3BvbnNlVHJhbnNmZXJcbiAgcmVzcG9uc2VUcmFuc2ZlcjogQnVmZmVyO1xuXG4gIC8vIFBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQgcmVzcG9uc2VUcmFuc2ZlckJsb2NrUHJvb2ZcbiAgcmVzcG9uc2VUcmFuc2ZlckJsb2NrUHJvb2Y6IEJ1ZmZlcjtcblxuICAvLyBQbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0IHByZXZpb3VzVHJhbnNmZXJCbG9ja0hlaWdodFxuICBwcmV2aW91c1RyYW5zZmVyQmxvY2tIZWlnaHQ6IG51bWJlcjtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFBsdW1GaW5hbGl6ZUV4aXQuXG5leHBvcnQgaW50ZXJmYWNlIElQbHVtRmluYWxpemVFeGl0IHtcbiAgLy8gUGx1bUZpbmFsaXplRXhpdCBzdWJDaGFpbkFkZHJlc3NcbiAgc3ViQ2hhaW5BZGRyZXNzOiBzdHJpbmc7XG5cbiAgLy8gUGx1bUZpbmFsaXplRXhpdCBjb2luSURcbiAgY29pbklEOiBudW1iZXI7XG59XG5cbi8vIHBsdW0gc3ViIGNoYWluIEFQSXNcbi8vIFByb3BlcnRpZXMgb2YgYSBQbHVtU2V0dGxlRGVwb3NpdC5cbmV4cG9ydCBpbnRlcmZhY2UgSVBsdW1TZXR0bGVEZXBvc2l0IHtcbiAgLy8gUGx1bVNldHRsZURlcG9zaXQgY29pbklEXG4gIGNvaW5JRDogbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgUGx1bVRyYW5zZmVyLlxuZXhwb3J0IGludGVyZmFjZSBJUGx1bVRyYW5zZmVyIHtcbiAgLy8gUGx1bVRyYW5zZmVyIGNvaW5JRFxuICBjb2luSUQ6IG51bWJlcjtcblxuICAvLyBQbHVtVHJhbnNmZXIgZGVub21pbmF0aW9uXG4gIGRlbm9taW5hdGlvbjogQnVmZmVyO1xuXG4gIC8vIFBsdW1UcmFuc2ZlciBvd25lclxuICBvd25lcjogc3RyaW5nO1xuXG4gIC8vIFBsdW1UcmFuc2ZlciByZWNpcGllbnRcbiAgcmVjaXBpZW50OiBzdHJpbmc7XG59XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCRUxPVyBBUkUgREVGSU5JVElPTlMgRk9SIEJMT0NLIFBST0RVQ0VSIFBST1RPQ09MXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgRGVwb3NpdFRvUmV3YXJkaW5nRnVuZC5cbmV4cG9ydCBpbnRlcmZhY2UgSURlcG9zaXRUb1Jld2FyZGluZ0Z1bmQge1xuICAvLyBEZXBvc2l0VG9SZXdhcmRpbmdGdW5kIGFtb3VudFxuICBhbW91bnQ6IHN0cmluZztcblxuICAvLyBEZXBvc2l0VG9SZXdhcmRpbmdGdW5kIGRhdGFcbiAgZGF0YTogQnVmZmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZC5cbmV4cG9ydCBpbnRlcmZhY2UgSUNsYWltRnJvbVJld2FyZGluZ0Z1bmQge1xuICAvLyBDbGFpbUZyb21SZXdhcmRpbmdGdW5kIGFtb3VudFxuICBhbW91bnQ6IHN0cmluZztcblxuICAvLyBDbGFpbUZyb21SZXdhcmRpbmdGdW5kIGRhdGFcbiAgZGF0YTogQnVmZmVyIHwge307XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmV3YXJkVHlwZSB7XG4gIEJsb2NrUmV3YXJkOiAwO1xuICBFcG9jaFJld2FyZDogMTtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFNldFJld2FyZC5cbmV4cG9ydCBpbnRlcmZhY2UgSVNldFJld2FyZCB7XG4gIC8vIFNldFJld2FyZCBhbW91bnRcbiAgYW1vdW50OiBzdHJpbmc7XG5cbiAgLy8gU2V0UmV3YXJkIGRhdGFcbiAgZGF0YTogQnVmZmVyIHwge307XG5cbiAgLy8gU2V0UmV3YXJkIHR5cGVcbiAgdHlwZTogbnVtYmVyO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR3JhbnRSZXdhcmQuXG5leHBvcnQgaW50ZXJmYWNlIElHcmFudFJld2FyZCB7XG4gIC8vIEdyYW50UmV3YXJkIHR5cGVcbiAgdHlwZTogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2FuZGlkYXRlIHtcbiAgYWRkcmVzczogc3RyaW5nO1xuICB2b3RlczogQnVmZmVyIHwge307XG4gIHB1YktleTogQnVmZmVyIHwge307XG4gIHJld2FyZEFkZHJlc3M6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2FuZGlkYXRlTGlzdCB7XG4gIGNhbmRpZGF0ZXM6IEFycmF5PElDYW5kaWRhdGU+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQdXRQb2xsUmVzdWx0IHtcbiAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gIGNhbmRpZGF0ZXM6IElDYW5kaWRhdGVMaXN0IHwgdW5kZWZpbmVkO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGFuIEFjdGlvbkNvcmUuXG5leHBvcnQgaW50ZXJmYWNlIElBY3Rpb25Db3JlIHtcbiAgLy8gQWN0aW9uQ29yZSB2ZXJzaW9uXG4gIHZlcnNpb246IG51bWJlcjtcblxuICAvLyBBY3Rpb25Db3JlIG5vbmNlXG4gIG5vbmNlOiBzdHJpbmc7XG5cbiAgLy8gQWN0aW9uQ29yZSBnYXNMaW1pdFxuICBnYXNMaW1pdDogc3RyaW5nO1xuXG4gIC8vIEFjdGlvbkNvcmUgZ2FzUHJpY2VcbiAgZ2FzUHJpY2U6IHN0cmluZztcblxuICAvLyBBY3Rpb24gZGV0YWlsIGZpZWxkc1xuICAvLyBBY3Rpb25Db3JlIHRyYW5zZmVyXG4gIHRyYW5zZmVyPzogSVRyYW5zZmVyIHwgdW5kZWZpbmVkO1xuICAvLyBBY3Rpb25Db3JlIGV4ZWN1dGlvblxuICBleGVjdXRpb24/OiBJRXhlY3V0aW9uIHwgdW5kZWZpbmVkO1xuXG4gIC8vIEZlZENoYWluXG4gIC8vIEFjdGlvbkNvcmUgc3RhcnRTdWJDaGFpblxuICBzdGFydFN1YkNoYWluPzogSVN0YXJ0U3ViQ2hhaW4gfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgc3RvcFN1YkNoYWluXG4gIHN0b3BTdWJDaGFpbj86IElTdG9wU3ViQ2hhaW4gfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcHV0QmxvY2tcbiAgcHV0QmxvY2s/OiBJUHV0QmxvY2sgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgY3JlYXRlRGVwb3NpdFxuICBjcmVhdGVEZXBvc2l0PzogSUNyZWF0ZURlcG9zaXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgc2V0dGxlRGVwb3NpdFxuICBzZXR0bGVEZXBvc2l0PzogSVNldHRsZURlcG9zaXQgfCB1bmRlZmluZWQ7XG5cbiAgLy8gUGx1bUNoYWluXG4gIC8vIEFjdGlvbkNvcmUgY3JlYXRlUGx1bUNoYWluXG4gIGNyZWF0ZVBsdW1DaGFpbj86IElDcmVhdGVQbHVtQ2hhaW4gfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgdGVybWluYXRlUGx1bUNoYWluXG4gIHRlcm1pbmF0ZVBsdW1DaGFpbj86IElUZXJtaW5hdGVQbHVtQ2hhaW4gfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bVB1dEJsb2NrXG4gIHBsdW1QdXRCbG9jaz86IElQbHVtUHV0QmxvY2sgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bUNyZWF0ZURlcG9zaXRcbiAgcGx1bUNyZWF0ZURlcG9zaXQ/OiBJUGx1bUNyZWF0ZURlcG9zaXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bVN0YXJ0RXhpdFxuICBwbHVtU3RhcnRFeGl0PzogSVBsdW1TdGFydEV4aXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bUNoYWxsZW5nZUV4aXRcbiAgcGx1bUNoYWxsZW5nZUV4aXQ/OiBJUGx1bUNoYWxsZW5nZUV4aXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdFxuICBwbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0PzogSVBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bUZpbmFsaXplRXhpdFxuICBwbHVtRmluYWxpemVFeGl0PzogSVBsdW1GaW5hbGl6ZUV4aXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bVNldHRsZURlcG9zaXRcbiAgcGx1bVNldHRsZURlcG9zaXQ/OiBJUGx1bVNldHRsZURlcG9zaXQgfCB1bmRlZmluZWQ7XG4gIC8vIEFjdGlvbkNvcmUgcGx1bVRyYW5zZmVyXG4gIHBsdW1UcmFuc2Zlcj86IElQbHVtVHJhbnNmZXIgfCB1bmRlZmluZWQ7XG5cbiAgLy8gUmV3YXJkaW5nIHByb3RvY29sIGFjdGlvbnNcbiAgLy8gQWN0aW9uQ29yZSBkZXBvc2l0VG9SZXdhcmRpbmdGdW5kXG4gIGRlcG9zaXRUb1Jld2FyZGluZ0Z1bmQ/OiBJRGVwb3NpdFRvUmV3YXJkaW5nRnVuZCB8IHVuZGVmaW5lZDtcbiAgLy8gQWN0aW9uQ29yZSBjbGFpbUZyb21SZXdhcmRpbmdGdW5kXG4gIGNsYWltRnJvbVJld2FyZGluZ0Z1bmQ/OiBJQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZCB8IHVuZGVmaW5lZDtcbiAgLy8gQWN0aW9uQ29yZSBncmFudFJld2FyZFxuICBncmFudFJld2FyZD86IElHcmFudFJld2FyZCB8IHVuZGVmaW5lZDtcblxuICAvLyBOYXRpdmUgc3Rha2luZ1xuICBzdGFrZUNyZWF0ZT86IElTdGFrZUNyZWF0ZSB8IHVuZGVmaW5lZDtcbiAgc3Rha2VVbnN0YWtlPzogSVN0YWtlUmVjbGFpbSB8IHVuZGVmaW5lZDtcbiAgc3Rha2VXaXRoZHJhdz86IElTdGFrZVJlY2xhaW0gfCB1bmRlZmluZWQ7XG4gIHN0YWtlQWRkRGVwb3NpdD86IElTdGFrZUFkZERlcG9zaXQgfCB1bmRlZmluZWQ7XG4gIHN0YWtlUmVzdGFrZT86IElTdGFrZVJlc3Rha2UgfCB1bmRlZmluZWQ7XG4gIHN0YWtlQ2hhbmdlQ2FuZGlkYXRlPzogSVN0YWtlQ2hhbmdlQ2FuZGlkYXRlIHwgdW5kZWZpbmVkO1xuICBzdGFrZVRyYW5zZmVyT3duZXJzaGlwPzogSVN0YWtlVHJhbnNmZXJPd25lcnNoaXAgfCB1bmRlZmluZWQ7XG4gIGNhbmRpZGF0ZVJlZ2lzdGVyPzogSUNhbmRpZGF0ZVJlZ2lzdGVyIHwgdW5kZWZpbmVkO1xuICBjYW5kaWRhdGVVcGRhdGU/OiBJQ2FuZGlkYXRlQmFzaWNJbmZvIHwgdW5kZWZpbmVkO1xuXG4gIHB1dFBvbGxSZXN1bHQ/OiBJUHV0UG9sbFJlc3VsdCB8IHVuZGVmaW5lZDtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhbiBBY3Rpb24uXG5leHBvcnQgaW50ZXJmYWNlIElBY3Rpb24ge1xuICAvLyBBY3Rpb24gY29yZVxuICBjb3JlOiBJQWN0aW9uQ29yZSB8IHVuZGVmaW5lZDtcblxuICAvLyBBY3Rpb24gc2VuZGVyUHVia2V5XG4gIHNlbmRlclB1YktleTogVWludDhBcnJheSB8IHN0cmluZztcblxuICAvLyBBY3Rpb24gc2lnbmF0dXJlXG4gIHNpZ25hdHVyZTogVWludDhBcnJheSB8IHN0cmluZztcbn1cblxuLy8gcmVhZCBzdGF0ZVxuZXhwb3J0IGludGVyZmFjZSBJUGFnaW5hdGlvblBhcmFtIHtcbiAgb2Zmc2V0OiBudW1iZXI7XG4gIGxpbWl0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBlbnVtIElSZWFkU3Rha2luZ0RhdGFNZXRob2ROYW1lIHtcbiAgSU5WQUxJRCA9IDAsXG4gIEJVQ0tFVFMgPSAxLFxuICBCVUNLRVRTX0JZX1ZPVEVSID0gMixcbiAgQlVDS0VUU19CWV9DQU5ESURBVEUgPSAzLFxuICBDQU5ESURBVEVTID0gNCxcbiAgQ0FORElEQVRFX0JZX05BTUUgPSA1LFxuICBCVUNLRVRTX0JZX0lOREVYRVMgPSA2LFxuICBDQU5ESURBVEVfQllfQUREUkVTUyA9IDcsXG4gIFRPVEFMX1NUQUtJTkdfQU1PVU5UID0gOCxcbiAgQlVDS0VUU19DT1VOVCA9IDlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YWtpbmdEYXRhTWV0aG9kIHtcbiAgbWV0aG9kOiBJUmVhZFN0YWtpbmdEYXRhTWV0aG9kTmFtZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdFZvdGVCdWNrZXRzIHtcbiAgcGFnaW5hdGlvbjogSVBhZ2luYXRpb25QYXJhbTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdFZvdGVCdWNrZXRzQnlWb3RlciB7XG4gIHZvdGVyQWRkcmVzczogc3RyaW5nO1xuICBwYWdpbmF0aW9uOiBJUGFnaW5hdGlvblBhcmFtO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0Vm90ZUJ1Y2tldHNCeUNhbmRpZGF0ZSB7XG4gIGNhbmROYW1lOiBzdHJpbmc7XG4gIHBhZ2luYXRpb246IElQYWdpbmF0aW9uUGFyYW07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlYWRTdGFraW5nRGF0YVJlcXVlc3RDYW5kaWRhdGVzIHtcbiAgY2FuZE5hbWU6IHN0cmluZztcbiAgcGFnaW5hdGlvbjogSVBhZ2luYXRpb25QYXJhbTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdENhbmRpZGF0ZUJ5TmFtZSB7XG4gIGNhbmROYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlYWRTdGFraW5nRGF0YVJlcXVlc3RDYW5kaWRhdGVCeUFkZHJlc3Mge1xuICBvd25lckFkZHI6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdFZvdGVCdWNrZXRzQnlJbmRleGVzIHtcbiAgaW5kZXg6IEFycmF5PG51bWJlcj47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlYWRTdGFraW5nRGF0YVJlcXVlc3RUb3RhbFN0YWtpbmdBbW91bnQge31cblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdEJ1Y2tldHNDb3VudCB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0IHtcbiAgYnVja2V0cz86IElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0Vm90ZUJ1Y2tldHM7XG4gIGJ1Y2tldHNCeVZvdGVyPzogSVJlYWRTdGFraW5nRGF0YVJlcXVlc3RWb3RlQnVja2V0c0J5Vm90ZXI7XG4gIGJ1Y2tldHNCeUNhbmRpZGF0ZT86IElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0Vm90ZUJ1Y2tldHNCeUNhbmRpZGF0ZTtcbiAgYnVja2V0c0J5SW5kZXhlcz86IElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0Vm90ZUJ1Y2tldHNCeUluZGV4ZXM7XG4gIGNhbmRpZGF0ZXM/OiBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdENhbmRpZGF0ZXM7XG4gIGNhbmRpZGF0ZUJ5TmFtZT86IElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0Q2FuZGlkYXRlQnlOYW1lO1xuICBjYW5kaWRhdGVCeUFkZHJlc3M/OiBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdENhbmRpZGF0ZUJ5QWRkcmVzcztcbiAgdG90YWxTdGFraW5nQW1vdW50PzogSVJlYWRTdGFraW5nRGF0YVJlcXVlc3RUb3RhbFN0YWtpbmdBbW91bnQ7XG4gIGJ1Y2tldHNDb3VudD86IElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0QnVja2V0c0NvdW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25UcmFuc2ZlcihyZXE6IElUcmFuc2ZlciB8IHVuZGVmaW5lZCk6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlRyYW5zZmVyID0gbmV3IGFjdGlvblBiLlRyYW5zZmVyKCk7XG4gIHBiVHJhbnNmZXIuc2V0QW1vdW50KHJlcS5hbW91bnQpO1xuICBwYlRyYW5zZmVyLnNldFJlY2lwaWVudChyZXEucmVjaXBpZW50KTtcbiAgcGJUcmFuc2Zlci5zZXRQYXlsb2FkKHJlcS5wYXlsb2FkKTtcbiAgcmV0dXJuIHBiVHJhbnNmZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RpbWVzdGFtcCh0aW1lc3RhbXA6IElUaW1lc3RhbXApOiBUaW1lc3RhbXAge1xuICBjb25zdCB0cyA9IG5ldyBUaW1lc3RhbXAoKTtcbiAgaWYgKHRpbWVzdGFtcCkge1xuICAgIHRzLnNldFNlY29uZHModGltZXN0YW1wLnNlY29uZHMpO1xuICAgIHRzLnNldE5hbm9zKHRpbWVzdGFtcC5uYW5vcyk7XG4gIH1cbiAgcmV0dXJuIHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25FeGVjdXRpb24oXG4gIHJlcTogSUV4ZWN1dGlvbiB8IHVuZGVmaW5lZFxuKTogYWN0aW9uUGIuRXhlY3V0aW9uIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFyZXEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHBiRXhlY3V0aW9uID0gbmV3IGFjdGlvblBiLkV4ZWN1dGlvbigpO1xuICBwYkV4ZWN1dGlvbi5zZXRBbW91bnQocmVxLmFtb3VudCk7XG4gIHBiRXhlY3V0aW9uLnNldENvbnRyYWN0KHJlcS5jb250cmFjdCk7XG4gIHBiRXhlY3V0aW9uLnNldERhdGEocmVxLmRhdGEpO1xuICByZXR1cm4gcGJFeGVjdXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblN0YXJ0U3ViQ2hhaW4ocmVxOiBJU3RhcnRTdWJDaGFpbiB8IHVuZGVmaW5lZCk6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBiU3RhcnRTdWJDaGFpbiA9IG5ldyBhY3Rpb25QYi5TdGFydFN1YkNoYWluKCk7XG4gIHBiU3RhcnRTdWJDaGFpbi5zZXRDaGFpbmlkKHJlcS5jaGFpbklEKTtcbiAgcGJTdGFydFN1YkNoYWluLnNldFNlY3VyaXR5ZGVwb3NpdChyZXEuc2VjdXJpdHlEZXBvc2l0KTtcbiAgcGJTdGFydFN1YkNoYWluLnNldE9wZXJhdGlvbmRlcG9zaXQocmVxLm9wZXJhdGlvbkRlcG9zaXQpO1xuICBwYlN0YXJ0U3ViQ2hhaW4uc2V0U3RhcnRoZWlnaHQocmVxLnN0YXJ0SGVpZ2h0KTtcbiAgcGJTdGFydFN1YkNoYWluLnNldFBhcmVudGhlaWdodG9mZnNldChyZXEucGFyZW50SGVpZ2h0T2Zmc2V0KTtcbiAgcmV0dXJuIHBiU3RhcnRTdWJDaGFpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uU3RvcFN1YkNoYWluKHJlcTogSVN0b3BTdWJDaGFpbiB8IHVuZGVmaW5lZCk6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlN0b3BTdWJDaGFpbiA9IG5ldyBhY3Rpb25QYi5TdG9wU3ViQ2hhaW4oKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYlN0b3BTdWJDaGFpbi5zZXRDaGFpbmlkKHJlcS5jaGFpbklEKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYlN0b3BTdWJDaGFpbi5zZXRTdG9waGVpZ2h0KHJlcS5zdG9wSGVpZ2h0KTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYlN0b3BTdWJDaGFpbi5zZXRTdWJjaGFpbmFkZHJlc3MocmVxLnN1YkNoYWluQWRkcmVzcyk7XG4gIHJldHVybiBwYlN0b3BTdWJDaGFpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uUHV0QmxvY2socmVxOiBJUHV0QmxvY2sgfCB1bmRlZmluZWQpOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3Qgcm9vdHMgPSByZXEucm9vdHM7XG4gIGNvbnN0IHJvb3RMaXN0ID0gW107XG4gIGlmIChyZXEucm9vdHMgJiYgcm9vdHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcS5yb290cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgcm9vdEl0ZW0gPSByZXEucm9vdHMgJiYgcmVxLnJvb3RzW2ldO1xuICAgICAgY29uc3QgbWtyb290ID0gbmV3IGFjdGlvblBiLk1lcmtsZVJvb3QoKTtcbiAgICAgIG1rcm9vdC5zZXROYW1lKHJvb3RJdGVtLm5hbWUpO1xuICAgICAgbWtyb290LnNldFZhbHVlKHJvb3RJdGVtLnZhbHVlKTtcbiAgICAgIHJvb3RMaXN0W2ldID0gbWtyb290O1xuICAgIH1cbiAgfVxuICBjb25zdCBwYlB1dEJsb2NrID0gbmV3IGFjdGlvblBiLlB1dEJsb2NrKCk7XG4gIHBiUHV0QmxvY2suc2V0U3ViY2hhaW5hZGRyZXNzKHJlcS5zdWJDaGFpbkFkZHJlc3MpO1xuICBwYlB1dEJsb2NrLnNldEhlaWdodChyZXEuaGVpZ2h0KTtcbiAgcGJQdXRCbG9jay5zZXRSb290c0xpc3Qocm9vdExpc3QpO1xuICByZXR1cm4gcGJQdXRCbG9jaztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uQ3JlYXRlRGVwb3NpdChyZXE6IElDcmVhdGVEZXBvc2l0IHwgdW5kZWZpbmVkKTogYW55IHtcbiAgaWYgKCFyZXEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHBiQ3JlYXRlRGVwb3NpdCA9IG5ldyBhY3Rpb25QYi5DcmVhdGVEZXBvc2l0KCk7XG4gIHBiQ3JlYXRlRGVwb3NpdC5zZXRDaGFpbmlkKHJlcS5jaGFpbklEKTtcbiAgcGJDcmVhdGVEZXBvc2l0LnNldEFtb3VudChyZXEuYW1vdW50KTtcbiAgcGJDcmVhdGVEZXBvc2l0LnNldFJlY2lwaWVudChyZXEucmVjaXBpZW50KTtcbiAgcmV0dXJuIHBiQ3JlYXRlRGVwb3NpdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uU2V0dGxlRGVwb3NpdChyZXE6IElTZXR0bGVEZXBvc2l0IHwgdW5kZWZpbmVkKTogYW55IHtcbiAgaWYgKCFyZXEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHBiU2V0dGxlRGVwb3NpdCA9IG5ldyBhY3Rpb25QYi5TZXR0bGVEZXBvc2l0KCk7XG4gIHBiU2V0dGxlRGVwb3NpdC5zZXRBbW91bnQocmVxLmFtb3VudCk7XG4gIHBiU2V0dGxlRGVwb3NpdC5zZXRSZWNpcGllbnQocmVxLnJlY2lwaWVudCk7XG4gIHBiU2V0dGxlRGVwb3NpdC5zZXRJbmRleChyZXEuaW5kZXgpO1xuICByZXR1cm4gcGJTZXR0bGVEZXBvc2l0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25DcmVhdGVQbHVtQ2hhaW4oXG4gIHJlcTogSUNyZWF0ZVBsdW1DaGFpbiB8IHVuZGVmaW5lZFxuKTogYW55IHtcbiAgaWYgKCFyZXEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBuZXcgYWN0aW9uUGIuQ3JlYXRlUGx1bUNoYWluKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblRlcm1pbmF0ZVBsdW1DaGFpbihcbiAgcmVxOiBJVGVybWluYXRlUGx1bUNoYWluIHwgdW5kZWZpbmVkXG4pOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJUZXJtaW5hdGVQbHVtQ2hhaW4gPSBuZXcgYWN0aW9uUGIuVGVybWluYXRlUGx1bUNoYWluKCk7XG4gIHBiVGVybWluYXRlUGx1bUNoYWluLnNldFN1YmNoYWluYWRkcmVzcyhyZXEuc3ViQ2hhaW5BZGRyZXNzKTtcbiAgcmV0dXJuIHBiVGVybWluYXRlUGx1bUNoYWluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25QbHVtUHV0QmxvY2socmVxOiBJUGx1bVB1dEJsb2NrIHwgdW5kZWZpbmVkKTogYW55IHtcbiAgaWYgKCFyZXEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHBiUGx1bVB1dEJsb2NrID0gbmV3IGFjdGlvblBiLlBsdW1QdXRCbG9jaygpO1xuICBwYlBsdW1QdXRCbG9jay5zZXRTdWJjaGFpbmFkZHJlc3MocmVxLnN1YkNoYWluQWRkcmVzcyk7XG4gIHBiUGx1bVB1dEJsb2NrLnNldEhlaWdodChyZXEuaGVpZ2h0KTtcbiAgcmV0dXJuIHBiUGx1bVB1dEJsb2NrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25QbHVtQ3JlYXRlRGVwb3NpdChcbiAgcmVxOiBJUGx1bUNyZWF0ZURlcG9zaXQgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBiUGx1bUNyZWF0ZURlcG9zaXQgPSBuZXcgYWN0aW9uUGIuUGx1bUNyZWF0ZURlcG9zaXQoKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYlBsdW1DcmVhdGVEZXBvc2l0LnNldFN1YmNoYWluYWRkcmVzcyhyZXEuc3ViQ2hhaW5BZGRyZXNzKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYlBsdW1DcmVhdGVEZXBvc2l0LnNldEFtb3VudChyZXEuYW1vdW50KTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYlBsdW1DcmVhdGVEZXBvc2l0LnNldFJlY2lwaWVudChyZXEucmVjaXBpZW50KTtcbiAgcmV0dXJuIHBiUGx1bUNyZWF0ZURlcG9zaXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblBsdW1TdGFydEV4aXQocmVxOiBJUGx1bVN0YXJ0RXhpdCB8IHVuZGVmaW5lZCk6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBiUGx1bVN0YXJ0RXhpdCA9IG5ldyBhY3Rpb25QYi5QbHVtU3RhcnRFeGl0KCk7XG4gIHBiUGx1bVN0YXJ0RXhpdC5zZXRTdWJjaGFpbmFkZHJlc3MocmVxLnN1YkNoYWluQWRkcmVzcyk7XG4gIHBiUGx1bVN0YXJ0RXhpdC5zZXRQcmV2aW91c3RyYW5zZmVyKHJlcS5wcmV2aW91c1RyYW5zZmVyKTtcbiAgcGJQbHVtU3RhcnRFeGl0LnNldFByZXZpb3VzdHJhbnNmZXJibG9ja3Byb29mKHJlcS5wcmV2aW91c1RyYW5zZmVyQmxvY2tQcm9vZik7XG4gIHBiUGx1bVN0YXJ0RXhpdC5zZXRQcmV2aW91c3RyYW5zZmVyYmxvY2toZWlnaHQoXG4gICAgcmVxLnByZXZpb3VzVHJhbnNmZXJCbG9ja0hlaWdodFxuICApO1xuICBwYlBsdW1TdGFydEV4aXQuc2V0RXhpdHRyYW5zZmVyKHJlcS5leGl0VHJhbnNmZXIpO1xuICBwYlBsdW1TdGFydEV4aXQuc2V0RXhpdHRyYW5zZmVyYmxvY2twcm9vZihyZXEuZXhpdFRyYW5zZmVyQmxvY2tQcm9vZik7XG4gIHBiUGx1bVN0YXJ0RXhpdC5zZXRFeGl0dHJhbnNmZXJibG9ja2hlaWdodChyZXEuZXhpdFRyYW5zZmVyQmxvY2tIZWlnaHQpO1xuICByZXR1cm4gcGJQbHVtU3RhcnRFeGl0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25QbHVtQ2hhbGxlbmdlRXhpdChcbiAgcmVxOiBJUGx1bUNoYWxsZW5nZUV4aXQgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBiUGx1bUNoYWxsZW5nZUV4aXQgPSBuZXcgYWN0aW9uUGIuUGx1bUNoYWxsZW5nZUV4aXQoKTtcbiAgcGJQbHVtQ2hhbGxlbmdlRXhpdC5zZXRTdWJjaGFpbmFkZHJlc3MocmVxLnN1YkNoYWluQWRkcmVzcyk7XG4gIHBiUGx1bUNoYWxsZW5nZUV4aXQuc2V0Q29pbmlkKHJlcS5jb2luSUQpO1xuICBwYlBsdW1DaGFsbGVuZ2VFeGl0LnNldENoYWxsZW5nZXRyYW5zZmVyKHJlcS5jaGFsbGVuZ2VUcmFuc2Zlcik7XG4gIHBiUGx1bUNoYWxsZW5nZUV4aXQuc2V0Q2hhbGxlbmdldHJhbnNmZXJibG9ja3Byb29mKFxuICAgIHJlcS5jaGFsbGVuZ2VUcmFuc2ZlckJsb2NrUHJvb2ZcbiAgKTtcbiAgcGJQbHVtQ2hhbGxlbmdlRXhpdC5zZXRDaGFsbGVuZ2V0cmFuc2ZlcmJsb2NraGVpZ2h0KFxuICAgIHJlcS5jaGFsbGVuZ2VUcmFuc2ZlckJsb2NrSGVpZ2h0XG4gICk7XG4gIHJldHVybiBwYlBsdW1DaGFsbGVuZ2VFeGl0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25QbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0KFxuICByZXE6IElQbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0IHwgdW5kZWZpbmVkXG4pOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBwYlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQgPSBuZXcgYWN0aW9uUGIuUGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdCgpO1xuICBwYlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQuc2V0U3ViY2hhaW5hZGRyZXNzKHJlcS5zdWJDaGFpbkFkZHJlc3MpO1xuICBwYlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQuc2V0Q29pbmlkKHJlcS5jb2luSUQpO1xuICBwYlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQuc2V0Q2hhbGxlbmdldHJhbnNmZXIocmVxLmNoYWxsZW5nZVRyYW5zZmVyKTtcbiAgcGJQbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0LnNldFJlc3BvbnNldHJhbnNmZXIocmVxLnJlc3BvbnNlVHJhbnNmZXIpO1xuICBwYlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQuc2V0UmVzcG9uc2V0cmFuc2ZlcmJsb2NrcHJvb2YoXG4gICAgcmVxLnJlc3BvbnNlVHJhbnNmZXJCbG9ja1Byb29mXG4gICk7XG4gIHJldHVybiBwYlBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblBsdW1GaW5hbGl6ZUV4aXQoXG4gIHJlcTogSVBsdW1GaW5hbGl6ZUV4aXQgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlBsdW1GaW5hbGl6ZUV4aXQgPSBuZXcgYWN0aW9uUGIuUGx1bUZpbmFsaXplRXhpdCgpO1xuICBwYlBsdW1GaW5hbGl6ZUV4aXQuc2V0U3ViY2hhaW5hZGRyZXNzKHJlcS5zdWJDaGFpbkFkZHJlc3MpO1xuICBwYlBsdW1GaW5hbGl6ZUV4aXQuc2V0Q29pbmlkKHJlcS5jb2luSUQpO1xuICByZXR1cm4gcGJQbHVtRmluYWxpemVFeGl0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25QbHVtU2V0dGxlRGVwb3NpdChcbiAgcmVxOiBJUGx1bVNldHRsZURlcG9zaXQgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlBsdW1TZXR0bGVEZXBvc2l0ID0gbmV3IGFjdGlvblBiLlBsdW1TZXR0bGVEZXBvc2l0KCk7XG4gIHBiUGx1bVNldHRsZURlcG9zaXQuc2V0Q29pbmlkKHJlcS5jb2luSUQpO1xuICByZXR1cm4gcGJQbHVtU2V0dGxlRGVwb3NpdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uUGx1bVRyYW5zZmVyKHJlcTogSVBsdW1UcmFuc2ZlciB8IHVuZGVmaW5lZCk6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlBsdW1UcmFuc2ZlciA9IG5ldyBhY3Rpb25QYi5QbHVtVHJhbnNmZXIoKTtcbiAgcGJQbHVtVHJhbnNmZXIuc2V0Q29pbmlkKHJlcS5jb2luSUQpO1xuICBwYlBsdW1UcmFuc2Zlci5zZXREZW5vbWluYXRpb24ocmVxLmRlbm9taW5hdGlvbik7XG4gIHBiUGx1bVRyYW5zZmVyLnNldE93bmVyKHJlcS5vd25lcik7XG4gIHBiUGx1bVRyYW5zZmVyLnNldFJlY2lwaWVudChyZXEucmVjaXBpZW50KTtcbiAgcmV0dXJuIHBiUGx1bVRyYW5zZmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25EZXBvc2l0VG9SZXdhcmRpbmdGdW5kKFxuICByZXE6IElEZXBvc2l0VG9SZXdhcmRpbmdGdW5kIHwgdW5kZWZpbmVkXG4pOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJEZXBvc2l0VG9SZXdhcmRpbmdGdW5kID0gbmV3IGFjdGlvblBiLkRlcG9zaXRUb1Jld2FyZGluZ0Z1bmQoKTtcbiAgcGJEZXBvc2l0VG9SZXdhcmRpbmdGdW5kLnNldEFtb3VudChyZXEuYW1vdW50KTtcbiAgcGJEZXBvc2l0VG9SZXdhcmRpbmdGdW5kLnNldERhdGEocmVxLmRhdGEpO1xuICByZXR1cm4gcGJEZXBvc2l0VG9SZXdhcmRpbmdGdW5kO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25DbGFpbUZyb21SZXdhcmRpbmdGdW5kKFxuICByZXE6IElDbGFpbUZyb21SZXdhcmRpbmdGdW5kIHwgdW5kZWZpbmVkXG4pOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJDbGFpbUZyb21SZXdhcmRpbmdGdW5kID0gbmV3IGFjdGlvblBiLkNsYWltRnJvbVJld2FyZGluZ0Z1bmQoKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwYkNsYWltRnJvbVJld2FyZGluZ0Z1bmQuc2V0QW1vdW50KHJlcS5hbW91bnQpO1xuICAvLyBAdHMtaWdub3JlXG4gIHBiQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZC5zZXREYXRhKHJlcS5kYXRhKTtcbiAgcmV0dXJuIHBiQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uR3JhbnRSZXdhcmQocmVxOiBJR3JhbnRSZXdhcmQgfCB1bmRlZmluZWQpOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJHcmFudFJld2FyZCA9IG5ldyBhY3Rpb25QYi5HcmFudFJld2FyZCgpO1xuICBwYkdyYW50UmV3YXJkLnNldFR5cGUocmVxLnR5cGUpO1xuICByZXR1cm4gcGJHcmFudFJld2FyZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uU3Rha2VDcmVhdGUocmVxOiBJU3Rha2VDcmVhdGUgfCB1bmRlZmluZWQpOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJTdGFrZUNyZWF0ZSA9IG5ldyBhY3Rpb25QYi5TdGFrZUNyZWF0ZSgpO1xuICBwYlN0YWtlQ3JlYXRlLnNldENhbmRpZGF0ZW5hbWUocmVxLmNhbmRpZGF0ZU5hbWUpO1xuICBwYlN0YWtlQ3JlYXRlLnNldFN0YWtlZGFtb3VudChyZXEuc3Rha2VkQW1vdW50KTtcbiAgcGJTdGFrZUNyZWF0ZS5zZXRTdGFrZWRkdXJhdGlvbihyZXEuc3Rha2VkRHVyYXRpb24pO1xuICBwYlN0YWtlQ3JlYXRlLnNldEF1dG9zdGFrZShyZXEuYXV0b1N0YWtlKTtcbiAgcGJTdGFrZUNyZWF0ZS5zZXRQYXlsb2FkKHJlcS5wYXlsb2FkKTtcbiAgcmV0dXJuIHBiU3Rha2VDcmVhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblN0YWtlUmVjbGFpbShyZXE6IElTdGFrZVJlY2xhaW0gfCB1bmRlZmluZWQpOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJTdGFrZVJlY2xhaW0gPSBuZXcgYWN0aW9uUGIuU3Rha2VSZWNsYWltKCk7XG4gIHBiU3Rha2VSZWNsYWltLnNldEJ1Y2tldGluZGV4KHJlcS5idWNrZXRJbmRleCk7XG4gIHBiU3Rha2VSZWNsYWltLnNldFBheWxvYWQocmVxLnBheWxvYWQpO1xuICByZXR1cm4gcGJTdGFrZVJlY2xhaW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblN0YWtlQWRkRGVwb3NpdChcbiAgcmVxOiBJU3Rha2VBZGREZXBvc2l0IHwgdW5kZWZpbmVkXG4pOiBhbnkge1xuICBpZiAoIXJlcSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgcGJTdGFrZUFkZERlcG9zaXQgPSBuZXcgYWN0aW9uUGIuU3Rha2VBZGREZXBvc2l0KCk7XG4gIHBiU3Rha2VBZGREZXBvc2l0LnNldEJ1Y2tldGluZGV4KHJlcS5idWNrZXRJbmRleCk7XG4gIHBiU3Rha2VBZGREZXBvc2l0LnNldEFtb3VudChyZXEuYW1vdW50KTtcbiAgcGJTdGFrZUFkZERlcG9zaXQuc2V0UGF5bG9hZChyZXEucGF5bG9hZCk7XG4gIHJldHVybiBwYlN0YWtlQWRkRGVwb3NpdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQWN0aW9uU3Rha2VSZXN0YWtlKHJlcTogSVN0YWtlUmVzdGFrZSB8IHVuZGVmaW5lZCk6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlN0YWtlUmVzdGFrZSA9IG5ldyBhY3Rpb25QYi5TdGFrZVJlc3Rha2UoKTtcbiAgcGJTdGFrZVJlc3Rha2Uuc2V0QnVja2V0aW5kZXgocmVxLmJ1Y2tldEluZGV4KTtcbiAgcGJTdGFrZVJlc3Rha2Uuc2V0U3Rha2VkZHVyYXRpb24ocmVxLnN0YWtlZER1cmF0aW9uKTtcbiAgcGJTdGFrZVJlc3Rha2Uuc2V0QXV0b3N0YWtlKHJlcS5hdXRvU3Rha2UpO1xuICBwYlN0YWtlUmVzdGFrZS5zZXRQYXlsb2FkKHJlcS5wYXlsb2FkKTtcbiAgcmV0dXJuIHBiU3Rha2VSZXN0YWtlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25TdGFrZUNoYW5nZUNhbmRpZGF0ZShcbiAgcmVxOiBJU3Rha2VDaGFuZ2VDYW5kaWRhdGUgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlN0YWtlQ2hhbmdlQ2FuZGlkYXRlID0gbmV3IGFjdGlvblBiLlN0YWtlQ2hhbmdlQ2FuZGlkYXRlKCk7XG4gIHBiU3Rha2VDaGFuZ2VDYW5kaWRhdGUuc2V0QnVja2V0aW5kZXgocmVxLmJ1Y2tldEluZGV4KTtcbiAgcGJTdGFrZUNoYW5nZUNhbmRpZGF0ZS5zZXRDYW5kaWRhdGVuYW1lKHJlcS5jYW5kaWRhdGVOYW1lKTtcbiAgcGJTdGFrZUNoYW5nZUNhbmRpZGF0ZS5zZXRQYXlsb2FkKHJlcS5wYXlsb2FkKTtcbiAgcmV0dXJuIHBiU3Rha2VDaGFuZ2VDYW5kaWRhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FjdGlvblN0YWtlVHJhbnNmZXJPd25lcnNoaXAoXG4gIHJlcTogSVN0YWtlVHJhbnNmZXJPd25lcnNoaXAgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYlN0YWtlVHJhbnNmZXJPd25lcnNoaXAgPSBuZXcgYWN0aW9uUGIuU3Rha2VUcmFuc2Zlck93bmVyc2hpcCgpO1xuICBwYlN0YWtlVHJhbnNmZXJPd25lcnNoaXAuc2V0QnVja2V0aW5kZXgocmVxLmJ1Y2tldEluZGV4KTtcbiAgcGJTdGFrZVRyYW5zZmVyT3duZXJzaGlwLnNldFZvdGVyYWRkcmVzcyhyZXEudm90ZXJBZGRyZXNzKTtcbiAgcGJTdGFrZVRyYW5zZmVyT3duZXJzaGlwLnNldFBheWxvYWQocmVxLnBheWxvYWQpO1xuICByZXR1cm4gcGJTdGFrZVRyYW5zZmVyT3duZXJzaGlwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25DYW5kaWRhdGVSZWdpc3RlcihcbiAgcmVxOiBJQ2FuZGlkYXRlUmVnaXN0ZXIgfCB1bmRlZmluZWRcbik6IGFueSB7XG4gIGlmICghcmVxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCBwYkNhbmRpZGF0ZVJlZ2lzdGVyID0gbmV3IGFjdGlvblBiLkNhbmRpZGF0ZVJlZ2lzdGVyKCk7XG4gIGNvbnN0IHBiQ2FuZGlkYXRlQmFzaWNJbmZvID0gbmV3IGFjdGlvblBiLkNhbmRpZGF0ZUJhc2ljSW5mbygpO1xuICBwYkNhbmRpZGF0ZUJhc2ljSW5mby5zZXROYW1lKHJlcS5jYW5kaWRhdGUubmFtZSk7XG4gIHBiQ2FuZGlkYXRlQmFzaWNJbmZvLnNldE9wZXJhdG9yYWRkcmVzcyhyZXEuY2FuZGlkYXRlLm9wZXJhdG9yQWRkcmVzcyk7XG4gIHBiQ2FuZGlkYXRlQmFzaWNJbmZvLnNldFJld2FyZGFkZHJlc3MocmVxLmNhbmRpZGF0ZS5yZXdhcmRBZGRyZXNzKTtcbiAgcGJDYW5kaWRhdGVSZWdpc3Rlci5zZXRDYW5kaWRhdGUocGJDYW5kaWRhdGVCYXNpY0luZm8pO1xuICBwYkNhbmRpZGF0ZVJlZ2lzdGVyLnNldFN0YWtlZGFtb3VudChyZXEuc3Rha2VkQW1vdW50KTtcbiAgcGJDYW5kaWRhdGVSZWdpc3Rlci5zZXRTdGFrZWRkdXJhdGlvbihyZXEuc3Rha2VkRHVyYXRpb24pO1xuICBwYkNhbmRpZGF0ZVJlZ2lzdGVyLnNldEF1dG9zdGFrZShyZXEuYXV0b1N0YWtlKTtcbiAgcGJDYW5kaWRhdGVSZWdpc3Rlci5zZXRPd25lcmFkZHJlc3MocmVxLm93bmVyQWRkcmVzcyk7XG4gIHBiQ2FuZGlkYXRlUmVnaXN0ZXIuc2V0UGF5bG9hZChyZXEucGF5bG9hZCk7XG4gIHJldHVybiBwYkNhbmRpZGF0ZVJlZ2lzdGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb25DYW5kaWRhdGVCYXNpY0luZm8oXG4gIHJlcTogSUNhbmRpZGF0ZUJhc2ljSW5mbyB8IHVuZGVmaW5lZFxuKTogYW55IHtcbiAgaWYgKCFyZXEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHBiQ2FuZGlkYXRlQmFzaWNJbmZvID0gbmV3IGFjdGlvblBiLkNhbmRpZGF0ZUJhc2ljSW5mbygpO1xuICBwYkNhbmRpZGF0ZUJhc2ljSW5mby5zZXROYW1lKHJlcS5uYW1lKTtcbiAgcGJDYW5kaWRhdGVCYXNpY0luZm8uc2V0T3BlcmF0b3JhZGRyZXNzKHJlcS5vcGVyYXRvckFkZHJlc3MpO1xuICBwYkNhbmRpZGF0ZUJhc2ljSW5mby5zZXRSZXdhcmRhZGRyZXNzKHJlcS5yZXdhcmRBZGRyZXNzKTtcbiAgcmV0dXJuIHBiQ2FuZGlkYXRlQmFzaWNJbmZvO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BY3Rpb24ocmVxOiBJQWN0aW9uKTogYW55IHtcbiAgY29uc3QgcGJBY3Rpb25Db3JlID0gbmV3IGFjdGlvblBiLkFjdGlvbkNvcmUoKTtcblxuICBjb25zdCBjb3JlID0gcmVxICYmIHJlcS5jb3JlO1xuICBpZiAoY29yZSkge1xuICAgIHBiQWN0aW9uQ29yZS5zZXRWZXJzaW9uKGNvcmUudmVyc2lvbik7XG4gICAgcGJBY3Rpb25Db3JlLnNldE5vbmNlKE51bWJlcihjb3JlLm5vbmNlKSk7XG4gICAgcGJBY3Rpb25Db3JlLnNldEdhc2xpbWl0KE51bWJlcihjb3JlLmdhc0xpbWl0KSk7XG4gICAgcGJBY3Rpb25Db3JlLnNldEdhc3ByaWNlKGNvcmUuZ2FzUHJpY2UpO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRUcmFuc2Zlcih0b0FjdGlvblRyYW5zZmVyKGNvcmUudHJhbnNmZXIpKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0RXhlY3V0aW9uKHRvQWN0aW9uRXhlY3V0aW9uKGNvcmUuZXhlY3V0aW9uKSk7XG4gICAgcGJBY3Rpb25Db3JlLnNldFN0YXJ0c3ViY2hhaW4odG9BY3Rpb25TdGFydFN1YkNoYWluKGNvcmUuc3RhcnRTdWJDaGFpbikpO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRTdG9wc3ViY2hhaW4odG9BY3Rpb25TdG9wU3ViQ2hhaW4oY29yZS5zdG9wU3ViQ2hhaW4pKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0UHV0YmxvY2sodG9BY3Rpb25QdXRCbG9jayhjb3JlLnB1dEJsb2NrKSk7XG4gICAgcGJBY3Rpb25Db3JlLnNldENyZWF0ZWRlcG9zaXQodG9BY3Rpb25DcmVhdGVEZXBvc2l0KGNvcmUuY3JlYXRlRGVwb3NpdCkpO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRTZXR0bGVkZXBvc2l0KHRvQWN0aW9uU2V0dGxlRGVwb3NpdChjb3JlLnNldHRsZURlcG9zaXQpKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0Q3JlYXRlcGx1bWNoYWluKFxuICAgICAgdG9BY3Rpb25DcmVhdGVQbHVtQ2hhaW4oY29yZS5jcmVhdGVQbHVtQ2hhaW4pXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0VGVybWluYXRlcGx1bWNoYWluKFxuICAgICAgdG9BY3Rpb25UZXJtaW5hdGVQbHVtQ2hhaW4oY29yZS50ZXJtaW5hdGVQbHVtQ2hhaW4pXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0UGx1bXB1dGJsb2NrKHRvQWN0aW9uUGx1bVB1dEJsb2NrKGNvcmUucGx1bVB1dEJsb2NrKSk7XG4gICAgcGJBY3Rpb25Db3JlLnNldFBsdW1jcmVhdGVkZXBvc2l0KFxuICAgICAgdG9BY3Rpb25QbHVtQ3JlYXRlRGVwb3NpdChjb3JlLnBsdW1DcmVhdGVEZXBvc2l0KVxuICAgICk7XG4gICAgcGJBY3Rpb25Db3JlLnNldFBsdW1zdGFydGV4aXQodG9BY3Rpb25QbHVtU3RhcnRFeGl0KGNvcmUucGx1bVN0YXJ0RXhpdCkpO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRQbHVtY2hhbGxlbmdlZXhpdChcbiAgICAgIHRvQWN0aW9uUGx1bUNoYWxsZW5nZUV4aXQoY29yZS5wbHVtQ2hhbGxlbmdlRXhpdClcbiAgICApO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRQbHVtcmVzcG9uc2VjaGFsbGVuZ2VleGl0KFxuICAgICAgdG9BY3Rpb25QbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0KGNvcmUucGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdClcbiAgICApO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRQbHVtZmluYWxpemVleGl0KFxuICAgICAgdG9BY3Rpb25QbHVtRmluYWxpemVFeGl0KGNvcmUucGx1bUZpbmFsaXplRXhpdClcbiAgICApO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRQbHVtc2V0dGxlZGVwb3NpdChcbiAgICAgIHRvQWN0aW9uUGx1bVNldHRsZURlcG9zaXQoY29yZS5wbHVtU2V0dGxlRGVwb3NpdClcbiAgICApO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRQbHVtdHJhbnNmZXIodG9BY3Rpb25QbHVtVHJhbnNmZXIoY29yZS5wbHVtVHJhbnNmZXIpKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0RGVwb3NpdHRvcmV3YXJkaW5nZnVuZChcbiAgICAgIHRvQWN0aW9uRGVwb3NpdFRvUmV3YXJkaW5nRnVuZChjb3JlLmRlcG9zaXRUb1Jld2FyZGluZ0Z1bmQpXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0Q2xhaW1mcm9tcmV3YXJkaW5nZnVuZChcbiAgICAgIHRvQWN0aW9uQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZChjb3JlLmNsYWltRnJvbVJld2FyZGluZ0Z1bmQpXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0R3JhbnRyZXdhcmQodG9BY3Rpb25HcmFudFJld2FyZChjb3JlLmdyYW50UmV3YXJkKSk7XG5cbiAgICBwYkFjdGlvbkNvcmUuc2V0U3Rha2VjcmVhdGUodG9BY3Rpb25TdGFrZUNyZWF0ZShjb3JlLnN0YWtlQ3JlYXRlKSk7XG4gICAgcGJBY3Rpb25Db3JlLnNldFN0YWtldW5zdGFrZSh0b0FjdGlvblN0YWtlUmVjbGFpbShjb3JlLnN0YWtlVW5zdGFrZSkpO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRTdGFrZXdpdGhkcmF3KHRvQWN0aW9uU3Rha2VSZWNsYWltKGNvcmUuc3Rha2VXaXRoZHJhdykpO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRTdGFrZWFkZGRlcG9zaXQoXG4gICAgICB0b0FjdGlvblN0YWtlQWRkRGVwb3NpdChjb3JlLnN0YWtlQWRkRGVwb3NpdClcbiAgICApO1xuICAgIHBiQWN0aW9uQ29yZS5zZXRTdGFrZXJlc3Rha2UodG9BY3Rpb25TdGFrZVJlc3Rha2UoY29yZS5zdGFrZVJlc3Rha2UpKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0U3Rha2VjaGFuZ2VjYW5kaWRhdGUoXG4gICAgICB0b0FjdGlvblN0YWtlQ2hhbmdlQ2FuZGlkYXRlKGNvcmUuc3Rha2VDaGFuZ2VDYW5kaWRhdGUpXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0U3Rha2V0cmFuc2Zlcm93bmVyc2hpcChcbiAgICAgIHRvQWN0aW9uU3Rha2VUcmFuc2Zlck93bmVyc2hpcChjb3JlLnN0YWtlVHJhbnNmZXJPd25lcnNoaXApXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0Q2FuZGlkYXRlcmVnaXN0ZXIoXG4gICAgICB0b0FjdGlvbkNhbmRpZGF0ZVJlZ2lzdGVyKGNvcmUuY2FuZGlkYXRlUmVnaXN0ZXIpXG4gICAgKTtcbiAgICBwYkFjdGlvbkNvcmUuc2V0Q2FuZGlkYXRldXBkYXRlKFxuICAgICAgdG9BY3Rpb25DYW5kaWRhdGVCYXNpY0luZm8oY29yZS5jYW5kaWRhdGVVcGRhdGUpXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IHBiQWN0aW9uID0gbmV3IGFjdGlvblBiLkFjdGlvbigpO1xuICBwYkFjdGlvbi5zZXRDb3JlKHBiQWN0aW9uQ29yZSk7XG5cbiAgaWYgKHJlcS5zZW5kZXJQdWJLZXkpIHtcbiAgICBwYkFjdGlvbi5zZXRTZW5kZXJwdWJrZXkocmVxLnNlbmRlclB1YktleSk7XG4gIH1cblxuICBpZiAocmVxLnNpZ25hdHVyZSkge1xuICAgIHBiQWN0aW9uLnNldFNpZ25hdHVyZShyZXEuc2lnbmF0dXJlKTtcbiAgfVxuXG4gIHJldHVybiBwYkFjdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uSW5mbyB7XG4gIGFjdGlvbjogSUFjdGlvbjtcbiAgYWN0SGFzaDogc3RyaW5nO1xuICBibGtIYXNoOiBzdHJpbmc7XG4gIHRpbWVzdGFtcDogSVRpbWVzdGFtcDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJR2V0QWN0aW9uc1Jlc3BvbnNlIHtcbiAgYWN0aW9uSW5mbzogQXJyYXk8SUFjdGlvbkluZm8+O1xufVxuXG5leHBvcnQgY29uc3QgR2V0QWN0aW9uc1JlcXVlc3QgPSB7XG4gIGJ5QWRkclRvKGJ5QWRkcjogSUdldEFjdGlvbnNCeUFkZHJlc3NSZXF1ZXN0KTogYW55IHtcbiAgICBjb25zdCBwYlJlcUJ5QWRkciA9IG5ldyBhcGlQYi5HZXRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdCgpO1xuICAgIGlmIChieUFkZHIuYWRkcmVzcykge1xuICAgICAgcGJSZXFCeUFkZHIuc2V0QWRkcmVzcyhieUFkZHIuYWRkcmVzcyk7XG4gICAgfVxuICAgIGlmIChieUFkZHIuc3RhcnQpIHtcbiAgICAgIHBiUmVxQnlBZGRyLnNldFN0YXJ0KGJ5QWRkci5zdGFydCk7XG4gICAgfVxuICAgIGlmIChieUFkZHIuY291bnQpIHtcbiAgICAgIHBiUmVxQnlBZGRyLnNldENvdW50KGJ5QWRkci5jb3VudCk7XG4gICAgfVxuICAgIHJldHVybiBwYlJlcUJ5QWRkcjtcbiAgfSxcblxuICBieUJsa1RvKGJ5QmxrOiBJR2V0QWN0aW9uc0J5QmxvY2tSZXF1ZXN0KTogYW55IHtcbiAgICBjb25zdCBwYlJlcUJ5QmxrID0gbmV3IGFwaVBiLkdldEFjdGlvbnNCeUJsb2NrUmVxdWVzdCgpO1xuICAgIGlmIChieUJsay5ibGtIYXNoKSB7XG4gICAgICBwYlJlcUJ5QmxrLnNldEJsa2hhc2goYnlCbGsuYmxrSGFzaCk7XG4gICAgfVxuICAgIGlmIChieUJsay5zdGFydCkge1xuICAgICAgcGJSZXFCeUJsay5zZXRTdGFydChieUJsay5zdGFydCk7XG4gICAgfVxuICAgIGlmIChieUJsay5jb3VudCkge1xuICAgICAgcGJSZXFCeUJsay5zZXRDb3VudChieUJsay5jb3VudCk7XG4gICAgfVxuICAgIHJldHVybiBwYlJlcUJ5QmxrO1xuICB9LFxuXG4gIGJ5SGFzaFRvKGJ5SGFzaDogSUdldEFjdGlvbnNCeUhhc2hSZXF1ZXN0KTogYW55IHtcbiAgICBjb25zdCBwYlJlcUJ5SGFzaCA9IG5ldyBhcGlQYi5HZXRBY3Rpb25CeUhhc2hSZXF1ZXN0KCk7XG4gICAgaWYgKGJ5SGFzaC5hY3Rpb25IYXNoKSB7XG4gICAgICBwYlJlcUJ5SGFzaC5zZXRBY3Rpb25oYXNoKGJ5SGFzaC5hY3Rpb25IYXNoKTtcbiAgICB9XG4gICAgaWYgKGJ5SGFzaC5jaGVja2luZ1BlbmRpbmcpIHtcbiAgICAgIHBiUmVxQnlIYXNoLnNldENoZWNrcGVuZGluZyhieUhhc2guY2hlY2tpbmdQZW5kaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIHBiUmVxQnlIYXNoO1xuICB9LFxuXG4gIGJ5SW5kZXhUbyhieUluZGV4OiBJR2V0QWN0aW9uc0J5SW5kZXhSZXF1ZXN0KTogYW55IHtcbiAgICBjb25zdCBwYlJlcUJ5SW5kZXggPSBuZXcgYXBpUGIuR2V0QWN0aW9uc0J5SW5kZXhSZXF1ZXN0KCk7XG4gICAgaWYgKGJ5SW5kZXguc3RhcnQpIHtcbiAgICAgIHBiUmVxQnlJbmRleC5zZXRTdGFydChieUluZGV4LnN0YXJ0KTtcbiAgICB9XG4gICAgaWYgKGJ5SW5kZXguY291bnQpIHtcbiAgICAgIHBiUmVxQnlJbmRleC5zZXRDb3VudChieUluZGV4LmNvdW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHBiUmVxQnlJbmRleDtcbiAgfSxcblxuICB1bmNvbmZpcm1lZEJ5QWRkclRvKFxuICAgIHVuY29uZmlybWVkQnlBZGRyOiBJR2V0VW5jb25maXJtZWRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdFxuICApOiBhbnkge1xuICAgIGNvbnN0IHBiUmVxVW5jb25maXJtZWRCeUFkZHIgPSBuZXcgYXBpUGIuR2V0VW5jb25maXJtZWRBY3Rpb25zQnlBZGRyZXNzUmVxdWVzdCgpO1xuICAgIGlmICh1bmNvbmZpcm1lZEJ5QWRkci5zdGFydCkge1xuICAgICAgcGJSZXFVbmNvbmZpcm1lZEJ5QWRkci5zZXRTdGFydCh1bmNvbmZpcm1lZEJ5QWRkci5zdGFydCk7XG4gICAgfVxuICAgIGlmICh1bmNvbmZpcm1lZEJ5QWRkci5jb3VudCkge1xuICAgICAgcGJSZXFVbmNvbmZpcm1lZEJ5QWRkci5zZXRDb3VudCh1bmNvbmZpcm1lZEJ5QWRkci5jb3VudCk7XG4gICAgfVxuICAgIGlmICh1bmNvbmZpcm1lZEJ5QWRkci5hZGRyZXNzKSB7XG4gICAgICBwYlJlcVVuY29uZmlybWVkQnlBZGRyLnNldEFkZHJlc3ModW5jb25maXJtZWRCeUFkZHIuYWRkcmVzcyk7XG4gICAgfVxuICAgIHJldHVybiBwYlJlcVVuY29uZmlybWVkQnlBZGRyO1xuICB9LFxuICB0byhyZXE6IElHZXRBY3Rpb25zUmVxdWVzdCk6IGFueSB7XG4gICAgY29uc3QgcGJSZXEgPSBuZXcgYXBpUGIuR2V0QWN0aW9uc1JlcXVlc3QoKTtcbiAgICBpZiAocmVxLmJ5QWRkcikge1xuICAgICAgcGJSZXEuc2V0QnlhZGRyKEdldEFjdGlvbnNSZXF1ZXN0LmJ5QWRkclRvKHJlcS5ieUFkZHIpKTtcbiAgICB9XG4gICAgaWYgKHJlcS5ieUJsaykge1xuICAgICAgcGJSZXEuc2V0QnlibGsoR2V0QWN0aW9uc1JlcXVlc3QuYnlCbGtUbyhyZXEuYnlCbGspKTtcbiAgICB9XG4gICAgaWYgKHJlcS5ieUhhc2gpIHtcbiAgICAgIHBiUmVxLnNldEJ5aGFzaChHZXRBY3Rpb25zUmVxdWVzdC5ieUhhc2hUbyhyZXEuYnlIYXNoKSk7XG4gICAgfVxuICAgIGlmIChyZXEuYnlJbmRleCkge1xuICAgICAgcGJSZXEuc2V0QnlpbmRleChHZXRBY3Rpb25zUmVxdWVzdC5ieUluZGV4VG8ocmVxLmJ5SW5kZXgpKTtcbiAgICB9XG4gICAgaWYgKHJlcS51bmNvbmZpcm1lZEJ5QWRkcikge1xuICAgICAgcGJSZXEuc2V0VW5jb25maXJtZWRieWFkZHIoXG4gICAgICAgIEdldEFjdGlvbnNSZXF1ZXN0LnVuY29uZmlybWVkQnlBZGRyVG8ocmVxLnVuY29uZmlybWVkQnlBZGRyKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHBiUmVxO1xuICB9LFxuXG4gIGZyb21UcmFuc2ZlcihwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgdHJhbnNmZXJEYXRhID0gcGJSZXM7XG4gICAgaWYgKHBiUmVzKSB7XG4gICAgICB0cmFuc2ZlckRhdGEgPSB7XG4gICAgICAgIGFtb3VudDogcGJSZXMuZ2V0QW1vdW50KCksXG4gICAgICAgIHJlY2lwaWVudDogcGJSZXMuZ2V0UmVjaXBpZW50KCksXG4gICAgICAgIHBheWxvYWQ6IHBiUmVzLmdldFBheWxvYWQoKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZmVyRGF0YTtcbiAgfSxcblxuICBmcm9tVm90ZShwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgdm90ZURhdGEgPSBwYlJlcztcbiAgICBpZiAodm90ZURhdGEpIHtcbiAgICAgIHZvdGVEYXRhID0ge1xuICAgICAgICB0aW1lc3RhbXA6IHBiUmVzLmdldFRpbWVzdGFtcCgpLFxuICAgICAgICB2b3RlZUFkZHJlc3M6IHBiUmVzLmdldFZvdGVlYWRkcmVzcygpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdm90ZURhdGE7XG4gIH0sXG5cbiAgZnJvbUV4ZWN1dGlvbihwYlJlczogRXhlY3V0aW9uIHwgdW5kZWZpbmVkKTogSUV4ZWN1dGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFwYlJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgYW1vdW50OiBwYlJlcy5nZXRBbW91bnQoKSxcbiAgICAgIGNvbnRyYWN0OiBwYlJlcy5nZXRDb250cmFjdCgpLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZGF0YTogQnVmZmVyLmZyb20ocGJSZXMuZ2V0RGF0YSgpKVxuICAgIH07XG4gIH0sXG5cbiAgZnJvbVN0YXJ0U3ViQ2hhaW4ocGJSZXM6IGFueSk6IGFueSB7XG4gICAgbGV0IHN0YXJ0U3ViQ2hhaW5EYXRhID0gcGJSZXM7XG4gICAgaWYgKHN0YXJ0U3ViQ2hhaW5EYXRhKSB7XG4gICAgICBzdGFydFN1YkNoYWluRGF0YSA9IHtcbiAgICAgICAgY2hhaW5JRDogcGJSZXMuY2hhaW5JRCxcbiAgICAgICAgc2VjdXJpdHlEZXBvc2l0OiBwYlJlcy5zZWN1cml0eURlcG9zaXQsXG4gICAgICAgIG9wZXJhdGlvbkRlcG9zaXQ6IHBiUmVzLm9wZXJhdGlvbkRlcG9zaXQsXG4gICAgICAgIHN0YXJ0SGVpZ2h0OiBwYlJlcy5zdGFydEhlaWdodCxcbiAgICAgICAgcGFyZW50SGVpZ2h0T2Zmc2V0OiBwYlJlcy5wYXJlbnRIZWlnaHRPZmZzZXRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzdGFydFN1YkNoYWluRGF0YTtcbiAgfSxcblxuICBmcm9tU3RvcFN1YkNoYWluKHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBzdG9wU3ViQ2hhaW5EYXRhID0gcGJSZXM7XG4gICAgaWYgKHN0b3BTdWJDaGFpbkRhdGEpIHtcbiAgICAgIHN0b3BTdWJDaGFpbkRhdGEgPSB7XG4gICAgICAgIGNoYWluSUQ6IHBiUmVzLmNoYWluSUQsXG4gICAgICAgIHN0b3BIZWlnaHQ6IHBiUmVzLnN0b3BIZWlnaHQsXG4gICAgICAgIHN1YkNoYWluQWRkcmVzczogcGJSZXMuc3ViQ2hhaW5BZGRyZXNzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc3RvcFN1YkNoYWluRGF0YTtcbiAgfSxcblxuICBmcm9tUHV0QmxvY2socGJSZXM6IGFueSk6IGFueSB7XG4gICAgbGV0IHB1dEJsb2NrRGF0YSA9IHBiUmVzO1xuICAgIGlmIChwdXRCbG9ja0RhdGEpIHtcbiAgICAgIGNvbnN0IHJvb3RzRGF0YSA9IHBiUmVzLnJvb3RzO1xuICAgICAgaWYgKHJvb3RzRGF0YSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBiUmVzLnJvb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcm9vdHNEYXRhW2ldID0ge1xuICAgICAgICAgICAgbmFtZTogcGJSZXMucm9vdHNbaV0ubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBwYlJlcy5yb290c1tpXS52YWx1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHB1dEJsb2NrRGF0YSA9IHtcbiAgICAgICAgc3ViQ2hhaW5BZGRyZXNzOiBwYlJlcy5zdWJDaGFpbkFkZHJlc3MsXG4gICAgICAgIGhlaWdodDogcGJSZXMuaGVpZ2h0LFxuICAgICAgICByb290czogcm9vdHNEYXRhXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcHV0QmxvY2tEYXRhO1xuICB9LFxuXG4gIGZyb21DcmVhdGVEZXBvc2l0KHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBjcmVhdGVEZXBvc2l0RGF0YSA9IHBiUmVzO1xuICAgIGlmIChjcmVhdGVEZXBvc2l0RGF0YSkge1xuICAgICAgY3JlYXRlRGVwb3NpdERhdGEgPSB7XG4gICAgICAgIGNoYWluSUQ6IHBiUmVzLmNoYWluSUQsXG4gICAgICAgIGFtb3VudDogcGJSZXMuYW1vdW50LFxuICAgICAgICByZWNpcGllbnQ6IHBiUmVzLnJlY2lwaWVudFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZURlcG9zaXREYXRhO1xuICB9LFxuXG4gIGZyb21TZXR0bGVEZXBvc2l0KHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBzZXR0bGVEZXBvc2l0RGF0YSA9IHBiUmVzO1xuICAgIGlmIChzZXR0bGVEZXBvc2l0RGF0YSkge1xuICAgICAgc2V0dGxlRGVwb3NpdERhdGEgPSB7XG4gICAgICAgIGFtb3VudDogcGJSZXMuYW1vdW50LFxuICAgICAgICByZWNpcGllbnQ6IHBiUmVzLnJlY2lwaWVudCxcbiAgICAgICAgaW5kZXg6IHBiUmVzLmluZGV4XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2V0dGxlRGVwb3NpdERhdGE7XG4gIH0sXG5cbiAgZnJvbUNyZWF0ZVBsdW1DaGFpbihwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgY3JlYXRlUGx1bUNoYWluRGF0YSA9IHBiUmVzO1xuICAgIGlmIChjcmVhdGVQbHVtQ2hhaW5EYXRhKSB7XG4gICAgICBjcmVhdGVQbHVtQ2hhaW5EYXRhID0ge307XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVQbHVtQ2hhaW5EYXRhO1xuICB9LFxuXG4gIGZyb21UZXJtaW5hdGVQbHVtQ2hhaW4ocGJSZXM6IGFueSk6IGFueSB7XG4gICAgbGV0IHRlcm1pbmF0ZVBsdW1DaGFpbkRhdGEgPSBwYlJlcztcbiAgICBpZiAodGVybWluYXRlUGx1bUNoYWluRGF0YSkge1xuICAgICAgdGVybWluYXRlUGx1bUNoYWluRGF0YSA9IHtcbiAgICAgICAgc3ViQ2hhaW5BZGRyZXNzOiBwYlJlcy5zdWJDaGFpbkFkZHJlc3NcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0ZXJtaW5hdGVQbHVtQ2hhaW5EYXRhO1xuICB9LFxuXG4gIGZyb21QbHVtUHV0QmxvY2socGJSZXM6IGFueSk6IGFueSB7XG4gICAgbGV0IHBsdW1QdXRCbG9ja0RhdGEgPSBwYlJlcztcbiAgICBpZiAocGx1bVB1dEJsb2NrRGF0YSkge1xuICAgICAgcGx1bVB1dEJsb2NrRGF0YSA9IHtcbiAgICAgICAgc3ViQ2hhaW5BZGRyZXNzOiBwYlJlcy5zdWJDaGFpbkFkZHJlc3MsXG4gICAgICAgIGhlaWdodDogcGJSZXMuaGVpZ2h0LFxuICAgICAgICByb290czogcGJSZXMucm9vdHNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBwbHVtUHV0QmxvY2tEYXRhO1xuICB9LFxuXG4gIGZyb21QbHVtQ3JlYXRlRGVwb3NpdChwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgcGx1bUNyZWF0ZURlcG9zaXREYXRhID0gcGJSZXM7XG4gICAgaWYgKHBsdW1DcmVhdGVEZXBvc2l0RGF0YSkge1xuICAgICAgcGx1bUNyZWF0ZURlcG9zaXREYXRhID0ge1xuICAgICAgICBzdWJDaGFpbkFkZHJlc3M6IHBiUmVzLnN1YkNoYWluQWRkcmVzcyxcbiAgICAgICAgYW1vdW50OiBwYlJlcy5hbW91bnQsXG4gICAgICAgIHJlY2lwaWVudDogcGJSZXMucmVjaXBpZW50XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcGx1bUNyZWF0ZURlcG9zaXREYXRhO1xuICB9LFxuXG4gIGZyb21QbHVtU3RhcnRFeGl0KHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBwbHVtU3RhcnRFeGl0RGF0YSA9IHBiUmVzO1xuICAgIGlmIChwbHVtU3RhcnRFeGl0RGF0YSkge1xuICAgICAgcGx1bVN0YXJ0RXhpdERhdGEgPSB7XG4gICAgICAgIHN1YkNoYWluQWRkcmVzczogcGJSZXMuc3ViQ2hhaW5BZGRyZXNzLFxuICAgICAgICBwcmV2aW91c1RyYW5zZmVyOiBwYlJlcy5wcmV2aW91c1RyYW5zZmVyLFxuICAgICAgICBwcmV2aW91c1RyYW5zZmVyQmxvY2tQcm9vZjogcGJSZXMucHJldmlvdXNUcmFuc2ZlckJsb2NrUHJvb2YsXG4gICAgICAgIHByZXZpb3VzVHJhbnNmZXJCbG9ja0hlaWdodDogcGJSZXMucHJldmlvdXNUcmFuc2ZlckJsb2NrSGVpZ2h0LFxuICAgICAgICBleGl0VHJhbnNmZXI6IHBiUmVzLmV4aXRUcmFuc2ZlcixcbiAgICAgICAgZXhpdFRyYW5zZmVyQmxvY2tQcm9vZjogcGJSZXMuZXhpdFRyYW5zZmVyQmxvY2tQcm9vZixcbiAgICAgICAgZXhpdFRyYW5zZmVyQmxvY2tIZWlnaHQ6IHBiUmVzLmV4aXRUcmFuc2ZlckJsb2NrSGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcGx1bVN0YXJ0RXhpdERhdGE7XG4gIH0sXG5cbiAgZnJvbVBsdW1DaGFsbGVuZ2VFeGl0KHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBwbHVtQ2hhbGxlbmdlRXhpdERhdGEgPSBwYlJlcztcbiAgICBpZiAocGx1bUNoYWxsZW5nZUV4aXREYXRhKSB7XG4gICAgICBwbHVtQ2hhbGxlbmdlRXhpdERhdGEgPSB7XG4gICAgICAgIHN1YkNoYWluQWRkcmVzczogcGJSZXMuc3ViQ2hhaW5BZGRyZXNzLFxuICAgICAgICBjb2luSUQ6IHBiUmVzLmNvaW5JRCxcbiAgICAgICAgY2hhbGxlbmdlVHJhbnNmZXI6IHBiUmVzLmNoYWxsZW5nZVRyYW5zZmVyLFxuICAgICAgICBjaGFsbGVuZ2VUcmFuc2ZlckJsb2NrUHJvb2Y6IHBiUmVzLmNoYWxsZW5nZVRyYW5zZmVyQmxvY2tQcm9vZixcbiAgICAgICAgY2hhbGxlbmdlVHJhbnNmZXJCbG9ja0hlaWdodDogcGJSZXMuY2hhbGxlbmdlVHJhbnNmZXJCbG9ja0hlaWdodFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdW1DaGFsbGVuZ2VFeGl0RGF0YTtcbiAgfSxcblxuICBmcm9tUGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdChwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgcGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdERhdGEgPSBwYlJlcztcbiAgICBpZiAocGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdERhdGEpIHtcbiAgICAgIHBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXREYXRhID0ge1xuICAgICAgICBzdWJDaGFpbkFkZHJlc3M6IHBiUmVzLnN1YkNoYWluQWRkcmVzcyxcbiAgICAgICAgY29pbklEOiBwYlJlcy5jb2luSUQsXG4gICAgICAgIGNoYWxsZW5nZVRyYW5zZmVyOiBwYlJlcy5jaGFsbGVuZ2VUcmFuc2ZlcixcbiAgICAgICAgcmVzcG9uc2VUcmFuc2ZlcjogcGJSZXMucmVzcG9uc2VUcmFuc2ZlcixcbiAgICAgICAgcmVzcG9uc2VUcmFuc2ZlckJsb2NrUHJvb2Y6IHBiUmVzLnJlc3BvbnNlVHJhbnNmZXJCbG9ja1Byb29mLFxuICAgICAgICBwcmV2aW91c1RyYW5zZmVyQmxvY2tIZWlnaHQ6IHBiUmVzLnByZXZpb3VzVHJhbnNmZXJCbG9ja0hlaWdodFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXREYXRhO1xuICB9LFxuXG4gIGZyb21QbHVtRmluYWxpemVFeGl0KHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBwbHVtRmluYWxpemVFeGl0RGF0YSA9IHBiUmVzO1xuICAgIGlmIChwbHVtRmluYWxpemVFeGl0RGF0YSkge1xuICAgICAgcGx1bUZpbmFsaXplRXhpdERhdGEgPSB7XG4gICAgICAgIHN1YkNoYWluQWRkcmVzczogcGJSZXMuc3ViQ2hhaW5BZGRyZXNzLFxuICAgICAgICBjb2luSUQ6IHBiUmVzLmNvaW5JRFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdW1GaW5hbGl6ZUV4aXREYXRhO1xuICB9LFxuXG4gIGZyb21QbHVtU2V0dGxlRGVwb3NpdChwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgcGx1bVNldHRsZURlcG9zaXREYXRhID0gcGJSZXM7XG4gICAgaWYgKHBsdW1TZXR0bGVEZXBvc2l0RGF0YSkge1xuICAgICAgcGx1bVNldHRsZURlcG9zaXREYXRhID0ge1xuICAgICAgICBjb2luSUQ6IHBiUmVzLmNvaW5JRFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdW1TZXR0bGVEZXBvc2l0RGF0YTtcbiAgfSxcblxuICBmcm9tUGx1bVRyYW5zZmVyKHBiUmVzOiBhbnkpOiBhbnkge1xuICAgIGxldCBwbHVtVHJhbnNmZXJEYXRhID0gcGJSZXM7XG4gICAgaWYgKHBsdW1UcmFuc2ZlckRhdGEpIHtcbiAgICAgIHBsdW1UcmFuc2ZlckRhdGEgPSB7XG4gICAgICAgIGNvaW5JRDogcGJSZXMuY29pbklELFxuICAgICAgICBkZW5vbWluYXRpb246IHBiUmVzLmRlbm9taW5hdGlvbixcbiAgICAgICAgb3duZXI6IHBiUmVzLm93bmVyLFxuICAgICAgICByZWNpcGllbnQ6IHBiUmVzLnJlY2lwaWVudFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdW1UcmFuc2ZlckRhdGE7XG4gIH0sXG5cbiAgZnJvbURlcG9zaXRUb1Jld2FyZGluZ0Z1bmQocGJSZXM6IGFueSk6IGFueSB7XG4gICAgbGV0IGRlcG9zaXRUb1Jld2FyZGluZ0Z1bmREYXRhID0gcGJSZXM7XG4gICAgaWYgKGRlcG9zaXRUb1Jld2FyZGluZ0Z1bmREYXRhKSB7XG4gICAgICBkZXBvc2l0VG9SZXdhcmRpbmdGdW5kRGF0YSA9IHtcbiAgICAgICAgYW1vdW50OiBwYlJlcy5hbW91bnQsXG4gICAgICAgIGRhdGE6IHBiUmVzLmRhdGFcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkZXBvc2l0VG9SZXdhcmRpbmdGdW5kRGF0YTtcbiAgfSxcblxuICBmcm9tQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZChwYlJlczogYW55KTogYW55IHtcbiAgICBsZXQgY2xhaW1Gcm9tUmV3YXJkaW5nRnVuZERhdGEgPSBwYlJlcztcbiAgICBpZiAoY2xhaW1Gcm9tUmV3YXJkaW5nRnVuZERhdGEpIHtcbiAgICAgIGNsYWltRnJvbVJld2FyZGluZ0Z1bmREYXRhID0ge1xuICAgICAgICBhbW91bnQ6IHBiUmVzLmFtb3VudCxcbiAgICAgICAgZGF0YTogcGJSZXMuZGF0YVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGNsYWltRnJvbVJld2FyZGluZ0Z1bmREYXRhO1xuICB9LFxuXG4gIGZyb21TZXRSZXdhcmQocGJSZXM6IGFueSk6IGFueSB7XG4gICAgbGV0IHNldFJld2FyZERhdGEgPSBwYlJlcztcbiAgICBpZiAoc2V0UmV3YXJkRGF0YSkge1xuICAgICAgc2V0UmV3YXJkRGF0YSA9IHtcbiAgICAgICAgYW1vdW50OiBwYlJlcy5hbW91bnQsXG4gICAgICAgIGRhdGE6IHBiUmVzLmRhdGEsXG4gICAgICAgIHR5cGU6IHBiUmVzLnR5cGVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZXRSZXdhcmREYXRhO1xuICB9LFxuXG4gIGZyb21HcmFudFJld2FyZChcbiAgICBwYlJlczogYWN0aW9uUGIuR3JhbnRSZXdhcmQgfCB1bmRlZmluZWRcbiAgKTogSUdyYW50UmV3YXJkIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXBiUmVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogcGJSZXMuZ2V0VHlwZSgpLFxuICAgICAgaGVpZ2h0OiBwYlJlcy5nZXRIZWlnaHQoKVxuICAgIH07XG4gIH0sXG5cbiAgZnJvbVN0YWtlQ3JlYXRlKFxuICAgIHBiUmVzOiBhY3Rpb25QYi5TdGFrZUNyZWF0ZSB8IHVuZGVmaW5lZFxuICApOiBJU3Rha2VDcmVhdGUgfCB1bmRlZmluZWQge1xuICAgIGlmICghcGJSZXMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBjYW5kaWRhdGVOYW1lOiBwYlJlcy5nZXRDYW5kaWRhdGVuYW1lKCksXG4gICAgICBzdGFrZWRBbW91bnQ6IHBiUmVzLmdldFN0YWtlZGFtb3VudCgpLFxuICAgICAgc3Rha2VkRHVyYXRpb246IHBiUmVzLmdldFN0YWtlZGR1cmF0aW9uKCksXG4gICAgICBhdXRvU3Rha2U6IHBiUmVzLmdldEF1dG9zdGFrZSgpLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGF5bG9hZDogQnVmZmVyLmZyb20ocGJSZXMuZ2V0UGF5bG9hZCgpKVxuICAgIH07XG4gIH0sXG5cbiAgZnJvbVN0YWtlUmVjbGFpbShcbiAgICBwYlJlczogYWN0aW9uUGIuU3Rha2VSZWNsYWltIHwgdW5kZWZpbmVkXG4gICk6IElTdGFrZVJlY2xhaW0gfCB1bmRlZmluZWQge1xuICAgIGlmICghcGJSZXMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBidWNrZXRJbmRleDogcGJSZXMuZ2V0QnVja2V0aW5kZXgoKSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBheWxvYWQ6IEJ1ZmZlci5mcm9tKHBiUmVzLmdldFBheWxvYWQoKSlcbiAgICB9O1xuICB9LFxuXG4gIGZyb21TdGFrZUFkZERlcG9zaXQoXG4gICAgcGJSZXM6IGFjdGlvblBiLlN0YWtlQWRkRGVwb3NpdCB8IHVuZGVmaW5lZFxuICApOiBJU3Rha2VBZGREZXBvc2l0IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXBiUmVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgYnVja2V0SW5kZXg6IHBiUmVzLmdldEJ1Y2tldGluZGV4KCksXG4gICAgICBhbW91bnQ6IHBiUmVzLmdldEFtb3VudCgpLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGF5bG9hZDogQnVmZmVyLmZyb20ocGJSZXMuZ2V0UGF5bG9hZCgpKVxuICAgIH07XG4gIH0sXG5cbiAgZnJvbVN0YWtlUmVzdGFrZShcbiAgICBwYlJlczogYWN0aW9uUGIuU3Rha2VSZXN0YWtlIHwgdW5kZWZpbmVkXG4gICk6IElTdGFrZVJlc3Rha2UgfCB1bmRlZmluZWQge1xuICAgIGlmICghcGJSZXMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBidWNrZXRJbmRleDogcGJSZXMuZ2V0QnVja2V0aW5kZXgoKSxcbiAgICAgIHN0YWtlZER1cmF0aW9uOiBwYlJlcy5nZXRTdGFrZWRkdXJhdGlvbigpLFxuICAgICAgYXV0b1N0YWtlOiBwYlJlcy5nZXRBdXRvc3Rha2UoKSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBheWxvYWQ6IEJ1ZmZlci5mcm9tKHBiUmVzLmdldFBheWxvYWQoKSlcbiAgICB9O1xuICB9LFxuXG4gIGZyb21TdGFrZUNoYW5nZUNhbmRpZGF0ZShcbiAgICBwYlJlczogYWN0aW9uUGIuU3Rha2VDaGFuZ2VDYW5kaWRhdGUgfCB1bmRlZmluZWRcbiAgKTogSVN0YWtlQ2hhbmdlQ2FuZGlkYXRlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXBiUmVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgYnVja2V0SW5kZXg6IHBiUmVzLmdldEJ1Y2tldGluZGV4KCksXG4gICAgICBjYW5kaWRhdGVOYW1lOiBwYlJlcy5nZXRDYW5kaWRhdGVuYW1lKCksXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwYXlsb2FkOiBCdWZmZXIuZnJvbShwYlJlcy5nZXRQYXlsb2FkKCkpXG4gICAgfTtcbiAgfSxcblxuICBmcm9tU3Rha2VUcmFuc2Zlck93bmVyc2hpcChcbiAgICBwYlJlczogYWN0aW9uUGIuU3Rha2VUcmFuc2Zlck93bmVyc2hpcCB8IHVuZGVmaW5lZFxuICApOiBJU3Rha2VUcmFuc2Zlck93bmVyc2hpcCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFwYlJlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGJ1Y2tldEluZGV4OiBwYlJlcy5nZXRCdWNrZXRpbmRleCgpLFxuICAgICAgdm90ZXJBZGRyZXNzOiBwYlJlcy5nZXRWb3RlcmFkZHJlc3MoKSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBheWxvYWQ6IEJ1ZmZlci5mcm9tKHBiUmVzLmdldFBheWxvYWQoKSlcbiAgICB9O1xuICB9LFxuXG4gIGZyb21DYW5kaWRhdGVSZWdpc3RlcihcbiAgICBwYlJlczogYWN0aW9uUGIuQ2FuZGlkYXRlUmVnaXN0ZXIgfCB1bmRlZmluZWRcbiAgKTogSUNhbmRpZGF0ZVJlZ2lzdGVyIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXBiUmVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY2FuZGlkYXRlOiB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbmFtZTogcGJSZXMuZ2V0Q2FuZGlkYXRlKCkuZ2V0TmFtZSgpLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG9wZXJhdG9yQWRkcmVzczogcGJSZXMuZ2V0Q2FuZGlkYXRlKCkuZ2V0T3BlcmF0b3JhZGRyZXNzKCksXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV3YXJkQWRkcmVzczogcGJSZXMuZ2V0Q2FuZGlkYXRlKCkuZ2V0UmV3YXJkYWRkcmVzcygpXG4gICAgICB9LFxuICAgICAgc3Rha2VkQW1vdW50OiBwYlJlcy5nZXRTdGFrZWRhbW91bnQoKSxcbiAgICAgIHN0YWtlZER1cmF0aW9uOiBwYlJlcy5nZXRTdGFrZWRkdXJhdGlvbigpLFxuICAgICAgYXV0b1N0YWtlOiBwYlJlcy5nZXRBdXRvc3Rha2UoKSxcbiAgICAgIG93bmVyQWRkcmVzczogcGJSZXMuZ2V0T3duZXJhZGRyZXNzKCksXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwYXlsb2FkOiBCdWZmZXIuZnJvbShwYlJlcy5nZXRQYXlsb2FkKCkpXG4gICAgfTtcbiAgfSxcblxuICBmcm9tQ2FuZGlkYXRlVXBkYXRlKFxuICAgIHBiUmVzOiBhY3Rpb25QYi5DYW5kaWRhdGVCYXNpY0luZm8gfCB1bmRlZmluZWRcbiAgKTogSUNhbmRpZGF0ZUJhc2ljSW5mbyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFwYlJlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHBiUmVzLmdldE5hbWUoKSxcbiAgICAgIG9wZXJhdG9yQWRkcmVzczogcGJSZXMuZ2V0T3BlcmF0b3JhZGRyZXNzKCksXG4gICAgICByZXdhcmRBZGRyZXNzOiBwYlJlcy5nZXRSZXdhcmRhZGRyZXNzKClcbiAgICB9O1xuICB9LFxuXG4gIGdldFB1dFBvbGxSZXN1bHQocmVxOiBQdXRQb2xsUmVzdWx0IHwgdW5kZWZpbmVkKTogSVB1dFBvbGxSZXN1bHQgfCB1bmRlZmluZWQge1xuICAgIGlmICghcmVxKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBsZXQgY2FuZGlkYXRlTGlzdDogSUNhbmRpZGF0ZUxpc3QgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmF3Q2FuZGlkYXRlcyA9IHJlcS5nZXRDYW5kaWRhdGVzKCk7XG4gICAgaWYgKHJhd0NhbmRpZGF0ZXMpIHtcbiAgICAgIGNhbmRpZGF0ZUxpc3QgPSB7XG4gICAgICAgIGNhbmRpZGF0ZXM6IFtdXG4gICAgICB9O1xuICAgICAgY29uc3QgcmF3Q2FuZGlkYXRlc0xpc3QgPSByYXdDYW5kaWRhdGVzLmdldENhbmRpZGF0ZXNMaXN0KCk7XG4gICAgICBpZiAocmF3Q2FuZGlkYXRlc0xpc3QpIHtcbiAgICAgICAgZm9yIChjb25zdCByYXdDYW5kaWRhdGUgb2YgcmF3Q2FuZGlkYXRlc0xpc3QpIHtcbiAgICAgICAgICBjYW5kaWRhdGVMaXN0LmNhbmRpZGF0ZXMucHVzaCh7XG4gICAgICAgICAgICBhZGRyZXNzOiByYXdDYW5kaWRhdGUuZ2V0QWRkcmVzcygpLFxuICAgICAgICAgICAgdm90ZXM6IHJhd0NhbmRpZGF0ZS5nZXRWb3RlcygpLFxuICAgICAgICAgICAgcHViS2V5OiByYXdDYW5kaWRhdGUuZ2V0UHVia2V5KCksXG4gICAgICAgICAgICByZXdhcmRBZGRyZXNzOiByYXdDYW5kaWRhdGUuZ2V0UmV3YXJkYWRkcmVzcygpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogcmVxLmdldEhlaWdodCgpLFxuICAgICAgY2FuZGlkYXRlczogY2FuZGlkYXRlTGlzdFxuICAgIH07XG4gIH0sXG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXG4gIGZyb20ocGJSZXM6IEdldEFjdGlvbnNSZXNwb25zZSk6IElHZXRBY3Rpb25zUmVzcG9uc2Uge1xuICAgIGNvbnN0IHJlcyA9ICh7XG4gICAgICBhY3Rpb25JbmZvOiBbXVxuICAgIH0gYXMgYW55KSBhcyBJR2V0QWN0aW9uc1Jlc3BvbnNlO1xuICAgIGNvbnN0IHJhd0FjdGlvbkluZm9MaXN0ID0gcGJSZXMuZ2V0QWN0aW9uaW5mb0xpc3QoKTtcbiAgICBpZiAoIXJhd0FjdGlvbkluZm9MaXN0KSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcmF3QWN0aW9uSW5mbyBvZiByYXdBY3Rpb25JbmZvTGlzdCkge1xuICAgICAgY29uc3QgYWN0aW9uSW5mbyA9ICh7XG4gICAgICAgIGFjdEhhc2g6IHJhd0FjdGlvbkluZm8uZ2V0QWN0aGFzaCgpLFxuICAgICAgICBibGtIYXNoOiByYXdBY3Rpb25JbmZvLmdldEJsa2hhc2goKSxcbiAgICAgICAgdGltZXN0YW1wOiByYXdBY3Rpb25JbmZvLmdldFRpbWVzdGFtcCgpXG4gICAgICB9IGFzIGFueSkgYXMgSUFjdGlvbkluZm87XG5cbiAgICAgIGNvbnN0IHJhd0FjdGlvbiA9IHJhd0FjdGlvbkluZm8uZ2V0QWN0aW9uKCk7XG4gICAgICBpZiAocmF3QWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHJhd0FjdGlvbkNvcmUgPSByYXdBY3Rpb24uZ2V0Q29yZSgpO1xuICAgICAgICBsZXQgYWN0aW9uQ29yZTogSUFjdGlvbkNvcmUgfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChyYXdBY3Rpb25Db3JlKSB7XG4gICAgICAgICAgYWN0aW9uQ29yZSA9IHtcbiAgICAgICAgICAgIHZlcnNpb246IHJhd0FjdGlvbkNvcmUuZ2V0VmVyc2lvbigpLFxuICAgICAgICAgICAgbm9uY2U6IFN0cmluZyhyYXdBY3Rpb25Db3JlLmdldE5vbmNlKCkpLFxuICAgICAgICAgICAgZ2FzTGltaXQ6IFN0cmluZyhyYXdBY3Rpb25Db3JlLmdldEdhc2xpbWl0KCkpLFxuICAgICAgICAgICAgZ2FzUHJpY2U6IHJhd0FjdGlvbkNvcmUuZ2V0R2FzcHJpY2UoKSxcbiAgICAgICAgICAgIHRyYW5zZmVyOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tVHJhbnNmZXIoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0VHJhbnNmZXIoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGV4ZWN1dGlvbjogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbUV4ZWN1dGlvbihcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRFeGVjdXRpb24oKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN0YXJ0U3ViQ2hhaW46IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21TdGFydFN1YkNoYWluKFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFN0YXJ0c3ViY2hhaW4oKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN0b3BTdWJDaGFpbjogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVN0b3BTdWJDaGFpbihcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRTdG9wc3ViY2hhaW4oKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHB1dEJsb2NrOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tUHV0QmxvY2soXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UHV0YmxvY2soKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNyZWF0ZURlcG9zaXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21DcmVhdGVEZXBvc2l0KFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldENyZWF0ZWRlcG9zaXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHNldHRsZURlcG9zaXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21TZXR0bGVEZXBvc2l0KFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFNldHRsZWRlcG9zaXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNyZWF0ZVBsdW1DaGFpbjogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbUNyZWF0ZVBsdW1DaGFpbihcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRDcmVhdGVwbHVtY2hhaW4oKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHRlcm1pbmF0ZVBsdW1DaGFpbjogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVRlcm1pbmF0ZVBsdW1DaGFpbihcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRUZXJtaW5hdGVwbHVtY2hhaW4oKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1QdXRCbG9jazogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVBsdW1QdXRCbG9jayhcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRQbHVtcHV0YmxvY2soKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1DcmVhdGVEZXBvc2l0OiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tUGx1bUNyZWF0ZURlcG9zaXQoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UGx1bWNyZWF0ZWRlcG9zaXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1TdGFydEV4aXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21QbHVtU3RhcnRFeGl0KFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFBsdW1zdGFydGV4aXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1DaGFsbGVuZ2VFeGl0OiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tUGx1bUNoYWxsZW5nZUV4aXQoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UGx1bWNoYWxsZW5nZWV4aXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21QbHVtUmVzcG9uc2VDaGFsbGVuZ2VFeGl0KFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFBsdW1yZXNwb25zZWNoYWxsZW5nZWV4aXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1GaW5hbGl6ZUV4aXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21QbHVtRmluYWxpemVFeGl0KFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFBsdW1maW5hbGl6ZWV4aXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1TZXR0bGVEZXBvc2l0OiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tUGx1bVNldHRsZURlcG9zaXQoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UGx1bXNldHRsZWRlcG9zaXQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHBsdW1UcmFuc2ZlcjogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVBsdW1UcmFuc2ZlcihcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRQbHVtdHJhbnNmZXIoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGRlcG9zaXRUb1Jld2FyZGluZ0Z1bmQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21EZXBvc2l0VG9SZXdhcmRpbmdGdW5kKFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldERlcG9zaXR0b3Jld2FyZGluZ2Z1bmQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNsYWltRnJvbVJld2FyZGluZ0Z1bmQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21DbGFpbUZyb21SZXdhcmRpbmdGdW5kKFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldENsYWltZnJvbXJld2FyZGluZ2Z1bmQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGdyYW50UmV3YXJkOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tR3JhbnRSZXdhcmQoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0R3JhbnRyZXdhcmQoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN0YWtlQ3JlYXRlOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tU3Rha2VDcmVhdGUoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0U3Rha2VjcmVhdGUoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN0YWtlVW5zdGFrZTogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVN0YWtlUmVjbGFpbShcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRTdGFrZXVuc3Rha2UoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN0YWtlV2l0aGRyYXc6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21TdGFrZVJlY2xhaW0oXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0U3Rha2V3aXRoZHJhdygpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3Rha2VBZGREZXBvc2l0OiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tU3Rha2VBZGREZXBvc2l0KFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFN0YWtlYWRkZGVwb3NpdCgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3Rha2VSZXN0YWtlOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tU3Rha2VSZXN0YWtlKFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFN0YWtlcmVzdGFrZSgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3Rha2VDaGFuZ2VDYW5kaWRhdGU6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21TdGFrZUNoYW5nZUNhbmRpZGF0ZShcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRTdGFrZWNoYW5nZWNhbmRpZGF0ZSgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3Rha2VUcmFuc2Zlck93bmVyc2hpcDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVN0YWtlVHJhbnNmZXJPd25lcnNoaXAoXG4gICAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0U3Rha2V0cmFuc2Zlcm93bmVyc2hpcCgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2FuZGlkYXRlUmVnaXN0ZXI6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21DYW5kaWRhdGVSZWdpc3RlcihcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRDYW5kaWRhdGVyZWdpc3RlcigpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2FuZGlkYXRlVXBkYXRlOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tQ2FuZGlkYXRlVXBkYXRlKFxuICAgICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldENhbmRpZGF0ZXVwZGF0ZSgpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcHV0UG9sbFJlc3VsdDogR2V0QWN0aW9uc1JlcXVlc3QuZ2V0UHV0UG9sbFJlc3VsdChcbiAgICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRQdXRwb2xscmVzdWx0KClcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0aW9uSW5mby5hY3Rpb24gPSB7XG4gICAgICAgICAgY29yZTogYWN0aW9uQ29yZSxcbiAgICAgICAgICBzZW5kZXJQdWJLZXk6IHJhd0FjdGlvbi5nZXRTZW5kZXJwdWJrZXkoKSxcbiAgICAgICAgICBzaWduYXR1cmU6IHJhd0FjdGlvbi5nZXRTaWduYXR1cmUoKVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXMuYWN0aW9uSW5mby5wdXNoKGFjdGlvbkluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBTdWdnZXN0R2FzUHJpY2UgUmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSVN1Z2dlc3RHYXNQcmljZVJlcXVlc3Qge31cblxuLy8gUHJvcGVydGllcyBvZiBhIFN1Z2dlc3RHYXNQcmljZVJlc3BvbnNlLlxuZXhwb3J0IGludGVyZmFjZSBJU3VnZ2VzdEdhc1ByaWNlUmVzcG9uc2Uge1xuICAvLyBTdWdnZXN0R2FzUHJpY2VSZXNwb25zZSBnYXNQcmljZVxuICBnYXNQcmljZTogbnVtYmVyO1xufVxuXG5leHBvcnQgY29uc3QgU3VnZ2VzdEdhc1ByaWNlUmVxdWVzdCA9IHtcbiAgLy8gQHRzLWlnbm9yZVxuICB0byhyZXE6IElTdWdnZXN0R2FzUHJpY2VSZXF1ZXN0KTogYW55IHtcbiAgICByZXR1cm4gbmV3IGFwaVBiLlN1Z2dlc3RHYXNQcmljZVJlcXVlc3QoKTtcbiAgfSxcblxuICBmcm9tKHBiUmVzOiBhbnkpOiBJU3VnZ2VzdEdhc1ByaWNlUmVzcG9uc2Uge1xuICAgIGNvbnN0IGdhc1ByaWNlID0gcGJSZXMuZ2V0R2FzcHJpY2UoKTtcbiAgICByZXR1cm4ge1xuICAgICAgZ2FzUHJpY2VcbiAgICB9O1xuICB9XG59O1xuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgR2V0UmVjZWlwdEJ5QWN0aW9uUmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldFJlY2VpcHRCeUFjdGlvblJlcXVlc3Qge1xuICAvLyBHZXRSZWNlaXB0QnlBY3Rpb25SZXF1ZXN0IGFjdGlvbkhhc2hcbiAgYWN0aW9uSGFzaDogc3RyaW5nO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGFuIExvZy5cbmV4cG9ydCBpbnRlcmZhY2UgSUxvZyB7XG4gIC8vIExvZyBhZGRyZXNzXG4gIGNvbnRyYWN0QWRkcmVzczogc3RyaW5nO1xuXG4gIC8vIExvZyB0b3BpY3NcbiAgdG9waWNzOiBBcnJheTxCdWZmZXIgfCB7fT47XG5cbiAgLy8gTG9nIGRhdGFcbiAgZGF0YTogQnVmZmVyIHwge307XG5cbiAgLy8gTG9nIGJsa0hlaWdodFxuICBibGtIZWlnaHQ6IG51bWJlcjtcblxuICAvLyBMb2cgdHhuSGFzaFxuICBhY3RIYXNoOiBCdWZmZXIgfCB7fTtcblxuICAvLyBMb2cgaW5kZXhcbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGVudW0gUmVjZWlwdFN0YXR1cyB7XG4gIEZhaWx1cmUgPSAwLFxuICBTdWNjZXNzID0gMSxcbiAgLy8xeHggZm9yIEVWTSBFcnJvckNvZGVcbiAgRXJyVW5rbm93biA9IDEwMCxcbiAgRXJyT3V0T2ZHYXMgPSAxMDEsXG4gIEVyckNvZGVTdG9yZU91dE9mR2FzID0gMTAyLFxuICBFcnJEZXB0aCA9IDEwMyxcbiAgRXJyQ29udHJhY3RBZGRyZXNzQ29sbGlzaW9uID0gMTA0LFxuICBFcnJOb0NvbXBhdGlibGVJbnRlcnByZXRlciA9IDEwNSxcbiAgRXJyRXhlY3V0aW9uUmV2ZXJ0ZWQgPSAxMDYsXG4gIEVyck1heENvZGVTaXplRXhjZWVkZWQgPSAxMDcsXG4gIEVycldyaXRlUHJvdGVjdGlvbiA9IDEwOCxcblxuICAvLzJ4eCBmb3IgU3Rha2luZyBFcnJvckNvZGVcbiAgRXJyTG9hZEFjY291bnQgPSAyMDAsXG4gIEVyck5vdEVub3VnaEJhbGFuY2UgPSAyMDEsXG4gIEVyckludmFsaWRCdWNrZXRJbmRleCA9IDIwMixcbiAgRXJyVW5hdXRob3JpemVkT3BlcmF0b3IgPSAyMDMsXG4gIEVyckludmFsaWRCdWNrZXRUeXBlID0gMjA0LFxuICBFcnJDYW5kaWRhdGVOb3RFeGlzdCA9IDIwNSxcbiAgRXJyUmVkdWNlRHVyYXRpb25CZWZvcmVNYXR1cml0eSA9IDIwNixcbiAgRXJyVW5zdGFrZUJlZm9yZU1hdHVyaXR5ID0gMjA3LFxuICBFcnJXaXRoZHJhd0JlZm9yZVVuc3Rha2UgPSAyMDgsXG4gIEVycldpdGhkcmF3QmVmb3JlTWF0dXJpdHkgPSAyMDksXG4gIEVyckNhbmRpZGF0ZUFscmVhZHlFeGlzdCA9IDIxMCxcbiAgRXJyQ2FuZGlkYXRlQ29uZmxpY3QgPSAyMTFcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhbiBSZWNlaXB0LlxuZXhwb3J0IGludGVyZmFjZSBJUmVjZWlwdCB7XG4gIC8vIFJlY2VpcHQgc3RhdHVzXG4gIHN0YXR1czogUmVjZWlwdFN0YXR1cztcblxuICAvLyBibGtIZWlnaHRcbiAgYmxrSGVpZ2h0OiBudW1iZXI7XG5cbiAgLy8gUmVjZWlwdCBhY3RIYXNoXG4gIGFjdEhhc2g6IEJ1ZmZlciB8IHt9O1xuXG4gIC8vIFJlY2VpcHQgZ2FzQ29uc3VtZWRcbiAgZ2FzQ29uc3VtZWQ6IG51bWJlcjtcblxuICAvLyBSZWNlaXB0IGNvbnRyYWN0QWRkcmVzc1xuICBjb250cmFjdEFkZHJlc3M6IHN0cmluZztcblxuICAvLyBSZWNlaXB0IGxvZ3NcbiAgbG9nczogQXJyYXk8SUxvZz4gfCB1bmRlZmluZWQ7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYW4gUmVjZWlwdC5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlY2VpcHRJbmZvIHtcbiAgLy8gUmVjZWlwdFxuICByZWNlaXB0OiBJUmVjZWlwdCB8IHVuZGVmaW5lZDtcblxuICAvLyBibGtIYXNoXG4gIGJsa0hhc2g6IHN0cmluZztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIEdldFJlY2VpcHRCeUFjdGlvblJlc3BvbnNlLlxuZXhwb3J0IGludGVyZmFjZSBJR2V0UmVjZWlwdEJ5QWN0aW9uUmVzcG9uc2Uge1xuICAvLyBHZXRSZWNlaXB0QnlBY3Rpb25SZXNwb25zZSByZWNlaXB0SW5mb1xuICByZWNlaXB0SW5mbzogSVJlY2VpcHRJbmZvIHwgdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmcm9tUGJSZWNlaXB0SW5mbyhcbiAgcGJSZWNlaXB0SW5mbzogYXBpUGIuUmVjZWlwdEluZm8gfCB1bmRlZmluZWRcbik6IElSZWNlaXB0SW5mbyB8IHVuZGVmaW5lZCB7XG4gIGlmICghcGJSZWNlaXB0SW5mbykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByZWNlaXB0OiBmcm9tUGJSZWNlaXB0KHBiUmVjZWlwdEluZm8uZ2V0UmVjZWlwdCgpKSxcbiAgICBibGtIYXNoOiBwYlJlY2VpcHRJbmZvLmdldEJsa2hhc2goKVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgR2V0UmVjZWlwdEJ5QWN0aW9uUmVxdWVzdCA9IHtcbiAgdG8ocmVxOiBJR2V0UmVjZWlwdEJ5QWN0aW9uUmVxdWVzdCk6IGFueSB7XG4gICAgY29uc3QgcGJSZXEgPSBuZXcgYXBpUGIuR2V0UmVjZWlwdEJ5QWN0aW9uUmVxdWVzdCgpO1xuICAgIGlmIChyZXEuYWN0aW9uSGFzaCkge1xuICAgICAgcGJSZXEuc2V0QWN0aW9uaGFzaChyZXEuYWN0aW9uSGFzaCk7XG4gICAgfVxuICAgIHJldHVybiBwYlJlcTtcbiAgfSxcblxuICBmcm9tKHBiUmVzOiBHZXRSZWNlaXB0QnlBY3Rpb25SZXNwb25zZSk6IElHZXRSZWNlaXB0QnlBY3Rpb25SZXNwb25zZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlY2VpcHRJbmZvOiBmcm9tUGJSZWNlaXB0SW5mbyhwYlJlcy5nZXRSZWNlaXB0aW5mbygpKVxuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUGJSZWNlaXB0KFxuICBwYlJlY2VpcHQ6IGFjdGlvblBiLlJlY2VpcHQgfCB1bmRlZmluZWRcbik6IElSZWNlaXB0IHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFwYlJlY2VpcHQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiBwYlJlY2VpcHQuZ2V0U3RhdHVzKCksXG4gICAgYmxrSGVpZ2h0OiBwYlJlY2VpcHQuZ2V0QmxraGVpZ2h0KCksXG4gICAgYWN0SGFzaDogcGJSZWNlaXB0LmdldEFjdGhhc2goKSxcbiAgICBnYXNDb25zdW1lZDogcGJSZWNlaXB0LmdldEdhc2NvbnN1bWVkKCksXG4gICAgY29udHJhY3RBZGRyZXNzOiBwYlJlY2VpcHQuZ2V0Q29udHJhY3RhZGRyZXNzKCksXG4gICAgbG9nczogZnJvbVBiTG9nTGlzdChwYlJlY2VpcHQuZ2V0TG9nc0xpc3QoKSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gZnJvbVBiTG9nTGlzdChcbiAgcGJMb2dMaXN0OiBBcnJheTxhY3Rpb25QYi5Mb2c+IHwgdW5kZWZpbmVkXG4pOiBBcnJheTxJTG9nPiB8IHVuZGVmaW5lZCB7XG4gIGlmICghcGJMb2dMaXN0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBjb25zdCByZXMgPSBbXSBhcyBBcnJheTxJTG9nPjtcbiAgZm9yIChjb25zdCBsb2cgb2YgcGJMb2dMaXN0KSB7XG4gICAgcmVzLnB1c2goe1xuICAgICAgY29udHJhY3RBZGRyZXNzOiBsb2cuZ2V0Q29udHJhY3RhZGRyZXNzKCksXG4gICAgICB0b3BpY3M6IGxvZy5nZXRUb3BpY3NMaXN0KCksXG4gICAgICBkYXRhOiBsb2cuZ2V0RGF0YSgpLFxuICAgICAgYmxrSGVpZ2h0OiBsb2cuZ2V0QmxraGVpZ2h0KCksXG4gICAgICBhY3RIYXNoOiBsb2cuZ2V0QWN0aGFzaCgpLFxuICAgICAgaW5kZXg6IGxvZy5nZXRJbmRleCgpXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIFJlYWRDb250cmFjdFJlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElSZWFkQ29udHJhY3RSZXF1ZXN0IHtcbiAgZXhlY3V0aW9uOiBJRXhlY3V0aW9uO1xuICBjYWxsZXJBZGRyZXNzOiBzdHJpbmc7XG59XG5cbi8vIFByb3BlcnRpZXMgb2YgYSBSZWFkQ29udHJhY3RSZXNwb25zZS5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlYWRDb250cmFjdFJlc3BvbnNlIHtcbiAgZGF0YTogc3RyaW5nO1xuICByZWNlaXB0OiBJUmVjZWlwdCB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNvbnN0IFJlYWRDb250cmFjdFJlcXVlc3QgPSB7XG4gIHRvKHJlcTogSVJlYWRDb250cmFjdFJlcXVlc3QpOiBhbnkge1xuICAgIGNvbnN0IHBiUmVxID0gbmV3IGFwaVBiLlJlYWRDb250cmFjdFJlcXVlc3QoKTtcbiAgICBwYlJlcS5zZXRDYWxsZXJhZGRyZXNzKHJlcS5jYWxsZXJBZGRyZXNzKTtcbiAgICBpZiAocmVxLmV4ZWN1dGlvbikge1xuICAgICAgcGJSZXEuc2V0RXhlY3V0aW9uKHRvQWN0aW9uRXhlY3V0aW9uKHJlcS5leGVjdXRpb24pKTtcbiAgICB9XG4gICAgcmV0dXJuIHBiUmVxO1xuICB9LFxuXG4gIGZyb20ocGJSZXM6IGFwaVBiLlJlYWRDb250cmFjdFJlc3BvbnNlKTogSVJlYWRDb250cmFjdFJlc3BvbnNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogcGJSZXMuZ2V0RGF0YSgpLFxuICAgICAgcmVjZWlwdDogZnJvbVBiUmVjZWlwdChwYlJlcy5nZXRSZWNlaXB0KCkpXG4gICAgfTtcbiAgfVxufTtcblxuLy8gUHJvcGVydGllcyBvZiBhIFNlbmRBY3Rpb25SZXF1ZXN0LlxuZXhwb3J0IGludGVyZmFjZSBJU2VuZEFjdGlvblJlcXVlc3Qge1xuICAvLyBTZW5kQWN0aW9uUmVxdWVzdCBhY3Rpb25cbiAgYWN0aW9uOiBJQWN0aW9uO1xufVxuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgU2VuZEFjdGlvblJlc3BvbnNlLlxuZXhwb3J0IGludGVyZmFjZSBJU2VuZEFjdGlvblJlc3BvbnNlIHtcbiAgYWN0aW9uSGFzaDogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgU2VuZEFjdGlvblJlcXVlc3QgPSB7XG4gIHRvKHJlcTogSVNlbmRBY3Rpb25SZXF1ZXN0KTogYW55IHtcbiAgICBjb25zdCBwYlJlcSA9IG5ldyBhcGlQYi5TZW5kQWN0aW9uUmVxdWVzdCgpO1xuICAgIGlmIChyZXEuYWN0aW9uKSB7XG4gICAgICBwYlJlcS5zZXRBY3Rpb24odG9BY3Rpb24ocmVxLmFjdGlvbikpO1xuICAgIH1cbiAgICByZXR1cm4gcGJSZXE7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBTZW5kQWN0aW9uUmVzcG9uc2UgPSB7XG4gIGZyb20ocmVzcDogYXBpUGIuU2VuZEFjdGlvblJlc3BvbnNlKTogSVNlbmRBY3Rpb25SZXNwb25zZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbkhhc2g6IHJlc3AuZ2V0QWN0aW9uaGFzaCgpXG4gICAgfTtcbiAgfVxufTtcblxuLy8gUHJvcGVydGllcyBvZiBhIEVzdGltYXRlR2FzRm9yQWN0aW9uUmVxdWVzdC5cbmV4cG9ydCBpbnRlcmZhY2UgSUVzdGltYXRlR2FzRm9yQWN0aW9uUmVxdWVzdCB7XG4gIGFjdGlvbjogSUFjdGlvbjtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIEVzdGltYXRlR2FzRm9yQWN0aW9uUmVzcG9uc2UuXG5leHBvcnQgaW50ZXJmYWNlIElFc3RpbWF0ZUdhc0ZvckFjdGlvblJlc3BvbnNlIHtcbiAgZ2FzOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBFc3RpbWF0ZUdhc0ZvckFjdGlvblJlcXVlc3QgPSB7XG4gIHRvKHJlcTogSUVzdGltYXRlR2FzRm9yQWN0aW9uUmVxdWVzdCk6IGFueSB7XG4gICAgY29uc3QgcGJSZXEgPSBuZXcgYXBpUGIuRXN0aW1hdGVHYXNGb3JBY3Rpb25SZXF1ZXN0KCk7XG4gICAgaWYgKHJlcS5hY3Rpb24pIHtcbiAgICAgIHBiUmVxLnNldEFjdGlvbih0b0FjdGlvbihyZXEuYWN0aW9uKSk7XG4gICAgfVxuICAgIHJldHVybiBwYlJlcTtcbiAgfSxcbiAgZnJvbShwYlJlczogYW55KTogSUVzdGltYXRlR2FzRm9yQWN0aW9uUmVzcG9uc2Uge1xuICAgIHJldHVybiB7IGdhczogcGJSZXMuZ2V0R2FzKCkgfTtcbiAgfVxufTtcblxuZXhwb3J0IGludGVyZmFjZSBJUmVhZFN0YXRlUmVxdWVzdCB7XG4gIHByb3RvY29sSUQ6IEJ1ZmZlcjtcbiAgbWV0aG9kTmFtZTogQnVmZmVyO1xuICBhcmd1bWVudHM6IEFycmF5PEJ1ZmZlcj47XG4gIGhlaWdodDogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZWFkU3RhdGVSZXNwb25zZSB7XG4gIGRhdGE6IEJ1ZmZlciB8IHt9O1xufVxuXG5leHBvcnQgY29uc3QgUmVhZFN0YXRlUmVxdWVzdCA9IHtcbiAgdG8ocmVxOiBJUmVhZFN0YXRlUmVxdWVzdCk6IGFwaVBiLlJlYWRTdGF0ZVJlcXVlc3Qge1xuICAgIGNvbnN0IHBiUmVxID0gbmV3IGFwaVBiLlJlYWRTdGF0ZVJlcXVlc3QoKTtcbiAgICBwYlJlcS5zZXRQcm90b2NvbGlkKHJlcS5wcm90b2NvbElEKTtcbiAgICBwYlJlcS5zZXRNZXRob2RuYW1lKHJlcS5tZXRob2ROYW1lKTtcbiAgICBwYlJlcS5zZXRBcmd1bWVudHNMaXN0KHJlcS5hcmd1bWVudHMpO1xuICAgIHJldHVybiBwYlJlcTtcbiAgfSxcbiAgZnJvbShwYlJlczogUmVhZFN0YXRlUmVzcG9uc2UpOiBJUmVhZFN0YXRlUmVzcG9uc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBwYlJlcy5nZXREYXRhKClcbiAgICB9O1xuICB9XG59O1xuXG4vLyBQcm9wZXJ0aWVzIG9mIGEgQmxvY2tQcm9kdWNlckluZm8uXG5leHBvcnQgaW50ZXJmYWNlIElCbG9ja1Byb2R1Y2VySW5mbyB7XG4gIC8vIEJsb2NrUHJvZHVjZXJJbmZvIGFkZHJlc3NcbiAgYWRkcmVzczogc3RyaW5nO1xuXG4gIC8vIEJsb2NrUHJvZHVjZXJJbmZvIHZvdGVzXG4gIHZvdGVzOiBzdHJpbmc7XG5cbiAgLy8gQmxvY2tQcm9kdWNlckluZm8gYWN0aXZlXG4gIGFjdGl2ZTogYm9vbGVhbjtcblxuICAvLyBCbG9ja1Byb2R1Y2VySW5mbyBwcm9kdWN0aW9uXG4gIHByb2R1Y3Rpb246IG51bWJlcjtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIEdldEVwb2NoTWV0YVJlcXVlc3QuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRFcG9jaE1ldGFSZXF1ZXN0IHtcbiAgZXBvY2hOdW1iZXI6IG51bWJlcjtcbn1cblxuLy8gUHJvcGVydGllcyBvZiBhIEdldEVwb2NoTWV0YVJlc3BvbnNlLlxuZXhwb3J0IGludGVyZmFjZSBJR2V0RXBvY2hNZXRhUmVzcG9uc2Uge1xuICAvLyBHZXRFcG9jaE1ldGFSZXNwb25zZSBlcG9jaERhdGFcbiAgZXBvY2hEYXRhOiBJRXBvY2hEYXRhO1xuXG4gIC8vIEdldEVwb2NoTWV0YVJlc3BvbnNlIHRvdGFsQmxvY2tzXG4gIHRvdGFsQmxvY2tzOiBudW1iZXI7XG5cbiAgLy8gR2V0RXBvY2hNZXRhUmVzcG9uc2UgYmxvY2tQcm9kdWNlcnNJbmZvXG4gIGJsb2NrUHJvZHVjZXJzSW5mbzogQXJyYXk8SUJsb2NrUHJvZHVjZXJJbmZvPjtcbn1cblxuZXhwb3J0IGNvbnN0IEdldEVwb2NoTWV0YVJlcXVlc3QgPSB7XG4gIHRvKHJlcTogSUdldEVwb2NoTWV0YVJlcXVlc3QpOiBhbnkge1xuICAgIGNvbnN0IHBiUmVxID0gbmV3IGFwaVBiLkdldEVwb2NoTWV0YVJlcXVlc3QoKTtcbiAgICBpZiAocmVxLmVwb2NoTnVtYmVyKSB7XG4gICAgICBwYlJlcS5zZXRFcG9jaG51bWJlcihyZXEuZXBvY2hOdW1iZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcGJSZXE7XG4gIH0sXG4gIGZyb20ocGJSZXM6IGFueSk6IElHZXRFcG9jaE1ldGFSZXNwb25zZSB7XG4gICAgY29uc3QgZXBvY2ggPSBwYlJlcy5nZXRFcG9jaGRhdGEoKTtcbiAgICBjb25zdCBicEluZm8gPSBwYlJlcy5nZXRCbG9ja3Byb2R1Y2Vyc2luZm9MaXN0KCk7XG4gICAgY29uc3QgcmVzID0ge1xuICAgICAgZXBvY2hEYXRhOiB7XG4gICAgICAgIG51bTogZXBvY2guZ2V0TnVtKCksXG4gICAgICAgIGhlaWdodDogZXBvY2guZ2V0SGVpZ2h0KCksXG4gICAgICAgIGdyYXZpdHlDaGFpblN0YXJ0SGVpZ2h0OiBlcG9jaC5nZXRHcmF2aXR5Y2hhaW5zdGFydGhlaWdodCgpXG4gICAgICB9LFxuICAgICAgdG90YWxCbG9ja3M6IHBiUmVzLmdldFRvdGFsYmxvY2tzKCksXG4gICAgICBibG9ja1Byb2R1Y2Vyc0luZm86IGJwSW5mb1xuICAgIH07XG4gICAgaWYgKGJwSW5mbykge1xuICAgICAgY29uc3QgcGFyc2VkQnBpbmZvID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJwSW5mby5sZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJzZWRCcGluZm9baV0gPSB7XG4gICAgICAgICAgYWRkcmVzczogYnBJbmZvW2ldLmdldEFkZHJlc3MoKSxcbiAgICAgICAgICB2b3RlczogYnBJbmZvW2ldLmdldFZvdGVzKCksXG4gICAgICAgICAgYWN0aXZlOiBicEluZm9baV0uZ2V0QWN0aXZlKCksXG4gICAgICAgICAgcHJvZHVjdGlvbjogYnBJbmZvW2ldLmdldFByb2R1Y3Rpb24oKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmVzLmJsb2NrUHJvZHVjZXJzSW5mbyA9IHBhcnNlZEJwaW5mbztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElUb3BpY3Mge1xuICB0b3BpYzogQXJyYXk8QnVmZmVyPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTG9nc0ZpbHRlciB7XG4gIGFkZHJlc3M6IEFycmF5PHN0cmluZz47XG4gIHRvcGljczogQXJyYXk8SVRvcGljcz47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldExvZ3NCeUJsb2NrIHtcbiAgYmxvY2tIYXNoOiBCdWZmZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUdldExvZ3NCeVJhbmdlIHtcbiAgZnJvbUJsb2NrOiBudW1iZXI7XG4gIHRvQmxvY2s6IG51bWJlcjtcbiAgcGFnaW5hdGlvblNpemU6IG51bWJlcjtcbiAgY291bnQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJR2V0TG9nc1JlcXVlc3Qge1xuICBmaWx0ZXI6IElMb2dzRmlsdGVyO1xuICBieUJsb2NrPzogSUdldExvZ3NCeUJsb2NrIHwgdW5kZWZpbmVkO1xuICBieVJhbmdlPzogSUdldExvZ3NCeVJhbmdlIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHZXRMb2dzUmVzcG9uc2Uge1xuICBsb2dzOiBBcnJheTxJTG9nPiB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNvbnN0IEdldExvZ3NSZXF1ZXN0ID0ge1xuICB0byhyZXE6IElHZXRMb2dzUmVxdWVzdCk6IGFueSB7XG4gICAgY29uc3QgcGJSZXEgPSBuZXcgYXBpUGIuR2V0TG9nc1JlcXVlc3QoKTtcbiAgICBpZiAocmVxLmZpbHRlcikge1xuICAgICAgY29uc3QgZmlsdGVyID0gbmV3IGFwaVBiLkxvZ3NGaWx0ZXIoKTtcbiAgICAgIGZpbHRlci5zZXRBZGRyZXNzTGlzdChyZXEuZmlsdGVyLmFkZHJlc3MpO1xuICAgICAgY29uc3QgdG9waWNzID0gW10gYXMgQXJyYXk8VG9waWNzPjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxLmZpbHRlci50b3BpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdG9waWMgPSBuZXcgYXBpUGIuVG9waWNzKCk7XG4gICAgICAgIHRvcGljLnNldFRvcGljTGlzdChyZXEuZmlsdGVyLnRvcGljc1tpXS50b3BpYyk7XG4gICAgICAgIHRvcGljcy5wdXNoKHRvcGljKTtcbiAgICAgIH1cbiAgICAgIGZpbHRlci5zZXRUb3BpY3NMaXN0KHRvcGljcyk7XG4gICAgICBwYlJlcS5zZXRGaWx0ZXIoZmlsdGVyKTtcbiAgICB9XG4gICAgaWYgKHJlcS5ieUJsb2NrKSB7XG4gICAgICBjb25zdCBieUJsb2NrID0gbmV3IGFwaVBiLkdldExvZ3NCeUJsb2NrKCk7XG4gICAgICBieUJsb2NrLnNldEJsb2NraGFzaChyZXEuYnlCbG9jay5ibG9ja0hhc2gpO1xuICAgICAgcGJSZXEuc2V0QnlibG9jayhieUJsb2NrKTtcbiAgICB9XG4gICAgaWYgKHJlcS5ieVJhbmdlKSB7XG4gICAgICBjb25zdCBieVJhbmdlID0gbmV3IGFwaVBiLkdldExvZ3NCeVJhbmdlKCk7XG4gICAgICBieVJhbmdlLnNldEZyb21ibG9jayhyZXEuYnlSYW5nZS5mcm9tQmxvY2spO1xuICAgICAgYnlSYW5nZS5zZXRUb2Jsb2NrKHJlcS5ieVJhbmdlLnRvQmxvY2spO1xuICAgICAgYnlSYW5nZS5zZXRQYWdpbmF0aW9uc2l6ZShyZXEuYnlSYW5nZS5wYWdpbmF0aW9uU2l6ZSk7XG4gICAgICBwYlJlcS5zZXRCeXJhbmdlKGJ5UmFuZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gcGJSZXE7XG4gIH0sXG5cbiAgZnJvbShwYlJlczogR2V0TG9nc1Jlc3BvbnNlKTogSUdldExvZ3NSZXNwb25zZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ3M6IGZyb21QYkxvZ0xpc3QocGJSZXMuZ2V0TG9nc0xpc3QoKSlcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElFc3RpbWF0ZUFjdGlvbkdhc0NvbnN1bXB0aW9uUmVxdWVzdCB7XG4gIHRyYW5zZmVyPzogSVRyYW5zZmVyIHwgdW5kZWZpbmVkO1xuICBleGVjdXRpb24/OiBJRXhlY3V0aW9uIHwgdW5kZWZpbmVkO1xuICBjYWxsZXJBZGRyZXNzOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUVzdGltYXRlQWN0aW9uR2FzQ29uc3VtcHRpb25SZXNwb25zZSB7XG4gIGdhczogbnVtYmVyO1xufVxuXG5leHBvcnQgY29uc3QgRXN0aW1hdGVBY3Rpb25HYXNDb25zdW1wdGlvblJlcXVlc3QgPSB7XG4gIHRvKHJlcTogSUVzdGltYXRlQWN0aW9uR2FzQ29uc3VtcHRpb25SZXF1ZXN0KTogYW55IHtcbiAgICBjb25zdCBwYlJlcSA9IG5ldyBhcGlQYi5Fc3RpbWF0ZUFjdGlvbkdhc0NvbnN1bXB0aW9uUmVxdWVzdCgpO1xuICAgIGlmIChyZXEudHJhbnNmZXIpIHtcbiAgICAgIHBiUmVxLnNldFRyYW5zZmVyKHRvQWN0aW9uVHJhbnNmZXIocmVxLnRyYW5zZmVyKSk7XG4gICAgfVxuICAgIGlmIChyZXEuZXhlY3V0aW9uKSB7XG4gICAgICBwYlJlcS5zZXRFeGVjdXRpb24odG9BY3Rpb25FeGVjdXRpb24ocmVxLmV4ZWN1dGlvbikpO1xuICAgIH1cbiAgICBwYlJlcS5zZXRDYWxsZXJhZGRyZXNzKHJlcS5jYWxsZXJBZGRyZXNzKTtcbiAgICByZXR1cm4gcGJSZXE7XG4gIH0sXG5cbiAgZnJvbShcbiAgICBwYlJlczogYXBpUGIuRXN0aW1hdGVBY3Rpb25HYXNDb25zdW1wdGlvblJlc3BvbnNlXG4gICk6IElFc3RpbWF0ZUFjdGlvbkdhc0NvbnN1bXB0aW9uUmVzcG9uc2Uge1xuICAgIHJldHVybiB7IGdhczogcGJSZXMuZ2V0R2FzKCkgfTtcbiAgfVxufTtcblxuZXhwb3J0IGludGVyZmFjZSBJQmxvY2tIZWFkZXJDb3JlIHtcbiAgdmVyc2lvbjogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgdGltZXN0YW1wOiBJVGltZXN0YW1wIHwgdW5kZWZpbmVkO1xuICBwcmV2QmxvY2tIYXNoOiBCdWZmZXI7XG4gIHR4Um9vdDogQnVmZmVyO1xuICBkZWx0YVN0YXRlRGlnZXN0OiBCdWZmZXI7XG4gIHJlY2VpcHRSb290OiBCdWZmZXI7XG4gIGxvZ3NCbG9vbTogQnVmZmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElCbG9ja0hlYWRlciB7XG4gIGNvcmU6IElCbG9ja0hlYWRlckNvcmUgfCB1bmRlZmluZWQ7XG4gIHByb2R1Y2VyUHVia2V5OiBCdWZmZXI7XG4gIHNpZ25hdHVyZTogQnVmZmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElCbG9ja0JvZHkge1xuICBhY3Rpb25zOiBBcnJheTxJQWN0aW9uPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRW5kb3JzZW1lbnQge1xuICB0aW1lc3RhbXA6IElUaW1lc3RhbXAgfCB1bmRlZmluZWQ7XG4gIGVuZG9yc2VyOiBCdWZmZXI7XG4gIHNpZ25hdHVyZTogQnVmZmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElCbG9ja0Zvb3RlciB7XG4gIGVuZG9yc2VtZW50czogQXJyYXk8SUVuZG9yc2VtZW50PjtcbiAgdGltZXN0YW1wOiBJVGltZXN0YW1wIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElCbG9jayB7XG4gIGhlYWRlcjogSUJsb2NrSGVhZGVyIHwgdW5kZWZpbmVkO1xuICBib2R5OiBJQmxvY2tCb2R5IHwgdW5kZWZpbmVkO1xuICBmb290ZXI6IElCbG9ja0Zvb3RlciB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQmxvY2tJbmZvIHtcbiAgYmxvY2s6IElCbG9jayB8IHVuZGVmaW5lZDtcbiAgcmVjZWlwdHM6IEFycmF5PElSZWNlaXB0Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU3RyZWFtQmxvY2tzUmVxdWVzdCB7fVxuZXhwb3J0IGludGVyZmFjZSBJU3RyZWFtQmxvY2tzUmVzcG9uc2Uge1xuICBibG9jazogSUJsb2NrSW5mbyB8IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZnJvbVBiVGltZXN0YW1wKFxuICB0aW1lc3RhbXA6IFRpbWVzdGFtcCB8IHVuZGVmaW5lZFxuKTogSVRpbWVzdGFtcCB8IHVuZGVmaW5lZCB7XG4gIGlmICh0aW1lc3RhbXApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2Vjb25kczogdGltZXN0YW1wLmdldFNlY29uZHMoKSxcbiAgICAgIG5hbm9zOiB0aW1lc3RhbXAuZ2V0TmFub3MoKVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZnJvbVBiQmxvY2tIZWFkZXJDb3JlKFxuICBibG9ja0hlYWRlckNvcmU6IEJsb2NrSGVhZGVyQ29yZSB8IHVuZGVmaW5lZFxuKTogSUJsb2NrSGVhZGVyQ29yZSB8IHVuZGVmaW5lZCB7XG4gIGlmIChibG9ja0hlYWRlckNvcmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmVyc2lvbjogYmxvY2tIZWFkZXJDb3JlLmdldFZlcnNpb24oKSxcbiAgICAgIGhlaWdodDogYmxvY2tIZWFkZXJDb3JlLmdldEhlaWdodCgpLFxuICAgICAgdGltZXN0YW1wOiBmcm9tUGJUaW1lc3RhbXAoYmxvY2tIZWFkZXJDb3JlLmdldFRpbWVzdGFtcCgpKSxcbiAgICAgIHByZXZCbG9ja0hhc2g6IEJ1ZmZlci5mcm9tKGJsb2NrSGVhZGVyQ29yZS5nZXRQcmV2YmxvY2toYXNoX2FzVTgoKSksXG4gICAgICB0eFJvb3Q6IEJ1ZmZlci5mcm9tKGJsb2NrSGVhZGVyQ29yZS5nZXRUeHJvb3RfYXNVOCgpKSxcbiAgICAgIGRlbHRhU3RhdGVEaWdlc3Q6IEJ1ZmZlci5mcm9tKGJsb2NrSGVhZGVyQ29yZS5nZXREZWx0YXN0YXRlZGlnZXN0X2FzVTgoKSksXG4gICAgICByZWNlaXB0Um9vdDogQnVmZmVyLmZyb20oYmxvY2tIZWFkZXJDb3JlLmdldFJlY2VpcHRyb290X2FzVTgoKSksXG4gICAgICBsb2dzQmxvb206IEJ1ZmZlci5mcm9tKGJsb2NrSGVhZGVyQ29yZS5nZXRMb2dzYmxvb21fYXNVOCgpKVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZnJvbVBiQmxvY2tIZWFkZXIoXG4gIGJsb2NrSGVhZGVyOiBCbG9ja0hlYWRlciB8IHVuZGVmaW5lZFxuKTogSUJsb2NrSGVhZGVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGJsb2NrSGVhZGVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvcmU6IGZyb21QYkJsb2NrSGVhZGVyQ29yZShibG9ja0hlYWRlci5nZXRDb3JlKCkpLFxuICAgICAgcHJvZHVjZXJQdWJrZXk6IEJ1ZmZlci5mcm9tKGJsb2NrSGVhZGVyLmdldFByb2R1Y2VycHVia2V5X2FzVTgoKSksXG4gICAgICBzaWduYXR1cmU6IEJ1ZmZlci5mcm9tKGJsb2NrSGVhZGVyLmdldFNpZ25hdHVyZV9hc1U4KCkpXG4gICAgfTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmcm9tUGJCbG9ja0JvZHkoXG4gIGJsb2NrQm9keTogQmxvY2tCb2R5IHwgdW5kZWZpbmVkXG4pOiBJQmxvY2tCb2R5IHwgdW5kZWZpbmVkIHtcbiAgaWYgKGJsb2NrQm9keSkge1xuICAgIGNvbnN0IHJlcyA9IFtdIGFzIEFycmF5PElBY3Rpb24+O1xuICAgIGZvciAoY29uc3QgcmF3QWN0aW9uIG9mIGJsb2NrQm9keS5nZXRBY3Rpb25zTGlzdCgpKSB7XG4gICAgICBjb25zdCByYXdBY3Rpb25Db3JlID0gcmF3QWN0aW9uLmdldENvcmUoKTtcbiAgICAgIGxldCBhY3Rpb25Db3JlOiBJQWN0aW9uQ29yZSB8IHVuZGVmaW5lZDtcbiAgICAgIGlmIChyYXdBY3Rpb25Db3JlKSB7XG4gICAgICAgIGFjdGlvbkNvcmUgPSB7XG4gICAgICAgICAgdmVyc2lvbjogcmF3QWN0aW9uQ29yZS5nZXRWZXJzaW9uKCksXG4gICAgICAgICAgbm9uY2U6IFN0cmluZyhyYXdBY3Rpb25Db3JlLmdldE5vbmNlKCkpLFxuICAgICAgICAgIGdhc0xpbWl0OiBTdHJpbmcocmF3QWN0aW9uQ29yZS5nZXRHYXNsaW1pdCgpKSxcbiAgICAgICAgICBnYXNQcmljZTogcmF3QWN0aW9uQ29yZS5nZXRHYXNwcmljZSgpLFxuICAgICAgICAgIHRyYW5zZmVyOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tVHJhbnNmZXIocmF3QWN0aW9uQ29yZS5nZXRUcmFuc2ZlcigpKSxcbiAgICAgICAgICBleGVjdXRpb246IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21FeGVjdXRpb24oXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldEV4ZWN1dGlvbigpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBzdGFydFN1YkNoYWluOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tU3RhcnRTdWJDaGFpbihcbiAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0U3RhcnRzdWJjaGFpbigpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBzdG9wU3ViQ2hhaW46IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21TdG9wU3ViQ2hhaW4oXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFN0b3BzdWJjaGFpbigpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBwdXRCbG9jazogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVB1dEJsb2NrKHJhd0FjdGlvbkNvcmUuZ2V0UHV0YmxvY2soKSksXG4gICAgICAgICAgY3JlYXRlRGVwb3NpdDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbUNyZWF0ZURlcG9zaXQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldENyZWF0ZWRlcG9zaXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgc2V0dGxlRGVwb3NpdDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVNldHRsZURlcG9zaXQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFNldHRsZWRlcG9zaXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgY3JlYXRlUGx1bUNoYWluOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tQ3JlYXRlUGx1bUNoYWluKFxuICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRDcmVhdGVwbHVtY2hhaW4oKVxuICAgICAgICAgICksXG4gICAgICAgICAgdGVybWluYXRlUGx1bUNoYWluOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tVGVybWluYXRlUGx1bUNoYWluKFxuICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRUZXJtaW5hdGVwbHVtY2hhaW4oKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bVB1dEJsb2NrOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tUGx1bVB1dEJsb2NrKFxuICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRQbHVtcHV0YmxvY2soKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bUNyZWF0ZURlcG9zaXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21QbHVtQ3JlYXRlRGVwb3NpdChcbiAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UGx1bWNyZWF0ZWRlcG9zaXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bVN0YXJ0RXhpdDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVBsdW1TdGFydEV4aXQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFBsdW1zdGFydGV4aXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bUNoYWxsZW5nZUV4aXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21QbHVtQ2hhbGxlbmdlRXhpdChcbiAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UGx1bWNoYWxsZW5nZWV4aXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bVJlc3BvbnNlQ2hhbGxlbmdlRXhpdDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVBsdW1SZXNwb25zZUNoYWxsZW5nZUV4aXQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFBsdW1yZXNwb25zZWNoYWxsZW5nZWV4aXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bUZpbmFsaXplRXhpdDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbVBsdW1GaW5hbGl6ZUV4aXQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldFBsdW1maW5hbGl6ZWV4aXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bVNldHRsZURlcG9zaXQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21QbHVtU2V0dGxlRGVwb3NpdChcbiAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UGx1bXNldHRsZWRlcG9zaXQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcGx1bVRyYW5zZmVyOiBHZXRBY3Rpb25zUmVxdWVzdC5mcm9tUGx1bVRyYW5zZmVyKFxuICAgICAgICAgICAgcmF3QWN0aW9uQ29yZS5nZXRQbHVtdHJhbnNmZXIoKVxuICAgICAgICAgICksXG4gICAgICAgICAgZGVwb3NpdFRvUmV3YXJkaW5nRnVuZDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbURlcG9zaXRUb1Jld2FyZGluZ0Z1bmQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldERlcG9zaXR0b3Jld2FyZGluZ2Z1bmQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgY2xhaW1Gcm9tUmV3YXJkaW5nRnVuZDogR2V0QWN0aW9uc1JlcXVlc3QuZnJvbUNsYWltRnJvbVJld2FyZGluZ0Z1bmQoXG4gICAgICAgICAgICByYXdBY3Rpb25Db3JlLmdldENsYWltZnJvbXJld2FyZGluZ2Z1bmQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgZ3JhbnRSZXdhcmQ6IEdldEFjdGlvbnNSZXF1ZXN0LmZyb21HcmFudFJld2FyZChcbiAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0R3JhbnRyZXdhcmQoKVxuICAgICAgICAgICksXG4gICAgICAgICAgcHV0UG9sbFJlc3VsdDogR2V0QWN0aW9uc1JlcXVlc3QuZ2V0UHV0UG9sbFJlc3VsdChcbiAgICAgICAgICAgIHJhd0FjdGlvbkNvcmUuZ2V0UHV0cG9sbHJlc3VsdCgpXG4gICAgICAgICAgKVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhY3Rpb24gPSB7XG4gICAgICAgIGNvcmU6IGFjdGlvbkNvcmUsXG4gICAgICAgIHNlbmRlclB1YktleTogcmF3QWN0aW9uLmdldFNlbmRlcnB1YmtleSgpLFxuICAgICAgICBzaWduYXR1cmU6IHJhd0FjdGlvbi5nZXRTaWduYXR1cmUoKVxuICAgICAgfTtcbiAgICAgIHJlcy5wdXNoKGFjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbnM6IHJlc1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZnJvbVBiRW5kb3JzZW1lbnRzKFxuICBlbmRvcnNlbWVudHM6IEFycmF5PEVuZG9yc2VtZW50PlxuKTogQXJyYXk8SUVuZG9yc2VtZW50PiB7XG4gIGNvbnN0IHJlcyA9IFtdIGFzIEFycmF5PElFbmRvcnNlbWVudD47XG4gIGZvciAoY29uc3QgZW5kb3JzZW1lbnQgb2YgZW5kb3JzZW1lbnRzKSB7XG4gICAgcmVzLnB1c2goe1xuICAgICAgdGltZXN0YW1wOiBmcm9tUGJUaW1lc3RhbXAoZW5kb3JzZW1lbnQuZ2V0VGltZXN0YW1wKCkpLFxuICAgICAgZW5kb3JzZXI6IEJ1ZmZlci5mcm9tKGVuZG9yc2VtZW50LmdldEVuZG9yc2VyX2FzVTgoKSksXG4gICAgICBzaWduYXR1cmU6IEJ1ZmZlci5mcm9tKGVuZG9yc2VtZW50LmdldFNpZ25hdHVyZV9hc1U4KCkpXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gZnJvbVBiQmxvY2tGb290ZXIoXG4gIGJsb2NrRm9vdGVyOiBCbG9ja0Zvb3RlciB8IHVuZGVmaW5lZFxuKTogSUJsb2NrRm9vdGVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGJsb2NrRm9vdGVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVuZG9yc2VtZW50czogZnJvbVBiRW5kb3JzZW1lbnRzKGJsb2NrRm9vdGVyLmdldEVuZG9yc2VtZW50c0xpc3QoKSksXG4gICAgICB0aW1lc3RhbXA6IGZyb21QYlRpbWVzdGFtcChibG9ja0Zvb3Rlci5nZXRUaW1lc3RhbXAoKSlcbiAgICB9O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZyb21QYkJsb2NrKGJsb2NrOiBCbG9jayB8IHVuZGVmaW5lZCk6IElCbG9jayB8IHVuZGVmaW5lZCB7XG4gIGlmIChibG9jaykge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXI6IGZyb21QYkJsb2NrSGVhZGVyKGJsb2NrLmdldEhlYWRlcigpKSxcbiAgICAgIGJvZHk6IGZyb21QYkJsb2NrQm9keShibG9jay5nZXRCb2R5KCkpLFxuICAgICAgZm9vdGVyOiBmcm9tUGJCbG9ja0Zvb3RlcihibG9jay5nZXRGb290ZXIoKSlcbiAgICB9O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZyb21QYlJlY2VpcHRzKHJlY2VpcHRzOiBBcnJheTxSZWNlaXB0Pik6IEFycmF5PElSZWNlaXB0PiB7XG4gIGNvbnN0IHJlcyA9IFtdIGFzIEFycmF5PElSZWNlaXB0PjtcbiAgZm9yIChjb25zdCByZWNlaXB0IG9mIHJlY2VpcHRzKSB7XG4gICAgcmVzLnB1c2goe1xuICAgICAgc3RhdHVzOiByZWNlaXB0LmdldFN0YXR1cygpLFxuICAgICAgYmxrSGVpZ2h0OiByZWNlaXB0LmdldEJsa2hlaWdodCgpLFxuICAgICAgYWN0SGFzaDogcmVjZWlwdC5nZXRBY3RoYXNoKCksXG4gICAgICBnYXNDb25zdW1lZDogcmVjZWlwdC5nZXRHYXNjb25zdW1lZCgpLFxuICAgICAgY29udHJhY3RBZGRyZXNzOiByZWNlaXB0LmdldENvbnRyYWN0YWRkcmVzcygpLFxuICAgICAgbG9nczogZnJvbVBiTG9nTGlzdChyZWNlaXB0LmdldExvZ3NMaXN0KCkpXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gZnJvbVBiQmxvY2tJbmZvKFxuICBibG9ja0luZm86IEJsb2NrSW5mbyB8IHVuZGVmaW5lZFxuKTogSUJsb2NrSW5mbyB8IHVuZGVmaW5lZCB7XG4gIGlmIChibG9ja0luZm8pIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmxvY2s6IGZyb21QYkJsb2NrKGJsb2NrSW5mby5nZXRCbG9jaygpKSxcbiAgICAgIHJlY2VpcHRzOiBmcm9tUGJSZWNlaXB0cyhibG9ja0luZm8uZ2V0UmVjZWlwdHNMaXN0KCkpXG4gICAgfTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY29uc3QgU3RyZWFtQmxvY2tzUmVxdWVzdCA9IHtcbiAgLy8gQHRzLWlnbm9yZVxuICB0byhyZXE6IElTdHJlYW1CbG9ja3NSZXF1ZXN0KTogYW55IHtcbiAgICByZXR1cm4gbmV3IGFwaVBiLlN0cmVhbUJsb2Nrc1JlcXVlc3QoKTtcbiAgfSxcblxuICBmcm9tKHBiUmVzOiBhcGlQYi5TdHJlYW1CbG9ja3NSZXNwb25zZSk6IElTdHJlYW1CbG9ja3NSZXNwb25zZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJsb2NrOiBmcm9tUGJCbG9ja0luZm8ocGJSZXMuZ2V0QmxvY2soKSlcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElTdHJlYW1Mb2dzUmVxdWVzdCB7XG4gIGZpbHRlcjogSUxvZ3NGaWx0ZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIElTdHJlYW1Mb2dzUmVzcG9uc2Uge1xuICBsb2c6IElMb2cgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjb25zdCBTdHJlYW1Mb2dzUmVxdWVzdCA9IHtcbiAgLy8gQHRzLWlnbm9yZVxuICB0byhyZXE6IElTdHJlYW1Mb2dzUmVxdWVzdCk6IGFueSB7XG4gICAgY29uc3QgcGJSZXEgPSBuZXcgYXBpUGIuU3RyZWFtTG9nc1JlcXVlc3QoKTtcbiAgICBpZiAocmVxLmZpbHRlcikge1xuICAgICAgY29uc3QgZmlsdGVyID0gbmV3IGFwaVBiLkxvZ3NGaWx0ZXIoKTtcbiAgICAgIGZpbHRlci5zZXRBZGRyZXNzTGlzdChyZXEuZmlsdGVyLmFkZHJlc3MpO1xuICAgICAgY29uc3QgdG9waWNzID0gW10gYXMgQXJyYXk8VG9waWNzPjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxLmZpbHRlci50b3BpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdG9waWMgPSBuZXcgYXBpUGIuVG9waWNzKCk7XG4gICAgICAgIHRvcGljLnNldFRvcGljTGlzdChyZXEuZmlsdGVyLnRvcGljc1tpXS50b3BpYyk7XG4gICAgICAgIHRvcGljcy5wdXNoKHRvcGljKTtcbiAgICAgIH1cbiAgICAgIGZpbHRlci5zZXRUb3BpY3NMaXN0KHRvcGljcyk7XG4gICAgICBwYlJlcS5zZXRGaWx0ZXIoZmlsdGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHBiUmVxO1xuICB9LFxuXG4gIGZyb21QYkxvZyhsb2c6IExvZyB8IHVuZGVmaW5lZCk6IElMb2cgfCB1bmRlZmluZWQge1xuICAgIGlmIChsb2cpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbnRyYWN0QWRkcmVzczogbG9nLmdldENvbnRyYWN0YWRkcmVzcygpLFxuICAgICAgICB0b3BpY3M6IGxvZy5nZXRUb3BpY3NMaXN0KCksXG4gICAgICAgIGRhdGE6IGxvZy5nZXREYXRhKCksXG4gICAgICAgIGJsa0hlaWdodDogbG9nLmdldEJsa2hlaWdodCgpLFxuICAgICAgICBhY3RIYXNoOiBsb2cuZ2V0QWN0aGFzaCgpLFxuICAgICAgICBpbmRleDogbG9nLmdldEluZGV4KClcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgZnJvbShwYlJlczogYXBpUGIuU3RyZWFtTG9nc1Jlc3BvbnNlKTogSVN0cmVhbUxvZ3NSZXNwb25zZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZzogU3RyZWFtTG9nc1JlcXVlc3QuZnJvbVBiTG9nKHBiUmVzLmdldExvZygpKVxuICAgIH07XG4gIH1cbn07XG5cbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50UmVhZGFibGVTdHJlYW08UmVzcG9uc2U+IHtcbiAgb24oXG4gICAgdHlwZTogXCJlcnJvclwiLFxuICAgIGNhbGxiYWNrOiAoZXJyOiBFcnJvcikgPT4gdm9pZFxuICApOiBDbGllbnRSZWFkYWJsZVN0cmVhbTxSZXNwb25zZT47XG4gIG9uKFxuICAgIHR5cGU6IFwic3RhdHVzXCIsXG4gICAgY2FsbGJhY2s6IChzdGF0dXM6IGFueSkgPT4gdm9pZFxuICApOiBDbGllbnRSZWFkYWJsZVN0cmVhbTxSZXNwb25zZT47XG4gIG9uKFxuICAgIHR5cGU6IFwiZGF0YVwiLFxuICAgIGNhbGxiYWNrOiAocmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB2b2lkXG4gICk6IENsaWVudFJlYWRhYmxlU3RyZWFtPFJlc3BvbnNlPjtcbiAgb24odHlwZTogXCJlbmRcIiwgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBDbGllbnRSZWFkYWJsZVN0cmVhbTxSZXNwb25zZT47XG4gIGNhbmNlbCgpOiB2b2lkO1xufVxuXG4vLyBAdHMtaWdub3JlXG5leHBvcnQgY2xhc3MgQ2xpZW50UmVhZGFibGVTdHJlYW08UmVzcG9uc2U+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBvcmlnaW46IGdycGNXZWIuQ2xpZW50UmVhZGFibGVTdHJlYW08YW55PjtcblxuICBjb25zdHJ1Y3RvcihvcmlnaW46IGdycGNXZWIuQ2xpZW50UmVhZGFibGVTdHJlYW08YW55PiwgdHlwZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgIG9yaWdpbi5vbihcImVycm9yXCIsIChlcnI6IGFueSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZXJyKTtcbiAgICB9KTtcbiAgICBvcmlnaW4ub24oXCJzdGF0dXNcIiwgKHN0YXR1czogYW55KSA9PiB7XG4gICAgICB0aGlzLmVtaXQoXCJzdGF0dXNcIiwgc3RhdHVzKTtcbiAgICB9KTtcbiAgICBvcmlnaW4ub24oXCJkYXRhXCIsIChyZXNwb25zZTogUmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICh0eXBlID09PSBcIlN0cmVhbUJsb2Nrc1wiKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5lbWl0KFwiZGF0YVwiLCBTdHJlYW1CbG9ja3NSZXF1ZXN0LmZyb20ocmVzcG9uc2UpKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSBcIlN0cmVhbUxvZ3NcIikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuZW1pdChcImRhdGFcIiwgU3RyZWFtTG9nc1JlcXVlc3QuZnJvbShyZXNwb25zZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9yaWdpbi5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoXCJlbmRcIik7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMub3JpZ2luLmNhbmNlbCgpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBJUmVhZFN0YWtpbmdEYXRhTWV0aG9kVG9CdWZmZXIgPSAoXG4gIHJlcTogSVJlYWRTdGFraW5nRGF0YU1ldGhvZFxuKTogQnVmZmVyID0+IHtcbiAgY29uc3QgcGJPYmogPSBuZXcgUmVhZFN0YWtpbmdEYXRhTWV0aG9kKCk7XG4gIHN3aXRjaCAocmVxLm1ldGhvZC52YWx1ZU9mKCkpIHtcbiAgICBjYXNlIFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLklOVkFMSUQudmFsdWVPZigpOlxuICAgICAgcGJPYmouc2V0TWV0aG9kKFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLklOVkFMSUQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5CVUNLRVRTLnZhbHVlT2YoKTpcbiAgICAgIHBiT2JqLnNldE1ldGhvZChSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5CVUNLRVRTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgUmVhZFN0YWtpbmdEYXRhTWV0aG9kLk5hbWUuQlVDS0VUU19CWV9WT1RFUi52YWx1ZU9mKCk6XG4gICAgICBwYk9iai5zZXRNZXRob2QoUmVhZFN0YWtpbmdEYXRhTWV0aG9kLk5hbWUuQlVDS0VUU19CWV9WT1RFUik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkJVQ0tFVFNfQllfQ0FORElEQVRFLnZhbHVlT2YoKTpcbiAgICAgIHBiT2JqLnNldE1ldGhvZChSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5CVUNLRVRTX0JZX0NBTkRJREFURSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkNBTkRJREFURVMudmFsdWVPZigpOlxuICAgICAgcGJPYmouc2V0TWV0aG9kKFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkNBTkRJREFURVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5DQU5ESURBVEVfQllfTkFNRS52YWx1ZU9mKCk6XG4gICAgICBwYk9iai5zZXRNZXRob2QoUmVhZFN0YWtpbmdEYXRhTWV0aG9kLk5hbWUuQ0FORElEQVRFX0JZX05BTUUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5CVUNLRVRTX0JZX0lOREVYRVMudmFsdWVPZigpOlxuICAgICAgcGJPYmouc2V0TWV0aG9kKFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkJVQ0tFVFNfQllfSU5ERVhFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkNBTkRJREFURV9CWV9BRERSRVNTLnZhbHVlT2YoKTpcbiAgICAgIHBiT2JqLnNldE1ldGhvZChSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5DQU5ESURBVEVfQllfQUREUkVTUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLlRPVEFMX1NUQUtJTkdfQU1PVU5ULnZhbHVlT2YoKTpcbiAgICAgIHBiT2JqLnNldE1ldGhvZChSZWFkU3Rha2luZ0RhdGFNZXRob2QuTmFtZS5UT1RBTF9TVEFLSU5HX0FNT1VOVCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkJVQ0tFVFNfQ09VTlQudmFsdWVPZigpOlxuICAgICAgcGJPYmouc2V0TWV0aG9kKFJlYWRTdGFraW5nRGF0YU1ldGhvZC5OYW1lLkJVQ0tFVFNfQ09VTlQpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93IG1ldGhvZCAke3JlcS5tZXRob2R9YCk7XG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHBiT2JqLnNlcmlhbGl6ZUJpbmFyeSgpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBJUmVhZFN0YWtpbmdEYXRhUmVxdWVzdFRvQnVmZmVyID0gKFxuICByZXE6IElSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0XG4pOiBCdWZmZXIgPT4ge1xuICBjb25zdCBwYk9iaiA9IG5ldyBSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0KCk7XG4gIGlmIChyZXEuYnVja2V0cykge1xuICAgIGNvbnN0IGJ1Y2tldHMgPSBuZXcgUmVhZFN0YWtpbmdEYXRhUmVxdWVzdC5Wb3RlQnVja2V0cygpO1xuICAgIGNvbnN0IHBhZ2luYXRpb24gPSBuZXcgUGFnaW5hdGlvblBhcmFtKCk7XG4gICAgcGFnaW5hdGlvbi5zZXRPZmZzZXQocmVxLmJ1Y2tldHMucGFnaW5hdGlvbi5vZmZzZXQpO1xuICAgIHBhZ2luYXRpb24uc2V0TGltaXQocmVxLmJ1Y2tldHMucGFnaW5hdGlvbi5saW1pdCk7XG4gICAgYnVja2V0cy5zZXRQYWdpbmF0aW9uKHBhZ2luYXRpb24pO1xuICAgIHBiT2JqLnNldEJ1Y2tldHMoYnVja2V0cyk7XG4gIH1cbiAgaWYgKHJlcS5idWNrZXRzQnlWb3Rlcikge1xuICAgIGNvbnN0IGJ1Y2tldHNCeVZvdGVyID0gbmV3IFJlYWRTdGFraW5nRGF0YVJlcXVlc3QuVm90ZUJ1Y2tldHNCeVZvdGVyKCk7XG4gICAgY29uc3QgcGFnaW5hdGlvbiA9IG5ldyBQYWdpbmF0aW9uUGFyYW0oKTtcbiAgICBwYWdpbmF0aW9uLnNldE9mZnNldChyZXEuYnVja2V0c0J5Vm90ZXIucGFnaW5hdGlvbi5vZmZzZXQpO1xuICAgIHBhZ2luYXRpb24uc2V0TGltaXQocmVxLmJ1Y2tldHNCeVZvdGVyLnBhZ2luYXRpb24ubGltaXQpO1xuICAgIGJ1Y2tldHNCeVZvdGVyLnNldFBhZ2luYXRpb24ocGFnaW5hdGlvbik7XG4gICAgYnVja2V0c0J5Vm90ZXIuc2V0Vm90ZXJhZGRyZXNzKHJlcS5idWNrZXRzQnlWb3Rlci52b3RlckFkZHJlc3MpO1xuICAgIHBiT2JqLnNldEJ1Y2tldHNieXZvdGVyKGJ1Y2tldHNCeVZvdGVyKTtcbiAgfVxuICBpZiAocmVxLmJ1Y2tldHNCeUNhbmRpZGF0ZSkge1xuICAgIGNvbnN0IGJ1Y2tldHNCeUNhbmRpZGF0ZSA9IG5ldyBSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0LlZvdGVCdWNrZXRzQnlDYW5kaWRhdGUoKTtcbiAgICBjb25zdCBwYWdpbmF0aW9uID0gbmV3IFBhZ2luYXRpb25QYXJhbSgpO1xuICAgIHBhZ2luYXRpb24uc2V0T2Zmc2V0KHJlcS5idWNrZXRzQnlDYW5kaWRhdGUucGFnaW5hdGlvbi5vZmZzZXQpO1xuICAgIHBhZ2luYXRpb24uc2V0TGltaXQocmVxLmJ1Y2tldHNCeUNhbmRpZGF0ZS5wYWdpbmF0aW9uLmxpbWl0KTtcbiAgICBidWNrZXRzQnlDYW5kaWRhdGUuc2V0UGFnaW5hdGlvbihwYWdpbmF0aW9uKTtcbiAgICBidWNrZXRzQnlDYW5kaWRhdGUuc2V0Q2FuZG5hbWUocmVxLmJ1Y2tldHNCeUNhbmRpZGF0ZS5jYW5kTmFtZSk7XG4gICAgcGJPYmouc2V0QnVja2V0c2J5Y2FuZGlkYXRlKGJ1Y2tldHNCeUNhbmRpZGF0ZSk7XG4gIH1cbiAgaWYgKHJlcS5jYW5kaWRhdGVzKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IG5ldyBSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0LkNhbmRpZGF0ZXMoKTtcbiAgICBjb25zdCBwYWdpbmF0aW9uID0gbmV3IFBhZ2luYXRpb25QYXJhbSgpO1xuICAgIHBhZ2luYXRpb24uc2V0T2Zmc2V0KHJlcS5jYW5kaWRhdGVzLnBhZ2luYXRpb24ub2Zmc2V0KTtcbiAgICBwYWdpbmF0aW9uLnNldExpbWl0KHJlcS5jYW5kaWRhdGVzLnBhZ2luYXRpb24ubGltaXQpO1xuICAgIGNhbmRpZGF0ZXMuc2V0UGFnaW5hdGlvbihwYWdpbmF0aW9uKTtcbiAgICBwYk9iai5zZXRDYW5kaWRhdGVzKGNhbmRpZGF0ZXMpO1xuICB9XG4gIGlmIChyZXEuY2FuZGlkYXRlQnlOYW1lKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlQnlOYW1lID0gbmV3IFJlYWRTdGFraW5nRGF0YVJlcXVlc3QuQ2FuZGlkYXRlQnlOYW1lKCk7XG4gICAgY2FuZGlkYXRlQnlOYW1lLnNldENhbmRuYW1lKHJlcS5jYW5kaWRhdGVCeU5hbWUuY2FuZE5hbWUpO1xuICAgIHBiT2JqLnNldENhbmRpZGF0ZWJ5bmFtZShjYW5kaWRhdGVCeU5hbWUpO1xuICB9XG4gIGlmIChyZXEuYnVja2V0c0J5SW5kZXhlcykge1xuICAgIGNvbnN0IGJ1Y2tldHNCeUluZGV4ZXMgPSBuZXcgUmVhZFN0YWtpbmdEYXRhUmVxdWVzdC5Wb3RlQnVja2V0c0J5SW5kZXhlcygpO1xuICAgIGJ1Y2tldHNCeUluZGV4ZXMuc2V0SW5kZXhMaXN0KHJlcS5idWNrZXRzQnlJbmRleGVzLmluZGV4KTtcbiAgICBwYk9iai5zZXRCdWNrZXRzYnlpbmRleGVzKGJ1Y2tldHNCeUluZGV4ZXMpO1xuICB9XG4gIGlmIChyZXEuY2FuZGlkYXRlQnlBZGRyZXNzKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlQnlBZGRyZXNzID0gbmV3IFJlYWRTdGFraW5nRGF0YVJlcXVlc3QuQ2FuZGlkYXRlQnlBZGRyZXNzKCk7XG4gICAgY2FuZGlkYXRlQnlBZGRyZXNzLnNldE93bmVyYWRkcihyZXEuY2FuZGlkYXRlQnlBZGRyZXNzLm93bmVyQWRkcik7XG4gICAgcGJPYmouc2V0Q2FuZGlkYXRlYnlhZGRyZXNzKGNhbmRpZGF0ZUJ5QWRkcmVzcyk7XG4gIH1cbiAgaWYgKHJlcS50b3RhbFN0YWtpbmdBbW91bnQpIHtcbiAgICBjb25zdCB0b3RhbFN0YWtpbmdBbW91bnQgPSBuZXcgUmVhZFN0YWtpbmdEYXRhUmVxdWVzdC5Ub3RhbFN0YWtpbmdBbW91bnQoKTtcbiAgICBwYk9iai5zZXRUb3RhbHN0YWtpbmdhbW91bnQodG90YWxTdGFraW5nQW1vdW50KTtcbiAgfVxuICBpZiAocmVxLmJ1Y2tldHNDb3VudCkge1xuICAgIGNvbnN0IGJ1Y2tldHNDb3VudCA9IG5ldyBSZWFkU3Rha2luZ0RhdGFSZXF1ZXN0LkJ1Y2tldHNDb3VudCgpO1xuICAgIHBiT2JqLnNldEJ1Y2tldHNjb3VudChidWNrZXRzQ291bnQpO1xuICB9XG4gIHJldHVybiBCdWZmZXIuZnJvbShwYk9iai5zZXJpYWxpemVCaW5hcnkoKSk7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElScGNNZXRob2Qge1xuICBzZXRQcm92aWRlcihwcm92aWRlcjogc3RyaW5nIHwgSVJwY01ldGhvZCk6IHZvaWQ7XG5cbiAgZ2V0QWNjb3VudChyZXE6IElHZXRBY2NvdW50UmVxdWVzdCk6IFByb21pc2U8SUdldEFjY291bnRSZXNwb25zZT47XG5cbiAgZ2V0QmxvY2tNZXRhcyhyZXE6IElHZXRCbG9ja01ldGFzUmVxdWVzdCk6IFByb21pc2U8SUdldEJsb2NrTWV0YXNSZXNwb25zZT47XG5cbiAgZ2V0Q2hhaW5NZXRhKHJlcTogSUdldENoYWluTWV0YVJlcXVlc3QpOiBQcm9taXNlPElHZXRDaGFpbk1ldGFSZXNwb25zZT47XG5cbiAgZ2V0U2VydmVyTWV0YShyZXE6IElHZXRTZXJ2ZXJNZXRhUmVxdWVzdCk6IFByb21pc2U8SUdldFNlcnZlck1ldGFSZXNwb25zZT47XG5cbiAgZ2V0QWN0aW9ucyhyZXE6IElHZXRBY3Rpb25zUmVxdWVzdCk6IFByb21pc2U8SUdldEFjdGlvbnNSZXNwb25zZT47XG5cbiAgc3VnZ2VzdEdhc1ByaWNlKFxuICAgIHJlcTogSVN1Z2dlc3RHYXNQcmljZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxJU3VnZ2VzdEdhc1ByaWNlUmVzcG9uc2U+O1xuXG4gIGdldFJlY2VpcHRCeUFjdGlvbihcbiAgICByZXE6IElHZXRSZWNlaXB0QnlBY3Rpb25SZXF1ZXN0XG4gICk6IFByb21pc2U8SUdldFJlY2VpcHRCeUFjdGlvblJlc3BvbnNlPjtcblxuICByZWFkQ29udHJhY3QocmVxOiBJUmVhZENvbnRyYWN0UmVxdWVzdCk6IFByb21pc2U8SVJlYWRDb250cmFjdFJlc3BvbnNlPjtcblxuICBzZW5kQWN0aW9uKHJlcTogSVNlbmRBY3Rpb25SZXF1ZXN0KTogUHJvbWlzZTxJU2VuZEFjdGlvblJlc3BvbnNlPjtcbiAgcmVhZFN0YXRlKHJlcTogSVJlYWRTdGF0ZVJlcXVlc3QpOiBQcm9taXNlPElSZWFkU3RhdGVSZXNwb25zZT47XG4gIGVzdGltYXRlR2FzRm9yQWN0aW9uKFxuICAgIHJlcTogSUVzdGltYXRlR2FzRm9yQWN0aW9uUmVxdWVzdFxuICApOiBQcm9taXNlPElFc3RpbWF0ZUdhc0ZvckFjdGlvblJlc3BvbnNlPjtcblxuICBnZXRFcG9jaE1ldGEocmVxOiBJR2V0RXBvY2hNZXRhUmVxdWVzdCk6IFByb21pc2U8SUdldEVwb2NoTWV0YVJlc3BvbnNlPjtcblxuICBnZXRMb2dzKHJlcTogSUdldExvZ3NSZXF1ZXN0KTogUHJvbWlzZTxJR2V0TG9nc1Jlc3BvbnNlPjtcblxuICBlc3RpbWF0ZUFjdGlvbkdhc0NvbnN1bXB0aW9uKFxuICAgIHJlcTogSUVzdGltYXRlQWN0aW9uR2FzQ29uc3VtcHRpb25SZXF1ZXN0XG4gICk6IFByb21pc2U8SUVzdGltYXRlQWN0aW9uR2FzQ29uc3VtcHRpb25SZXNwb25zZT47XG5cbiAgc3RyZWFtQmxvY2tzKFxuICAgIHJlcTogSVN0cmVhbUJsb2Nrc1JlcXVlc3RcbiAgKTogQ2xpZW50UmVhZGFibGVTdHJlYW08SVN0cmVhbUJsb2Nrc1Jlc3BvbnNlPjtcblxuICBzdHJlYW1Mb2dzKFxuICAgIHJlcTogSVN0cmVhbUxvZ3NSZXF1ZXN0XG4gICk6IENsaWVudFJlYWRhYmxlU3RyZWFtPElTdHJlYW1Mb2dzUmVzcG9uc2U+O1xufVxuIl19