"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XRC20 = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _web3EthAbi = _interopRequireDefault(require("web3-eth-abi"));

var _abiToByte = require("../contract/abi-to-byte");

var _contract = require("../contract/contract");

var _address = require("../crypto/address");

var _abi = require("./abi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Abi = _web3EthAbi.default;

class XRC20 {
  constructor(address, options) {
    _defineProperty(this, "address", void 0);

    _defineProperty(this, "contract", void 0);

    _defineProperty(this, "methods", void 0);

    _defineProperty(this, "tokenName", void 0);

    _defineProperty(this, "tokenSymbol", void 0);

    _defineProperty(this, "tokenDecimals", void 0);

    _defineProperty(this, "tokenTotalSupply", void 0);

    this.address = address;
    this.contract = new _contract.Contract(_abi.XRC20_ABI, address, options);
    const methods = {}; // @ts-ignore

    for (const fnName of Object.keys(this.contract.getABI())) {
      // @ts-ignore
      const fnAbi = this.contract.getABI()[fnName];

      if (fnAbi.type === "constructor") {
        continue;
      }

      const args = (0, _abiToByte.getArgTypes)(fnAbi);
      const header = (0, _abiToByte.getHeaderHash)(fnAbi, args); // @ts-ignore

      methods[header] = {
        name: fnName,
        inputsNames: args.map(i => {
          return `${i.name}`;
        }),
        inputsTypes: args.map(i => {
          return `${i.type}`;
        })
      };
    }

    this.methods = methods;
  }

  async name() {
    if (this.tokenName) {
      return this.tokenName;
    }

    const result = await this.readMethod("name", this.address);
    const data = Abi.decodeParameter("string", result);

    if (data.length > 0) {
      this.tokenName = String(data);
      return this.tokenName;
    }

    return "";
  }

  async symbol() {
    if (this.tokenSymbol) {
      return this.tokenSymbol;
    }

    const result = await this.readMethod("symbol", this.address);
    const data = Abi.decodeParameter("string", result);

    if (data.length > 0) {
      this.tokenSymbol = String(data);
      return this.tokenSymbol;
    }

    return "";
  }

  async decimals() {
    if (this.tokenDecimals) {
      return this.tokenDecimals;
    }

    const result = await this.readMethod("decimals", this.address);
    this.tokenDecimals = new _bignumber.default(result, 16);
    return this.tokenDecimals;
  }

  async totalSupply() {
    if (this.tokenTotalSupply) {
      return this.tokenTotalSupply;
    }

    const result = await this.readMethod("totalSupply", this.address);
    this.tokenTotalSupply = new _bignumber.default(result, 16);
    return this.tokenTotalSupply;
  }

  async balanceOf(owner) {
    const result = await this.readMethod("balanceOf", this.address, owner);
    return new _bignumber.default(result, 16);
  }

  async transfer(to, value, options) {
    return this.executeMethod("transfer", options.account, options.gasPrice, options.gasLimit, "0", to, value.toFixed(0));
  }

  async allowance(owner, spender, options) {
    return this.executeMethod("allowance", options.account, options.gasPrice, options.gasLimit, "0", owner, spender);
  }

  async approve(spender, value, options) {
    return this.executeMethod("approve", options.account, options.gasPrice, options.gasLimit, "0", spender, value.toFixed(0));
  }

  async transferFrom(from, to, value, options) {
    return this.executeMethod("transferFrom", options.account, options.gasPrice, options.gasLimit, "0", from, to, value.toFixed(0));
  }

  async readMethod(method, callerAddress, // @ts-ignore
  // tslint:disable-next-line: typedef
  ...args) {
    if (!this.contract.provider) {
      throw new Error("no rpc method provider specified");
    }

    const result = await this.contract.provider.readContract({
      execution: this.contract.pureEncodeMethod("0", method, ...args),
      callerAddress: callerAddress
    });
    return result.data;
  }

  executeMethod(method, account, gasPrice, gasLimit, amount, // @ts-ignore
  // tslint:disable-next-line: typedef
  ...args) {
    return this.contract.methods[method](...args, {
      account: account,
      amount: amount,
      gasLimit: gasLimit,
      gasPrice: gasPrice
    });
  }

  decode(data) {
    if (data.length < 8) {
      throw new Error("input data error");
    }

    const methodKey = data.substr(0, 8);
    const method = this.methods[methodKey];

    if (!method) {
      throw new Error(`method ${methodKey} is not erc20 method`);
    }

    const params = Abi.decodeParameters(method.inputsTypes, data.substring(8));
    const values = {};

    for (let i = 0; i < method.inputsTypes.length; i++) {
      if (method.inputsTypes[i] === "address") {
        params[i] = (0, _address.fromBytes)(Buffer.from(params[i].substring(2), "hex")).string();
      } // @ts-ignore


      values[method.inputsNames[i]] = params[i];
    }

    return {
      method: method.name,
      data: values
    };
  }

}

exports.XRC20 = XRC20;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbi94cmMyMC50cyJdLCJuYW1lcyI6WyJBYmkiLCJXZWIzQWJpIiwiWFJDMjAiLCJjb25zdHJ1Y3RvciIsImFkZHJlc3MiLCJvcHRpb25zIiwiY29udHJhY3QiLCJDb250cmFjdCIsIlhSQzIwX0FCSSIsIm1ldGhvZHMiLCJmbk5hbWUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0QUJJIiwiZm5BYmkiLCJ0eXBlIiwiYXJncyIsImhlYWRlciIsIm5hbWUiLCJpbnB1dHNOYW1lcyIsIm1hcCIsImkiLCJpbnB1dHNUeXBlcyIsInRva2VuTmFtZSIsInJlc3VsdCIsInJlYWRNZXRob2QiLCJkYXRhIiwiZGVjb2RlUGFyYW1ldGVyIiwibGVuZ3RoIiwiU3RyaW5nIiwic3ltYm9sIiwidG9rZW5TeW1ib2wiLCJkZWNpbWFscyIsInRva2VuRGVjaW1hbHMiLCJCaWdOdW1iZXIiLCJ0b3RhbFN1cHBseSIsInRva2VuVG90YWxTdXBwbHkiLCJiYWxhbmNlT2YiLCJvd25lciIsInRyYW5zZmVyIiwidG8iLCJ2YWx1ZSIsImV4ZWN1dGVNZXRob2QiLCJhY2NvdW50IiwiZ2FzUHJpY2UiLCJnYXNMaW1pdCIsInRvRml4ZWQiLCJhbGxvd2FuY2UiLCJzcGVuZGVyIiwiYXBwcm92ZSIsInRyYW5zZmVyRnJvbSIsImZyb20iLCJtZXRob2QiLCJjYWxsZXJBZGRyZXNzIiwicHJvdmlkZXIiLCJFcnJvciIsInJlYWRDb250cmFjdCIsImV4ZWN1dGlvbiIsInB1cmVFbmNvZGVNZXRob2QiLCJhbW91bnQiLCJkZWNvZGUiLCJtZXRob2RLZXkiLCJzdWJzdHIiLCJwYXJhbXMiLCJkZWNvZGVQYXJhbWV0ZXJzIiwic3Vic3RyaW5nIiwidmFsdWVzIiwiQnVmZmVyIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLEdBQUcsR0FBSUMsbUJBQWI7O0FBb0JPLE1BQU1DLEtB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UCxDQUFtQk0sTUFBdkMsRUFBK0NQLENBQUMsRUFBaEQsRUFBb0Q7QUFDbEQsVUFBSStCLE1BQU0sQ0FBQzlCLFdBQVAsQ0FBbUJELENBQW5CLE1BQTBCLFNBQTlCLEVBQXlDO0FBQ3ZDMEMsUUFBQUEsTUFBTSxDQUFDMUMsQ0FBRCxDQUFOLEdBQVksd0JBQ1Y4QyxNQUFNLENBQUNoQixJQUFQLENBQVlZLE1BQU0sQ0FBQzFDLENBQUQsQ0FBTixDQUFVNEMsU0FBVixDQUFvQixDQUFwQixDQUFaLEVBQW9DLEtBQXBDLENBRFUsRUFFVkcsTUFGVSxFQUFaO0FBR0QsT0FMaUQsQ0FNbEQ7OztBQUNBRixNQUFBQSxNQUFNLENBQUNkLE1BQU0sQ0FBQ2pDLFdBQVAsQ0FBbUJFLENBQW5CLENBQUQsQ0FBTixHQUFnQzBDLE1BQU0sQ0FBQzFDLENBQUQsQ0FBdEM7QUFDRDs7QUFFRCxXQUFPO0FBQ0wrQixNQUFBQSxNQUFNLEVBQUVBLE1BQU0sQ0FBQ2xDLElBRFY7QUFFTFEsTUFBQUEsSUFBSSxFQUFFd0M7QUFGRCxLQUFQO0FBSUQ7O0FBek5nQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0IFdlYjNBYmksIHsgQWJpQ29kZXIgfSBmcm9tIFwid2ViMy1ldGgtYWJpXCI7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSBcIi4uL2FjY291bnQvYWNjb3VudFwiO1xuaW1wb3J0IHsgZ2V0QXJnVHlwZXMsIGdldEhlYWRlckhhc2ggfSBmcm9tIFwiLi4vY29udHJhY3QvYWJpLXRvLWJ5dGVcIjtcbmltcG9ydCB7IENvbnRyYWN0LCBPcHRpb25zIH0gZnJvbSBcIi4uL2NvbnRyYWN0L2NvbnRyYWN0XCI7XG5pbXBvcnQgeyBmcm9tQnl0ZXMgfSBmcm9tIFwiLi4vY3J5cHRvL2FkZHJlc3NcIjtcbmltcG9ydCB7IFhSQzIwX0FCSSB9IGZyb20gXCIuL2FiaVwiO1xuXG5jb25zdCBBYmkgPSAoV2ViM0FiaSBhcyB1bmtub3duKSBhcyBBYmlDb2RlcjtcblxuZXhwb3J0IGludGVyZmFjZSBNZXRob2Qge1xuICBuYW1lOiBzdHJpbmc7XG4gIGlucHV0c05hbWVzOiBbc3RyaW5nXTtcbiAgaW5wdXRzVHlwZXM6IFtzdHJpbmddO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlY29kZURhdGEge1xuICBtZXRob2Q6IHN0cmluZztcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1hbnlcbiAgZGF0YTogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeGVjdXRlT3B0aW9uIHtcbiAgYWNjb3VudDogQWNjb3VudDtcbiAgZ2FzUHJpY2U6IHN0cmluZztcbiAgZ2FzTGltaXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFhSQzIwIHtcbiAgcHVibGljIGFkZHJlc3M6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBjb250cmFjdDogQ29udHJhY3Q7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kczogeyBba2V5OiBzdHJpbmddOiBNZXRob2QgfTtcbiAgcHJpdmF0ZSB0b2tlbk5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSB0b2tlblN5bWJvbDogc3RyaW5nO1xuICBwcml2YXRlIHRva2VuRGVjaW1hbHM6IEJpZ051bWJlcjtcbiAgcHJpdmF0ZSB0b2tlblRvdGFsU3VwcGx5OiBCaWdOdW1iZXI7XG5cbiAgY29uc3RydWN0b3IoYWRkcmVzczogc3RyaW5nLCBvcHRpb25zPzogT3B0aW9ucykge1xuICAgIHRoaXMuYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgdGhpcy5jb250cmFjdCA9IG5ldyBDb250cmFjdChYUkMyMF9BQkksIGFkZHJlc3MsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgbWV0aG9kcyA9IHt9O1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGZuTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyYWN0LmdldEFCSSgpKSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgZm5BYmkgPSB0aGlzLmNvbnRyYWN0LmdldEFCSSgpW2ZuTmFtZV07XG4gICAgICBpZiAoZm5BYmkudHlwZSA9PT0gXCJjb25zdHJ1Y3RvclwiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhcmdzID0gZ2V0QXJnVHlwZXMoZm5BYmkpO1xuICAgICAgY29uc3QgaGVhZGVyID0gZ2V0SGVhZGVySGFzaChmbkFiaSwgYXJncyk7XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIG1ldGhvZHNbaGVhZGVyXSA9IHtcbiAgICAgICAgbmFtZTogZm5OYW1lLFxuICAgICAgICBpbnB1dHNOYW1lczogYXJncy5tYXAoaSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGAke2kubmFtZX1gO1xuICAgICAgICB9KSxcbiAgICAgICAgaW5wdXRzVHlwZXM6IGFyZ3MubWFwKGkgPT4ge1xuICAgICAgICAgIHJldHVybiBgJHtpLnR5cGV9YDtcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMubWV0aG9kcyA9IG1ldGhvZHM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbmFtZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICh0aGlzLnRva2VuTmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW5OYW1lO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlYWRNZXRob2QoXCJuYW1lXCIsIHRoaXMuYWRkcmVzcyk7XG4gICAgY29uc3QgZGF0YSA9IEFiaS5kZWNvZGVQYXJhbWV0ZXIoXCJzdHJpbmdcIiwgcmVzdWx0KTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnRva2VuTmFtZSA9IFN0cmluZyhkYXRhKTtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3ltYm9sKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKHRoaXMudG9rZW5TeW1ib2wpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuU3ltYm9sO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlYWRNZXRob2QoXCJzeW1ib2xcIiwgdGhpcy5hZGRyZXNzKTtcbiAgICBjb25zdCBkYXRhID0gQWJpLmRlY29kZVBhcmFtZXRlcihcInN0cmluZ1wiLCByZXN1bHQpO1xuICAgIGlmIChkYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMudG9rZW5TeW1ib2wgPSBTdHJpbmcoZGF0YSk7XG4gICAgICByZXR1cm4gdGhpcy50b2tlblN5bWJvbDtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGVjaW1hbHMoKTogUHJvbWlzZTxCaWdOdW1iZXI+IHtcbiAgICBpZiAodGhpcy50b2tlbkRlY2ltYWxzKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbkRlY2ltYWxzO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlYWRNZXRob2QoXCJkZWNpbWFsc1wiLCB0aGlzLmFkZHJlc3MpO1xuICAgIHRoaXMudG9rZW5EZWNpbWFscyA9IG5ldyBCaWdOdW1iZXIocmVzdWx0LCAxNik7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5EZWNpbWFscztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB0b3RhbFN1cHBseSgpOiBQcm9taXNlPEJpZ051bWJlcj4ge1xuICAgIGlmICh0aGlzLnRva2VuVG90YWxTdXBwbHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuVG90YWxTdXBwbHk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucmVhZE1ldGhvZChcInRvdGFsU3VwcGx5XCIsIHRoaXMuYWRkcmVzcyk7XG4gICAgdGhpcy50b2tlblRvdGFsU3VwcGx5ID0gbmV3IEJpZ051bWJlcihyZXN1bHQsIDE2KTtcbiAgICByZXR1cm4gdGhpcy50b2tlblRvdGFsU3VwcGx5O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGJhbGFuY2VPZihvd25lcjogc3RyaW5nKTogUHJvbWlzZTxCaWdOdW1iZXI+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlYWRNZXRob2QoXCJiYWxhbmNlT2ZcIiwgdGhpcy5hZGRyZXNzLCBvd25lcik7XG4gICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIocmVzdWx0LCAxNik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdHJhbnNmZXIoXG4gICAgdG86IHN0cmluZyxcbiAgICB2YWx1ZTogQmlnTnVtYmVyLFxuICAgIG9wdGlvbnM6IEV4ZWN1dGVPcHRpb25cbiAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlTWV0aG9kKFxuICAgICAgXCJ0cmFuc2ZlclwiLFxuICAgICAgb3B0aW9ucy5hY2NvdW50LFxuICAgICAgb3B0aW9ucy5nYXNQcmljZSxcbiAgICAgIG9wdGlvbnMuZ2FzTGltaXQsXG4gICAgICBcIjBcIixcbiAgICAgIHRvLFxuICAgICAgdmFsdWUudG9GaXhlZCgwKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWxsb3dhbmNlKFxuICAgIG93bmVyOiBzdHJpbmcsXG4gICAgc3BlbmRlcjogc3RyaW5nLFxuICAgIG9wdGlvbnM6IEV4ZWN1dGVPcHRpb25cbiAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlTWV0aG9kKFxuICAgICAgXCJhbGxvd2FuY2VcIixcbiAgICAgIG9wdGlvbnMuYWNjb3VudCxcbiAgICAgIG9wdGlvbnMuZ2FzUHJpY2UsXG4gICAgICBvcHRpb25zLmdhc0xpbWl0LFxuICAgICAgXCIwXCIsXG4gICAgICBvd25lcixcbiAgICAgIHNwZW5kZXJcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGFwcHJvdmUoXG4gICAgc3BlbmRlcjogc3RyaW5nLFxuICAgIHZhbHVlOiBCaWdOdW1iZXIsXG4gICAgb3B0aW9uczogRXhlY3V0ZU9wdGlvblxuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVNZXRob2QoXG4gICAgICBcImFwcHJvdmVcIixcbiAgICAgIG9wdGlvbnMuYWNjb3VudCxcbiAgICAgIG9wdGlvbnMuZ2FzUHJpY2UsXG4gICAgICBvcHRpb25zLmdhc0xpbWl0LFxuICAgICAgXCIwXCIsXG4gICAgICBzcGVuZGVyLFxuICAgICAgdmFsdWUudG9GaXhlZCgwKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdHJhbnNmZXJGcm9tKFxuICAgIGZyb206IHN0cmluZyxcbiAgICB0bzogc3RyaW5nLFxuICAgIHZhbHVlOiBCaWdOdW1iZXIsXG4gICAgb3B0aW9uczogRXhlY3V0ZU9wdGlvblxuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVNZXRob2QoXG4gICAgICBcInRyYW5zZmVyRnJvbVwiLFxuICAgICAgb3B0aW9ucy5hY2NvdW50LFxuICAgICAgb3B0aW9ucy5nYXNQcmljZSxcbiAgICAgIG9wdGlvbnMuZ2FzTGltaXQsXG4gICAgICBcIjBcIixcbiAgICAgIGZyb20sXG4gICAgICB0byxcbiAgICAgIHZhbHVlLnRvRml4ZWQoMClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZWFkTWV0aG9kKFxuICAgIG1ldGhvZDogc3RyaW5nLFxuICAgIGNhbGxlckFkZHJlc3M6IHN0cmluZyxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB0eXBlZGVmXG4gICAgLi4uYXJnc1xuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5jb250cmFjdC5wcm92aWRlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gcnBjIG1ldGhvZCBwcm92aWRlciBzcGVjaWZpZWRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb250cmFjdC5wcm92aWRlci5yZWFkQ29udHJhY3Qoe1xuICAgICAgZXhlY3V0aW9uOiB0aGlzLmNvbnRyYWN0LnB1cmVFbmNvZGVNZXRob2QoXCIwXCIsIG1ldGhvZCwgLi4uYXJncyksXG4gICAgICBjYWxsZXJBZGRyZXNzOiBjYWxsZXJBZGRyZXNzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0LmRhdGE7XG4gIH1cblxuICBwcml2YXRlIGV4ZWN1dGVNZXRob2QoXG4gICAgbWV0aG9kOiBzdHJpbmcsXG4gICAgYWNjb3VudDogQWNjb3VudCxcbiAgICBnYXNQcmljZTogc3RyaW5nLFxuICAgIGdhc0xpbWl0OiBzdHJpbmcsXG4gICAgYW1vdW50OiBzdHJpbmcsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogdHlwZWRlZlxuICAgIC4uLmFyZ3NcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb250cmFjdC5tZXRob2RzW21ldGhvZF0oLi4uYXJncywge1xuICAgICAgYWNjb3VudDogYWNjb3VudCxcbiAgICAgIGFtb3VudDogYW1vdW50LFxuICAgICAgZ2FzTGltaXQ6IGdhc0xpbWl0LFxuICAgICAgZ2FzUHJpY2U6IGdhc1ByaWNlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZGVjb2RlKGRhdGE6IHN0cmluZyk6IERlY29kZURhdGEge1xuICAgIGlmIChkYXRhLmxlbmd0aCA8IDgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlucHV0IGRhdGEgZXJyb3JcIik7XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZEtleSA9IGRhdGEuc3Vic3RyKDAsIDgpO1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubWV0aG9kc1ttZXRob2RLZXldO1xuICAgIGlmICghbWV0aG9kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1ldGhvZCAke21ldGhvZEtleX0gaXMgbm90IGVyYzIwIG1ldGhvZGApO1xuICAgIH1cbiAgICBjb25zdCBwYXJhbXMgPSBBYmkuZGVjb2RlUGFyYW1ldGVycyhtZXRob2QuaW5wdXRzVHlwZXMsIGRhdGEuc3Vic3RyaW5nKDgpKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWV0aG9kLmlucHV0c1R5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWV0aG9kLmlucHV0c1R5cGVzW2ldID09PSBcImFkZHJlc3NcIikge1xuICAgICAgICBwYXJhbXNbaV0gPSBmcm9tQnl0ZXMoXG4gICAgICAgICAgQnVmZmVyLmZyb20ocGFyYW1zW2ldLnN1YnN0cmluZygyKSwgXCJoZXhcIilcbiAgICAgICAgKS5zdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHZhbHVlc1ttZXRob2QuaW5wdXRzTmFtZXNbaV1dID0gcGFyYW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBtZXRob2Q6IG1ldGhvZC5uYW1lLFxuICAgICAgZGF0YTogdmFsdWVzXG4gICAgfTtcbiAgfVxufVxuIl19