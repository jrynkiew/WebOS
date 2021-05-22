"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CandidateUpdateMethod = exports.CandidateRegisterMethod = exports.StakeTransferOwnershipMethod = exports.StakeChangeCandidateMethod = exports.StakeRestakeMethod = exports.StakeAddDepositMethod = exports.StakeWithdrawMethod = exports.StakeUnstakeMethod = exports.StakeCreateMethod = exports.ClaimFromRewardingFundMethod = exports.ExecutionMethod = exports.TransferMethod = exports.AbstractMethod = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _envelop = require("./envelop");

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AbstractMethod {
  constructor(client, account, opts) {
    _defineProperty(this, "client", void 0);

    _defineProperty(this, "account", void 0);

    _defineProperty(this, "signer", void 0);

    this.client = client;
    this.account = account;
    this.signer = opts && opts.signer;
  }

  async baseEnvelop(gasLimit, gasPrice) {
    let nonce = "";

    if (this.account && this.account.address) {
      const meta = await this.client.getAccount({
        address: this.account.address
      });
      nonce = String(meta.accountMeta && meta.accountMeta.pendingNonce || "");
    }

    return new _envelop.Envelop(1, nonce, gasLimit, gasPrice);
  }

  async signAction(envelop) {
    if (!envelop.gasPrice) {
      const price = await this.client.suggestGasPrice({});
      envelop.gasPrice = String(price.gasPrice);
    }

    if (!envelop.gasLimit) {
      const limit = await this.client.estimateActionGasConsumption({
        transfer: envelop.transfer,
        execution: envelop.execution,
        callerAddress: this.account.address
      });
      envelop.gasLimit = limit.gas.toString();
    }

    if (this.account && this.account.address) {
      const meta = await this.client.getAccount({
        address: this.account.address
      });

      if (meta.accountMeta && meta.accountMeta.balance) {
        const gasPrice = new _bignumber.default(envelop.gasPrice);
        const gasLimit = new _bignumber.default(envelop.gasLimit);
        const balance = new _bignumber.default(meta.accountMeta.balance);

        if (envelop.transfer) {
          const amount = new _bignumber.default(envelop.transfer.amount);

          if (balance.comparedTo(amount.plus(gasPrice.multipliedBy(gasLimit))) < 0) {
            throw new _types.ActionError(_types.ActionErrorCode.ErrBalance, "Insufficient funds for gas * price + amount");
          }
        }

        if (envelop.execution) {
          const amount = new _bignumber.default(envelop.execution.amount);

          if (balance.comparedTo(amount.plus(gasPrice.multipliedBy(gasLimit))) < 0) {
            throw new _types.ActionError(_types.ActionErrorCode.ErrBalance, "Insufficient funds for gas * price + amount");
          }
        }
      }
    }

    return _envelop.SealedEnvelop.sign(this.account.privateKey, this.account.publicKey, envelop);
  }

  async sendAction(envelop) {
    const opts = {
      address: ""
    };

    if (this.account && this.account.address) {
      opts.address = this.account.address;
    }

    if (this.signer && this.signer.signAndSend) {
      return this.signer.signAndSend(envelop, opts);
    }

    let selp;

    if (this.signer && this.signer.signOnly) {
      selp = await this.signer.signOnly(envelop, opts);
    } else {
      selp = await this.signAction(envelop);
    }

    try {
      await this.client.sendAction({
        action: selp.action()
      });
    } catch (e) {
      let code = _types.ActionErrorCode.ErrUnknown;
      let message = `send action error: ${JSON.stringify(e)}`;

      if (e.details) {
        message = e.details;

        if (e.details.match(/^reject existed action .*/)) {
          code = _types.ActionErrorCode.ErrExistedAction;
        } else if (e.details.match(/^insufficient balance .*/)) {
          code = _types.ActionErrorCode.ErrBalance;
        } else if (e.details.match(/.* lower than minimal gas price threshold$/)) {
          code = _types.ActionErrorCode.ErrGasPrice;
        } else if (e.details === "action source address is blacklisted") {
          code = _types.ActionErrorCode.ErrAddress;
        } else if (e.details.indexOf("nonce") >= 0) {
          code = _types.ActionErrorCode.ErrNonce;
        }
      }

      throw new _types.ActionError(code, message);
    }

    return selp.hash();
  }

}

exports.AbstractMethod = AbstractMethod;

class TransferMethod extends AbstractMethod {
  constructor(client, account, transfer, opts) {
    super(client, account, opts);

    _defineProperty(this, "transfer", void 0);

    this.transfer = transfer;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.transfer.gasLimit, this.transfer.gasPrice);
    envelop.transfer = {
      amount: this.transfer.amount,
      recipient: this.transfer.recipient,
      payload: Buffer.from(this.transfer.payload, "hex")
    };
    return this.sendAction(envelop);
  }

}

exports.TransferMethod = TransferMethod;

class ExecutionMethod extends AbstractMethod {
  constructor(client, account, execution, opts) {
    super(client, account, opts);

    _defineProperty(this, "execution", void 0);

    this.execution = execution;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.execution.gasLimit, this.execution.gasPrice);
    envelop.execution = {
      amount: this.execution.amount,
      contract: this.execution.contract,
      data: this.execution.data
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.execution.gasLimit, this.execution.gasPrice);
    envelop.execution = {
      amount: this.execution.amount,
      contract: this.execution.contract,
      data: this.execution.data
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.ExecutionMethod = ExecutionMethod;

class ClaimFromRewardingFundMethod extends AbstractMethod {
  constructor(client, account, claim, opts) {
    super(client, account, opts);

    _defineProperty(this, "claimFronRewardFund", void 0);

    this.claimFronRewardFund = claim;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.claimFronRewardFund.gasLimit, this.claimFronRewardFund.gasPrice);
    envelop.claimFromRewardingFund = {
      amount: this.claimFronRewardFund.amount,
      data: this.claimFronRewardFund.data
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.claimFronRewardFund.gasLimit, this.claimFronRewardFund.gasPrice);
    envelop.claimFromRewardingFund = {
      amount: this.claimFronRewardFund.amount,
      data: this.claimFronRewardFund.data
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.ClaimFromRewardingFundMethod = ClaimFromRewardingFundMethod;

class StakeCreateMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeCreate = {
      candidateName: this.target.candidateName,
      stakedAmount: this.target.stakedAmount,
      stakedDuration: this.target.stakedDuration,
      autoStake: this.target.autoStake,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeCreate = {
      candidateName: this.target.candidateName,
      stakedAmount: this.target.stakedAmount,
      stakedDuration: this.target.stakedDuration,
      autoStake: this.target.autoStake,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeCreateMethod = StakeCreateMethod;

class StakeUnstakeMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeUnstake = {
      bucketIndex: this.target.bucketIndex,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeUnstake = {
      bucketIndex: this.target.bucketIndex,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeUnstakeMethod = StakeUnstakeMethod;

class StakeWithdrawMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeWithdraw = {
      bucketIndex: this.target.bucketIndex,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeWithdraw = {
      bucketIndex: this.target.bucketIndex,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeWithdrawMethod = StakeWithdrawMethod;

class StakeAddDepositMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeAddDeposit = {
      bucketIndex: this.target.bucketIndex,
      amount: this.target.amount,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeAddDeposit = {
      bucketIndex: this.target.bucketIndex,
      amount: this.target.amount,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeAddDepositMethod = StakeAddDepositMethod;

class StakeRestakeMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeRestake = {
      bucketIndex: this.target.bucketIndex,
      stakedDuration: this.target.stakedDuration,
      autoStake: this.target.autoStake,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeRestake = {
      bucketIndex: this.target.bucketIndex,
      stakedDuration: this.target.stakedDuration,
      autoStake: this.target.autoStake,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeRestakeMethod = StakeRestakeMethod;

class StakeChangeCandidateMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeChangeCandidate = {
      bucketIndex: this.target.bucketIndex,
      candidateName: this.target.candidateName,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeChangeCandidate = {
      bucketIndex: this.target.bucketIndex,
      candidateName: this.target.candidateName,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeChangeCandidateMethod = StakeChangeCandidateMethod;

class StakeTransferOwnershipMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeTransferOwnership = {
      bucketIndex: this.target.bucketIndex,
      voterAddress: this.target.voterAddress,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.stakeTransferOwnership = {
      bucketIndex: this.target.bucketIndex,
      voterAddress: this.target.voterAddress,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.StakeTransferOwnershipMethod = StakeTransferOwnershipMethod;

class CandidateRegisterMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.candidateRegister = {
      candidate: {
        name: this.target.name,
        operatorAddress: this.target.operatorAddress,
        rewardAddress: this.target.rewardAddress
      },
      stakedAmount: this.target.stakedAmount,
      stakedDuration: this.target.stakedDuration,
      autoStake: this.target.autoStake,
      ownerAddress: this.target.ownerAddress,
      payload: this.target.payload
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.candidateRegister = {
      candidate: {
        name: this.target.name,
        operatorAddress: this.target.operatorAddress,
        rewardAddress: this.target.rewardAddress
      },
      stakedAmount: this.target.stakedAmount,
      stakedDuration: this.target.stakedDuration,
      autoStake: this.target.autoStake,
      ownerAddress: this.target.ownerAddress,
      payload: this.target.payload
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.CandidateRegisterMethod = CandidateRegisterMethod;

class CandidateUpdateMethod extends AbstractMethod {
  constructor(client, account, target, opts) {
    super(client, account, opts);

    _defineProperty(this, "target", void 0);

    this.target = target;
  }

  async execute() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.candidateUpdate = {
      name: this.target.name,
      operatorAddress: this.target.operatorAddress,
      rewardAddress: this.target.rewardAddress
    };
    return this.sendAction(envelop);
  }

  async sign() {
    const envelop = await this.baseEnvelop(this.target.gasLimit, this.target.gasPrice);
    envelop.candidateUpdate = {
      name: this.target.name,
      operatorAddress: this.target.operatorAddress,
      rewardAddress: this.target.rewardAddress
    };
    const selp = await this.signAction(envelop);
    return selp.action();
  }

}

exports.CandidateUpdateMethod = CandidateUpdateMethod;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vbWV0aG9kLnRzIl0sIm5hbWVzIjpbIkFic3RyYWN0TWV0aG9kIiwiY29uc3RydWN0b3IiLCJjbGllbnQiLCJhY2NvdW50Iiwib3B0cyIsInNpZ25lciIsImJhc2VFbnZlbG9wIiwiZ2FzTGltaXQiLCJnYXNQcmljZSIsIm5vbmNlIiwiYWRkcmVzcyIsIm1ldGEiLCJnZXRBY2NvdW50IiwiU3RyaW5nIiwiYWNjb3VudE1ldGEiLCJwZW5kaW5nTm9uY2UiLCJFbnZlbG9wIiwic2lnbkFjdGlvbiIsImVudmVsb3AiLCJwcmljZSIsInN1Z2dlc3RHYXNQcmljZSIsImxpbWl0IiwiZXN0aW1hdGVBY3Rpb25HYXNDb25zdW1wdGlvbiIsInRyYW5zZmVyIiwiZXhlY3V0aW9uIiwiY2FsbGVyQWRkcmVzcyIsImdhcyIsInRvU3RyaW5nIiwiYmFsYW5jZSIsIkJpZ051bWJlciIsImFtb3VudCIsImNvbXBhcmVkVG8iLCJwbHVzIiwibXVsdGlwbGllZEJ5IiwiQWN0aW9uRXJyb3IiLCJBY3Rpb25FcnJvckNvZGUiLCJFcnJCYWxhbmNlIiwiU2VhbGVkRW52ZWxvcCIsInNpZ24iLCJwcml2YXRlS2V5IiwicHVibGljS2V5Iiwic2VuZEFjdGlvbiIsInNpZ25BbmRTZW5kIiwic2VscCIsInNpZ25Pbmx5IiwiYWN0aW9uIiwiZSIsImNvZGUiLCJFcnJVbmtub3duIiwibWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXRhaWxzIiwibWF0Y2giLCJFcnJFeGlzdGVkQWN0aW9uIiwiRXJyR2FzUHJpY2UiLCJFcnJBZGRyZXNzIiwiaW5kZXhPZiIsIkVyck5vbmNlIiwiaGFzaCIsIlRyYW5zZmVyTWV0aG9kIiwiZXhlY3V0ZSIsInJlY2lwaWVudCIsInBheWxvYWQiLCJCdWZmZXIiLCJmcm9tIiwiRXhlY3V0aW9uTWV0aG9kIiwiY29udHJhY3QiLCJkYXRhIiwiQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZE1ldGhvZCIsImNsYWltIiwiY2xhaW1Gcm9uUmV3YXJkRnVuZCIsImNsYWltRnJvbVJld2FyZGluZ0Z1bmQiLCJTdGFrZUNyZWF0ZU1ldGhvZCIsInRhcmdldCIsInN0YWtlQ3JlYXRlIiwiY2FuZGlkYXRlTmFtZSIsInN0YWtlZEFtb3VudCIsInN0YWtlZER1cmF0aW9uIiwiYXV0b1N0YWtlIiwiU3Rha2VVbnN0YWtlTWV0aG9kIiwic3Rha2VVbnN0YWtlIiwiYnVja2V0SW5kZXgiLCJTdGFrZVdpdGhkcmF3TWV0aG9kIiwic3Rha2VXaXRoZHJhdyIsIlN0YWtlQWRkRGVwb3NpdE1ldGhvZCIsInN0YWtlQWRkRGVwb3NpdCIsIlN0YWtlUmVzdGFrZU1ldGhvZCIsInN0YWtlUmVzdGFrZSIsIlN0YWtlQ2hhbmdlQ2FuZGlkYXRlTWV0aG9kIiwic3Rha2VDaGFuZ2VDYW5kaWRhdGUiLCJTdGFrZVRyYW5zZmVyT3duZXJzaGlwTWV0aG9kIiwic3Rha2VUcmFuc2Zlck93bmVyc2hpcCIsInZvdGVyQWRkcmVzcyIsIkNhbmRpZGF0ZVJlZ2lzdGVyTWV0aG9kIiwiY2FuZGlkYXRlUmVnaXN0ZXIiLCJjYW5kaWRhdGUiLCJuYW1lIiwib3BlcmF0b3JBZGRyZXNzIiwicmV3YXJkQWRkcmVzcyIsIm93bmVyQWRkcmVzcyIsIkNhbmRpZGF0ZVVwZGF0ZU1ldGhvZCIsImNhbmRpZGF0ZVVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUdBOztBQUNBOzs7Ozs7QUFtQ08sTUFBTUEsY0FBTixDQUFxQjtBQUsxQkMsRUFBQUEsV0FBVyxDQUFDQyxNQUFELEVBQXFCQyxPQUFyQixFQUF1Q0MsSUFBdkMsRUFBa0U7QUFBQTs7QUFBQTs7QUFBQTs7QUFDM0UsU0FBS0YsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0UsTUFBTCxHQUFjRCxJQUFJLElBQUlBLElBQUksQ0FBQ0MsTUFBM0I7QUFDRDs7QUFFdUIsUUFBWEMsV0FBVyxDQUN0QkMsUUFEc0IsRUFFdEJDLFFBRnNCLEVBR0o7QUFDbEIsUUFB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cG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0IHsgQWNjb3VudCwgSUFjY291bnQgfSBmcm9tIFwiLi4vYWNjb3VudC9hY2NvdW50XCI7XG5pbXBvcnQgeyBJQWN0aW9uLCBJUnBjTWV0aG9kIH0gZnJvbSBcIi4uL3JwYy1tZXRob2QvdHlwZXNcIjtcbmltcG9ydCB7IEVudmVsb3AsIFNlYWxlZEVudmVsb3AgfSBmcm9tIFwiLi9lbnZlbG9wXCI7XG5pbXBvcnQge1xuICBBY3Rpb25FcnJvcixcbiAgQWN0aW9uRXJyb3JDb2RlLFxuICBDYW5kaWRhdGVSZWdpc3RlcixcbiAgQ2FuZGlkYXRlVXBkYXRlLFxuICBDbGFpbUZyb21SZXdhcmRpbmdGdW5kLFxuICBFeGVjdXRpb24sXG4gIFN0YWtlQWRkRGVwb3NpdCxcbiAgU3Rha2VDaGFuZ2VDYW5kaWRhdGUsXG4gIFN0YWtlQ3JlYXRlLFxuICBTdGFrZVJlc3Rha2UsXG4gIFN0YWtlVHJhbnNmZXJPd25lcnNoaXAsXG4gIFN0YWtlVW5zdGFrZSxcbiAgU3Rha2VXaXRoZHJhdyxcbiAgVHJhbnNmZXJcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5PcHRzIHtcbiAgYWRkcmVzczogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25lclBsdWdpbiB7XG4gIHNpZ25BbmRTZW5kPyhlbnZlbG9wOiBFbnZlbG9wLCBvcHRpb25zPzogUGx1Z2luT3B0cyk6IFByb21pc2U8c3RyaW5nPjtcblxuICBzaWduT25seT8oZW52ZWxvcDogRW52ZWxvcCwgb3B0aW9ucz86IFBsdWdpbk9wdHMpOiBQcm9taXNlPFNlYWxlZEVudmVsb3A+O1xuXG4gIGdldEFjY291bnQ/KGFkZHJlc3M6IHN0cmluZyk6IFByb21pc2U8SUFjY291bnQ+O1xuXG4gIGdldEFjY291bnRzPygpOiBQcm9taXNlPEFycmF5PElBY2NvdW50Pj47XG5cbiAgc2lnbk1lc3NhZ2U/KGRhdGE6IHN0cmluZyB8IEJ1ZmZlciB8IFVpbnQ4QXJyYXkpOiBQcm9taXNlPEJ1ZmZlcj47XG59XG5cbmV4cG9ydCB0eXBlIEFic3RyYWN0TWV0aG9kT3B0cyA9IHsgc2lnbmVyPzogU2lnbmVyUGx1Z2luIHwgdW5kZWZpbmVkIH07XG5cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdE1ldGhvZCB7XG4gIHB1YmxpYyBjbGllbnQ6IElScGNNZXRob2Q7XG4gIHB1YmxpYyBhY2NvdW50OiBBY2NvdW50O1xuICBwdWJsaWMgc2lnbmVyPzogU2lnbmVyUGx1Z2luO1xuXG4gIGNvbnN0cnVjdG9yKGNsaWVudDogSVJwY01ldGhvZCwgYWNjb3VudDogQWNjb3VudCwgb3B0cz86IEFic3RyYWN0TWV0aG9kT3B0cykge1xuICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgdGhpcy5zaWduZXIgPSBvcHRzICYmIG9wdHMuc2lnbmVyO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGJhc2VFbnZlbG9wKFxuICAgIGdhc0xpbWl0Pzogc3RyaW5nLFxuICAgIGdhc1ByaWNlPzogc3RyaW5nXG4gICk6IFByb21pc2U8RW52ZWxvcD4ge1xuICAgIGxldCBub25jZSA9IFwiXCI7XG4gICAgaWYgKHRoaXMuYWNjb3VudCAmJiB0aGlzLmFjY291bnQuYWRkcmVzcykge1xuICAgICAgY29uc3QgbWV0YSA9IGF3YWl0IHRoaXMuY2xpZW50LmdldEFjY291bnQoe1xuICAgICAgICBhZGRyZXNzOiB0aGlzLmFjY291bnQuYWRkcmVzc1xuICAgICAgfSk7XG4gICAgICBub25jZSA9IFN0cmluZygobWV0YS5hY2NvdW50TWV0YSAmJiBtZXRhLmFjY291bnRNZXRhLnBlbmRpbmdOb25jZSkgfHwgXCJcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFbnZlbG9wKDEsIG5vbmNlLCBnYXNMaW1pdCwgZ2FzUHJpY2UpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ25BY3Rpb24oZW52ZWxvcDogRW52ZWxvcCk6IFByb21pc2U8U2VhbGVkRW52ZWxvcD4ge1xuICAgIGlmICghZW52ZWxvcC5nYXNQcmljZSkge1xuICAgICAgY29uc3QgcHJpY2UgPSBhd2FpdCB0aGlzLmNsaWVudC5zdWdnZXN0R2FzUHJpY2Uoe30pO1xuICAgICAgZW52ZWxvcC5nYXNQcmljZSA9IFN0cmluZyhwcmljZS5nYXNQcmljZSk7XG4gICAgfVxuXG4gICAgaWYgKCFlbnZlbG9wLmdhc0xpbWl0KSB7XG4gICAgICBjb25zdCBsaW1pdCA9IGF3YWl0IHRoaXMuY2xpZW50LmVzdGltYXRlQWN0aW9uR2FzQ29uc3VtcHRpb24oe1xuICAgICAgICB0cmFuc2ZlcjogZW52ZWxvcC50cmFuc2ZlcixcbiAgICAgICAgZXhlY3V0aW9uOiBlbnZlbG9wLmV4ZWN1dGlvbixcbiAgICAgICAgY2FsbGVyQWRkcmVzczogdGhpcy5hY2NvdW50LmFkZHJlc3NcbiAgICAgIH0pO1xuICAgICAgZW52ZWxvcC5nYXNMaW1pdCA9IGxpbWl0Lmdhcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjY291bnQgJiYgdGhpcy5hY2NvdW50LmFkZHJlc3MpIHtcbiAgICAgIGNvbnN0IG1ldGEgPSBhd2FpdCB0aGlzLmNsaWVudC5nZXRBY2NvdW50KHtcbiAgICAgICAgYWRkcmVzczogdGhpcy5hY2NvdW50LmFkZHJlc3NcbiAgICAgIH0pO1xuICAgICAgaWYgKG1ldGEuYWNjb3VudE1ldGEgJiYgbWV0YS5hY2NvdW50TWV0YS5iYWxhbmNlKSB7XG4gICAgICAgIGNvbnN0IGdhc1ByaWNlID0gbmV3IEJpZ051bWJlcihlbnZlbG9wLmdhc1ByaWNlKTtcbiAgICAgICAgY29uc3QgZ2FzTGltaXQgPSBuZXcgQmlnTnVtYmVyKGVudmVsb3AuZ2FzTGltaXQpO1xuICAgICAgICBjb25zdCBiYWxhbmNlID0gbmV3IEJpZ051bWJlcihtZXRhLmFjY291bnRNZXRhLmJhbGFuY2UpO1xuICAgICAgICBpZiAoZW52ZWxvcC50cmFuc2Zlcikge1xuICAgICAgICAgIGNvbnN0IGFtb3VudCA9IG5ldyBCaWdOdW1iZXIoZW52ZWxvcC50cmFuc2Zlci5hbW91bnQpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGJhbGFuY2UuY29tcGFyZWRUbyhhbW91bnQucGx1cyhnYXNQcmljZS5tdWx0aXBsaWVkQnkoZ2FzTGltaXQpKSkgPCAwXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG4gICAgICAgICAgICAgIEFjdGlvbkVycm9yQ29kZS5FcnJCYWxhbmNlLFxuICAgICAgICAgICAgICBcIkluc3VmZmljaWVudCBmdW5kcyBmb3IgZ2FzICogcHJpY2UgKyBhbW91bnRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVudmVsb3AuZXhlY3V0aW9uKSB7XG4gICAgICAgICAgY29uc3QgYW1vdW50ID0gbmV3IEJpZ051bWJlcihlbnZlbG9wLmV4ZWN1dGlvbi5hbW91bnQpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGJhbGFuY2UuY29tcGFyZWRUbyhhbW91bnQucGx1cyhnYXNQcmljZS5tdWx0aXBsaWVkQnkoZ2FzTGltaXQpKSkgPCAwXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG4gICAgICAgICAgICAgIEFjdGlvbkVycm9yQ29kZS5FcnJCYWxhbmNlLFxuICAgICAgICAgICAgICBcIkluc3VmZmljaWVudCBmdW5kcyBmb3IgZ2FzICogcHJpY2UgKyBhbW91bnRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gU2VhbGVkRW52ZWxvcC5zaWduKFxuICAgICAgdGhpcy5hY2NvdW50LnByaXZhdGVLZXksXG4gICAgICB0aGlzLmFjY291bnQucHVibGljS2V5LFxuICAgICAgZW52ZWxvcFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2VuZEFjdGlvbihlbnZlbG9wOiBFbnZlbG9wKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBvcHRzID0geyBhZGRyZXNzOiBcIlwiIH07XG4gICAgaWYgKHRoaXMuYWNjb3VudCAmJiB0aGlzLmFjY291bnQuYWRkcmVzcykge1xuICAgICAgb3B0cy5hZGRyZXNzID0gdGhpcy5hY2NvdW50LmFkZHJlc3M7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2lnbmVyICYmIHRoaXMuc2lnbmVyLnNpZ25BbmRTZW5kKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaWduZXIuc2lnbkFuZFNlbmQoZW52ZWxvcCwgb3B0cyk7XG4gICAgfVxuXG4gICAgbGV0IHNlbHA6IFNlYWxlZEVudmVsb3A7XG4gICAgaWYgKHRoaXMuc2lnbmVyICYmIHRoaXMuc2lnbmVyLnNpZ25Pbmx5KSB7XG4gICAgICBzZWxwID0gYXdhaXQgdGhpcy5zaWduZXIuc2lnbk9ubHkoZW52ZWxvcCwgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbHAgPSBhd2FpdCB0aGlzLnNpZ25BY3Rpb24oZW52ZWxvcCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuY2xpZW50LnNlbmRBY3Rpb24oe1xuICAgICAgICBhY3Rpb246IHNlbHAuYWN0aW9uKClcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxldCBjb2RlID0gQWN0aW9uRXJyb3JDb2RlLkVyclVua25vd247XG4gICAgICBsZXQgbWVzc2FnZSA9IGBzZW5kIGFjdGlvbiBlcnJvcjogJHtKU09OLnN0cmluZ2lmeShlKX1gO1xuICAgICAgaWYgKGUuZGV0YWlscykge1xuICAgICAgICBtZXNzYWdlID0gZS5kZXRhaWxzO1xuICAgICAgICBpZiAoZS5kZXRhaWxzLm1hdGNoKC9ecmVqZWN0IGV4aXN0ZWQgYWN0aW9uIC4qLykpIHtcbiAgICAgICAgICBjb2RlID0gQWN0aW9uRXJyb3JDb2RlLkVyckV4aXN0ZWRBY3Rpb247XG4gICAgICAgIH0gZWxzZSBpZiAoZS5kZXRhaWxzLm1hdGNoKC9eaW5zdWZmaWNpZW50IGJhbGFuY2UgLiovKSkge1xuICAgICAgICAgIGNvZGUgPSBBY3Rpb25FcnJvckNvZGUuRXJyQmFsYW5jZTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBlLmRldGFpbHMubWF0Y2goLy4qIGxvd2VyIHRoYW4gbWluaW1hbCBnYXMgcHJpY2UgdGhyZXNob2xkJC8pXG4gICAgICAgICkge1xuICAgICAgICAgIGNvZGUgPSBBY3Rpb25FcnJvckNvZGUuRXJyR2FzUHJpY2U7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5kZXRhaWxzID09PSBcImFjdGlvbiBzb3VyY2UgYWRkcmVzcyBpcyBibGFja2xpc3RlZFwiKSB7XG4gICAgICAgICAgY29kZSA9IEFjdGlvbkVycm9yQ29kZS5FcnJBZGRyZXNzO1xuICAgICAgICB9IGVsc2UgaWYgKGUuZGV0YWlscy5pbmRleE9mKFwibm9uY2VcIikgPj0gMCkge1xuICAgICAgICAgIGNvZGUgPSBBY3Rpb25FcnJvckNvZGUuRXJyTm9uY2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBBY3Rpb25FcnJvcihjb2RlLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VscC5oYXNoKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zZmVyTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgdHJhbnNmZXI6IFRyYW5zZmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNsaWVudDogSVJwY01ldGhvZCxcbiAgICBhY2NvdW50OiBBY2NvdW50LFxuICAgIHRyYW5zZmVyOiBUcmFuc2ZlcixcbiAgICBvcHRzPzogQWJzdHJhY3RNZXRob2RPcHRzXG4gICkge1xuICAgIHN1cGVyKGNsaWVudCwgYWNjb3VudCwgb3B0cyk7XG4gICAgdGhpcy50cmFuc2ZlciA9IHRyYW5zZmVyO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudHJhbnNmZXIuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRyYW5zZmVyLmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLnRyYW5zZmVyID0ge1xuICAgICAgYW1vdW50OiB0aGlzLnRyYW5zZmVyLmFtb3VudCxcbiAgICAgIHJlY2lwaWVudDogdGhpcy50cmFuc2Zlci5yZWNpcGllbnQsXG4gICAgICBwYXlsb2FkOiBCdWZmZXIuZnJvbSh0aGlzLnRyYW5zZmVyLnBheWxvYWQsIFwiaGV4XCIpXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRBY3Rpb24oZW52ZWxvcCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4ZWN1dGlvbk1ldGhvZCBleHRlbmRzIEFic3RyYWN0TWV0aG9kIHtcbiAgcHVibGljIGV4ZWN1dGlvbjogRXhlY3V0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNsaWVudDogSVJwY01ldGhvZCxcbiAgICBhY2NvdW50OiBBY2NvdW50LFxuICAgIGV4ZWN1dGlvbjogRXhlY3V0aW9uLFxuICAgIG9wdHM/OiBBYnN0cmFjdE1ldGhvZE9wdHNcbiAgKSB7XG4gICAgc3VwZXIoY2xpZW50LCBhY2NvdW50LCBvcHRzKTtcbiAgICB0aGlzLmV4ZWN1dGlvbiA9IGV4ZWN1dGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLmV4ZWN1dGlvbi5nYXNMaW1pdCxcbiAgICAgIHRoaXMuZXhlY3V0aW9uLmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLmV4ZWN1dGlvbiA9IHtcbiAgICAgIGFtb3VudDogdGhpcy5leGVjdXRpb24uYW1vdW50LFxuICAgICAgY29udHJhY3Q6IHRoaXMuZXhlY3V0aW9uLmNvbnRyYWN0LFxuICAgICAgZGF0YTogdGhpcy5leGVjdXRpb24uZGF0YVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kQWN0aW9uKGVudmVsb3ApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ24oKTogUHJvbWlzZTxJQWN0aW9uPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLmV4ZWN1dGlvbi5nYXNMaW1pdCxcbiAgICAgIHRoaXMuZXhlY3V0aW9uLmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLmV4ZWN1dGlvbiA9IHtcbiAgICAgIGFtb3VudDogdGhpcy5leGVjdXRpb24uYW1vdW50LFxuICAgICAgY29udHJhY3Q6IHRoaXMuZXhlY3V0aW9uLmNvbnRyYWN0LFxuICAgICAgZGF0YTogdGhpcy5leGVjdXRpb24uZGF0YVxuICAgIH07XG5cbiAgICBjb25zdCBzZWxwID0gYXdhaXQgdGhpcy5zaWduQWN0aW9uKGVudmVsb3ApO1xuICAgIHJldHVybiBzZWxwLmFjdGlvbigpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFpbUZyb21SZXdhcmRpbmdGdW5kTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgY2xhaW1Gcm9uUmV3YXJkRnVuZDogQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICBjbGFpbTogQ2xhaW1Gcm9tUmV3YXJkaW5nRnVuZCxcbiAgICBvcHRzPzogQWJzdHJhY3RNZXRob2RPcHRzXG4gICkge1xuICAgIHN1cGVyKGNsaWVudCwgYWNjb3VudCwgb3B0cyk7XG4gICAgdGhpcy5jbGFpbUZyb25SZXdhcmRGdW5kID0gY2xhaW07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy5jbGFpbUZyb25SZXdhcmRGdW5kLmdhc0xpbWl0LFxuICAgICAgdGhpcy5jbGFpbUZyb25SZXdhcmRGdW5kLmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLmNsYWltRnJvbVJld2FyZGluZ0Z1bmQgPSB7XG4gICAgICBhbW91bnQ6IHRoaXMuY2xhaW1Gcm9uUmV3YXJkRnVuZC5hbW91bnQsXG4gICAgICBkYXRhOiB0aGlzLmNsYWltRnJvblJld2FyZEZ1bmQuZGF0YVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kQWN0aW9uKGVudmVsb3ApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ24oKTogUHJvbWlzZTxJQWN0aW9uPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLmNsYWltRnJvblJld2FyZEZ1bmQuZ2FzTGltaXQsXG4gICAgICB0aGlzLmNsYWltRnJvblJld2FyZEZ1bmQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3AuY2xhaW1Gcm9tUmV3YXJkaW5nRnVuZCA9IHtcbiAgICAgIGFtb3VudDogdGhpcy5jbGFpbUZyb25SZXdhcmRGdW5kLmFtb3VudCxcbiAgICAgIGRhdGE6IHRoaXMuY2xhaW1Gcm9uUmV3YXJkRnVuZC5kYXRhXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbHAgPSBhd2FpdCB0aGlzLnNpZ25BY3Rpb24oZW52ZWxvcCk7XG4gICAgcmV0dXJuIHNlbHAuYWN0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0YWtlQ3JlYXRlTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgdGFyZ2V0OiBTdGFrZUNyZWF0ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICB0YXJnZXQ6IFN0YWtlQ3JlYXRlLFxuICAgIG9wdHM/OiBBYnN0cmFjdE1ldGhvZE9wdHNcbiAgKSB7XG4gICAgc3VwZXIoY2xpZW50LCBhY2NvdW50LCBvcHRzKTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLnRhcmdldC5nYXNMaW1pdCxcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLnN0YWtlQ3JlYXRlID0ge1xuICAgICAgY2FuZGlkYXRlTmFtZTogdGhpcy50YXJnZXQuY2FuZGlkYXRlTmFtZSxcbiAgICAgIHN0YWtlZEFtb3VudDogdGhpcy50YXJnZXQuc3Rha2VkQW1vdW50LFxuICAgICAgc3Rha2VkRHVyYXRpb246IHRoaXMudGFyZ2V0LnN0YWtlZER1cmF0aW9uLFxuICAgICAgYXV0b1N0YWtlOiB0aGlzLnRhcmdldC5hdXRvU3Rha2UsXG4gICAgICBwYXlsb2FkOiB0aGlzLnRhcmdldC5wYXlsb2FkXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRBY3Rpb24oZW52ZWxvcCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2lnbigpOiBQcm9taXNlPElBY3Rpb24+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc0xpbWl0LFxuICAgICAgdGhpcy50YXJnZXQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3Auc3Rha2VDcmVhdGUgPSB7XG4gICAgICBjYW5kaWRhdGVOYW1lOiB0aGlzLnRhcmdldC5jYW5kaWRhdGVOYW1lLFxuICAgICAgc3Rha2VkQW1vdW50OiB0aGlzLnRhcmdldC5zdGFrZWRBbW91bnQsXG4gICAgICBzdGFrZWREdXJhdGlvbjogdGhpcy50YXJnZXQuc3Rha2VkRHVyYXRpb24sXG4gICAgICBhdXRvU3Rha2U6IHRoaXMudGFyZ2V0LmF1dG9TdGFrZSxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgY29uc3Qgc2VscCA9IGF3YWl0IHRoaXMuc2lnbkFjdGlvbihlbnZlbG9wKTtcbiAgICByZXR1cm4gc2VscC5hY3Rpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3Rha2VVbnN0YWtlTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgdGFyZ2V0OiBTdGFrZVVuc3Rha2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2xpZW50OiBJUnBjTWV0aG9kLFxuICAgIGFjY291bnQ6IEFjY291bnQsXG4gICAgdGFyZ2V0OiBTdGFrZVVuc3Rha2UsXG4gICAgb3B0cz86IEFic3RyYWN0TWV0aG9kT3B0c1xuICApIHtcbiAgICBzdXBlcihjbGllbnQsIGFjY291bnQsIG9wdHMpO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc0xpbWl0LFxuICAgICAgdGhpcy50YXJnZXQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3Auc3Rha2VVbnN0YWtlID0ge1xuICAgICAgYnVja2V0SW5kZXg6IHRoaXMudGFyZ2V0LmJ1Y2tldEluZGV4LFxuICAgICAgcGF5bG9hZDogdGhpcy50YXJnZXQucGF5bG9hZFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kQWN0aW9uKGVudmVsb3ApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ24oKTogUHJvbWlzZTxJQWN0aW9uPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLnRhcmdldC5nYXNMaW1pdCxcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLnN0YWtlVW5zdGFrZSA9IHtcbiAgICAgIGJ1Y2tldEluZGV4OiB0aGlzLnRhcmdldC5idWNrZXRJbmRleCxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgY29uc3Qgc2VscCA9IGF3YWl0IHRoaXMuc2lnbkFjdGlvbihlbnZlbG9wKTtcbiAgICByZXR1cm4gc2VscC5hY3Rpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3Rha2VXaXRoZHJhd01ldGhvZCBleHRlbmRzIEFic3RyYWN0TWV0aG9kIHtcbiAgcHVibGljIHRhcmdldDogU3Rha2VXaXRoZHJhdztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICB0YXJnZXQ6IFN0YWtlV2l0aGRyYXcsXG4gICAgb3B0cz86IEFic3RyYWN0TWV0aG9kT3B0c1xuICApIHtcbiAgICBzdXBlcihjbGllbnQsIGFjY291bnQsIG9wdHMpO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc0xpbWl0LFxuICAgICAgdGhpcy50YXJnZXQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3Auc3Rha2VXaXRoZHJhdyA9IHtcbiAgICAgIGJ1Y2tldEluZGV4OiB0aGlzLnRhcmdldC5idWNrZXRJbmRleCxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEFjdGlvbihlbnZlbG9wKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaWduKCk6IFByb21pc2U8SUFjdGlvbj4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy50YXJnZXQuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRhcmdldC5nYXNQcmljZVxuICAgICk7XG4gICAgZW52ZWxvcC5zdGFrZVdpdGhkcmF3ID0ge1xuICAgICAgYnVja2V0SW5kZXg6IHRoaXMudGFyZ2V0LmJ1Y2tldEluZGV4LFxuICAgICAgcGF5bG9hZDogdGhpcy50YXJnZXQucGF5bG9hZFxuICAgIH07XG5cbiAgICBjb25zdCBzZWxwID0gYXdhaXQgdGhpcy5zaWduQWN0aW9uKGVudmVsb3ApO1xuICAgIHJldHVybiBzZWxwLmFjdGlvbigpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdGFrZUFkZERlcG9zaXRNZXRob2QgZXh0ZW5kcyBBYnN0cmFjdE1ldGhvZCB7XG4gIHB1YmxpYyB0YXJnZXQ6IFN0YWtlQWRkRGVwb3NpdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICB0YXJnZXQ6IFN0YWtlQWRkRGVwb3NpdCxcbiAgICBvcHRzPzogQWJzdHJhY3RNZXRob2RPcHRzXG4gICkge1xuICAgIHN1cGVyKGNsaWVudCwgYWNjb3VudCwgb3B0cyk7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy50YXJnZXQuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRhcmdldC5nYXNQcmljZVxuICAgICk7XG4gICAgZW52ZWxvcC5zdGFrZUFkZERlcG9zaXQgPSB7XG4gICAgICBidWNrZXRJbmRleDogdGhpcy50YXJnZXQuYnVja2V0SW5kZXgsXG4gICAgICBhbW91bnQ6IHRoaXMudGFyZ2V0LmFtb3VudCxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEFjdGlvbihlbnZlbG9wKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaWduKCk6IFByb21pc2U8SUFjdGlvbj4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy50YXJnZXQuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRhcmdldC5nYXNQcmljZVxuICAgICk7XG4gICAgZW52ZWxvcC5zdGFrZUFkZERlcG9zaXQgPSB7XG4gICAgICBidWNrZXRJbmRleDogdGhpcy50YXJnZXQuYnVja2V0SW5kZXgsXG4gICAgICBhbW91bnQ6IHRoaXMudGFyZ2V0LmFtb3VudCxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgY29uc3Qgc2VscCA9IGF3YWl0IHRoaXMuc2lnbkFjdGlvbihlbnZlbG9wKTtcbiAgICByZXR1cm4gc2VscC5hY3Rpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3Rha2VSZXN0YWtlTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgdGFyZ2V0OiBTdGFrZVJlc3Rha2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2xpZW50OiBJUnBjTWV0aG9kLFxuICAgIGFjY291bnQ6IEFjY291bnQsXG4gICAgdGFyZ2V0OiBTdGFrZVJlc3Rha2UsXG4gICAgb3B0cz86IEFic3RyYWN0TWV0aG9kT3B0c1xuICApIHtcbiAgICBzdXBlcihjbGllbnQsIGFjY291bnQsIG9wdHMpO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc0xpbWl0LFxuICAgICAgdGhpcy50YXJnZXQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3Auc3Rha2VSZXN0YWtlID0ge1xuICAgICAgYnVja2V0SW5kZXg6IHRoaXMudGFyZ2V0LmJ1Y2tldEluZGV4LFxuICAgICAgc3Rha2VkRHVyYXRpb246IHRoaXMudGFyZ2V0LnN0YWtlZER1cmF0aW9uLFxuICAgICAgYXV0b1N0YWtlOiB0aGlzLnRhcmdldC5hdXRvU3Rha2UsXG4gICAgICBwYXlsb2FkOiB0aGlzLnRhcmdldC5wYXlsb2FkXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRBY3Rpb24oZW52ZWxvcCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2lnbigpOiBQcm9taXNlPElBY3Rpb24+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc0xpbWl0LFxuICAgICAgdGhpcy50YXJnZXQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3Auc3Rha2VSZXN0YWtlID0ge1xuICAgICAgYnVja2V0SW5kZXg6IHRoaXMudGFyZ2V0LmJ1Y2tldEluZGV4LFxuICAgICAgc3Rha2VkRHVyYXRpb246IHRoaXMudGFyZ2V0LnN0YWtlZER1cmF0aW9uLFxuICAgICAgYXV0b1N0YWtlOiB0aGlzLnRhcmdldC5hdXRvU3Rha2UsXG4gICAgICBwYXlsb2FkOiB0aGlzLnRhcmdldC5wYXlsb2FkXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbHAgPSBhd2FpdCB0aGlzLnNpZ25BY3Rpb24oZW52ZWxvcCk7XG4gICAgcmV0dXJuIHNlbHAuYWN0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0YWtlQ2hhbmdlQ2FuZGlkYXRlTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgdGFyZ2V0OiBTdGFrZUNoYW5nZUNhbmRpZGF0ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICB0YXJnZXQ6IFN0YWtlQ2hhbmdlQ2FuZGlkYXRlLFxuICAgIG9wdHM/OiBBYnN0cmFjdE1ldGhvZE9wdHNcbiAgKSB7XG4gICAgc3VwZXIoY2xpZW50LCBhY2NvdW50LCBvcHRzKTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLnRhcmdldC5nYXNMaW1pdCxcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLnN0YWtlQ2hhbmdlQ2FuZGlkYXRlID0ge1xuICAgICAgYnVja2V0SW5kZXg6IHRoaXMudGFyZ2V0LmJ1Y2tldEluZGV4LFxuICAgICAgY2FuZGlkYXRlTmFtZTogdGhpcy50YXJnZXQuY2FuZGlkYXRlTmFtZSxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEFjdGlvbihlbnZlbG9wKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaWduKCk6IFByb21pc2U8SUFjdGlvbj4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy50YXJnZXQuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRhcmdldC5nYXNQcmljZVxuICAgICk7XG4gICAgZW52ZWxvcC5zdGFrZUNoYW5nZUNhbmRpZGF0ZSA9IHtcbiAgICAgIGJ1Y2tldEluZGV4OiB0aGlzLnRhcmdldC5idWNrZXRJbmRleCxcbiAgICAgIGNhbmRpZGF0ZU5hbWU6IHRoaXMudGFyZ2V0LmNhbmRpZGF0ZU5hbWUsXG4gICAgICBwYXlsb2FkOiB0aGlzLnRhcmdldC5wYXlsb2FkXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbHAgPSBhd2FpdCB0aGlzLnNpZ25BY3Rpb24oZW52ZWxvcCk7XG4gICAgcmV0dXJuIHNlbHAuYWN0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0YWtlVHJhbnNmZXJPd25lcnNoaXBNZXRob2QgZXh0ZW5kcyBBYnN0cmFjdE1ldGhvZCB7XG4gIHB1YmxpYyB0YXJnZXQ6IFN0YWtlVHJhbnNmZXJPd25lcnNoaXA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2xpZW50OiBJUnBjTWV0aG9kLFxuICAgIGFjY291bnQ6IEFjY291bnQsXG4gICAgdGFyZ2V0OiBTdGFrZVRyYW5zZmVyT3duZXJzaGlwLFxuICAgIG9wdHM/OiBBYnN0cmFjdE1ldGhvZE9wdHNcbiAgKSB7XG4gICAgc3VwZXIoY2xpZW50LCBhY2NvdW50LCBvcHRzKTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLnRhcmdldC5nYXNMaW1pdCxcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLnN0YWtlVHJhbnNmZXJPd25lcnNoaXAgPSB7XG4gICAgICBidWNrZXRJbmRleDogdGhpcy50YXJnZXQuYnVja2V0SW5kZXgsXG4gICAgICB2b3RlckFkZHJlc3M6IHRoaXMudGFyZ2V0LnZvdGVyQWRkcmVzcyxcbiAgICAgIHBheWxvYWQ6IHRoaXMudGFyZ2V0LnBheWxvYWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEFjdGlvbihlbnZlbG9wKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaWduKCk6IFByb21pc2U8SUFjdGlvbj4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy50YXJnZXQuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRhcmdldC5nYXNQcmljZVxuICAgICk7XG4gICAgZW52ZWxvcC5zdGFrZVRyYW5zZmVyT3duZXJzaGlwID0ge1xuICAgICAgYnVja2V0SW5kZXg6IHRoaXMudGFyZ2V0LmJ1Y2tldEluZGV4LFxuICAgICAgdm90ZXJBZGRyZXNzOiB0aGlzLnRhcmdldC52b3RlckFkZHJlc3MsXG4gICAgICBwYXlsb2FkOiB0aGlzLnRhcmdldC5wYXlsb2FkXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbHAgPSBhd2FpdCB0aGlzLnNpZ25BY3Rpb24oZW52ZWxvcCk7XG4gICAgcmV0dXJuIHNlbHAuYWN0aW9uKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbmRpZGF0ZVJlZ2lzdGVyTWV0aG9kIGV4dGVuZHMgQWJzdHJhY3RNZXRob2Qge1xuICBwdWJsaWMgdGFyZ2V0OiBDYW5kaWRhdGVSZWdpc3RlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICB0YXJnZXQ6IENhbmRpZGF0ZVJlZ2lzdGVyLFxuICAgIG9wdHM/OiBBYnN0cmFjdE1ldGhvZE9wdHNcbiAgKSB7XG4gICAgc3VwZXIoY2xpZW50LCBhY2NvdW50LCBvcHRzKTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLnRhcmdldC5nYXNMaW1pdCxcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLmNhbmRpZGF0ZVJlZ2lzdGVyID0ge1xuICAgICAgY2FuZGlkYXRlOiB7XG4gICAgICAgIG5hbWU6IHRoaXMudGFyZ2V0Lm5hbWUsXG4gICAgICAgIG9wZXJhdG9yQWRkcmVzczogdGhpcy50YXJnZXQub3BlcmF0b3JBZGRyZXNzLFxuICAgICAgICByZXdhcmRBZGRyZXNzOiB0aGlzLnRhcmdldC5yZXdhcmRBZGRyZXNzXG4gICAgICB9LFxuICAgICAgc3Rha2VkQW1vdW50OiB0aGlzLnRhcmdldC5zdGFrZWRBbW91bnQsXG4gICAgICBzdGFrZWREdXJhdGlvbjogdGhpcy50YXJnZXQuc3Rha2VkRHVyYXRpb24sXG4gICAgICBhdXRvU3Rha2U6IHRoaXMudGFyZ2V0LmF1dG9TdGFrZSxcbiAgICAgIG93bmVyQWRkcmVzczogdGhpcy50YXJnZXQub3duZXJBZGRyZXNzLFxuICAgICAgcGF5bG9hZDogdGhpcy50YXJnZXQucGF5bG9hZFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kQWN0aW9uKGVudmVsb3ApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ24oKTogUHJvbWlzZTxJQWN0aW9uPiB7XG4gICAgY29uc3QgZW52ZWxvcCA9IGF3YWl0IHRoaXMuYmFzZUVudmVsb3AoXG4gICAgICB0aGlzLnRhcmdldC5nYXNMaW1pdCxcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc1ByaWNlXG4gICAgKTtcbiAgICBlbnZlbG9wLmNhbmRpZGF0ZVJlZ2lzdGVyID0ge1xuICAgICAgY2FuZGlkYXRlOiB7XG4gICAgICAgIG5hbWU6IHRoaXMudGFyZ2V0Lm5hbWUsXG4gICAgICAgIG9wZXJhdG9yQWRkcmVzczogdGhpcy50YXJnZXQub3BlcmF0b3JBZGRyZXNzLFxuICAgICAgICByZXdhcmRBZGRyZXNzOiB0aGlzLnRhcmdldC5yZXdhcmRBZGRyZXNzXG4gICAgICB9LFxuICAgICAgc3Rha2VkQW1vdW50OiB0aGlzLnRhcmdldC5zdGFrZWRBbW91bnQsXG4gICAgICBzdGFrZWREdXJhdGlvbjogdGhpcy50YXJnZXQuc3Rha2VkRHVyYXRpb24sXG4gICAgICBhdXRvU3Rha2U6IHRoaXMudGFyZ2V0LmF1dG9TdGFrZSxcbiAgICAgIG93bmVyQWRkcmVzczogdGhpcy50YXJnZXQub3duZXJBZGRyZXNzLFxuICAgICAgcGF5bG9hZDogdGhpcy50YXJnZXQucGF5bG9hZFxuICAgIH07XG5cbiAgICBjb25zdCBzZWxwID0gYXdhaXQgdGhpcy5zaWduQWN0aW9uKGVudmVsb3ApO1xuICAgIHJldHVybiBzZWxwLmFjdGlvbigpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYW5kaWRhdGVVcGRhdGVNZXRob2QgZXh0ZW5kcyBBYnN0cmFjdE1ldGhvZCB7XG4gIHB1YmxpYyB0YXJnZXQ6IENhbmRpZGF0ZVVwZGF0ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjbGllbnQ6IElScGNNZXRob2QsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICB0YXJnZXQ6IENhbmRpZGF0ZVVwZGF0ZSxcbiAgICBvcHRzPzogQWJzdHJhY3RNZXRob2RPcHRzXG4gICkge1xuICAgIHN1cGVyKGNsaWVudCwgYWNjb3VudCwgb3B0cyk7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGVudmVsb3AgPSBhd2FpdCB0aGlzLmJhc2VFbnZlbG9wKFxuICAgICAgdGhpcy50YXJnZXQuZ2FzTGltaXQsXG4gICAgICB0aGlzLnRhcmdldC5nYXNQcmljZVxuICAgICk7XG4gICAgZW52ZWxvcC5jYW5kaWRhdGVVcGRhdGUgPSB7XG4gICAgICBuYW1lOiB0aGlzLnRhcmdldC5uYW1lLFxuICAgICAgb3BlcmF0b3JBZGRyZXNzOiB0aGlzLnRhcmdldC5vcGVyYXRvckFkZHJlc3MsXG4gICAgICByZXdhcmRBZGRyZXNzOiB0aGlzLnRhcmdldC5yZXdhcmRBZGRyZXNzXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRBY3Rpb24oZW52ZWxvcCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2lnbigpOiBQcm9taXNlPElBY3Rpb24+IHtcbiAgICBjb25zdCBlbnZlbG9wID0gYXdhaXQgdGhpcy5iYXNlRW52ZWxvcChcbiAgICAgIHRoaXMudGFyZ2V0Lmdhc0xpbWl0LFxuICAgICAgdGhpcy50YXJnZXQuZ2FzUHJpY2VcbiAgICApO1xuICAgIGVudmVsb3AuY2FuZGlkYXRlVXBkYXRlID0ge1xuICAgICAgbmFtZTogdGhpcy50YXJnZXQubmFtZSxcbiAgICAgIG9wZXJhdG9yQWRkcmVzczogdGhpcy50YXJnZXQub3BlcmF0b3JBZGRyZXNzLFxuICAgICAgcmV3YXJkQWRkcmVzczogdGhpcy50YXJnZXQucmV3YXJkQWRkcmVzc1xuICAgIH07XG5cbiAgICBjb25zdCBzZWxwID0gYXdhaXQgdGhpcy5zaWduQWN0aW9uKGVudmVsb3ApO1xuICAgIHJldHVybiBzZWxwLmFjdGlvbigpO1xuICB9XG59XG4iXX0=