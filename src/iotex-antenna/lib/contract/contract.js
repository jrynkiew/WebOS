"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Contract = void 0;

var _web3EthAbi = _interopRequireDefault(require("web3-eth-abi"));

var _method = require("../action/method");

var _address = require("../crypto/address");

var _abiToByte = require("./abi-to-byte");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Abi = _web3EthAbi.default;

class Contract {
  // The json interface for the contract to instantiate
  // This address is necessary for executions and call requests
  // The options of the contract.
  setProvider(provider) {
    this.provider = provider;
  }

  constructor( // tslint:disable-next-line: no-any
  jsonInterface, address, options) {
    _defineProperty(this, "abi", void 0);

    _defineProperty(this, "address", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "provider", void 0);

    _defineProperty(this, "methods", void 0);

    _defineProperty(this, "decodeMethods", void 0);

    this.provider = options && options.provider;

    if (jsonInterface) {
      this.abi = (0, _abiToByte.getAbiFunctions)(jsonInterface);
      const methods = {}; // @ts-ignore

      for (const fnName of Object.keys(this.abi)) {
        // @ts-ignore
        const fnAbi = this.abi[fnName];

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

      this.decodeMethods = methods;
    }

    this.address = address;
    this.options = options; // mount methods

    this.methods = {}; // tslint:disable-next-line: no-for-in

    for (const func in this.abi) {
      if (!this.abi.hasOwnProperty(func)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      this.methods[func] = async (...args) => {
        if (!this.address || !this.abi) {
          throw new Error("must set contract address and abi");
        }

        if (args.length < 1) {
          throw new Error("must set method execute parameter");
        }

        if (!this.provider) {
          throw new Error("no rpc method provider specified");
        }

        const executeParameter = args[args.length - 1];
        const abiFunc = this.abi[func];
        const userInput = {};

        if (!abiFunc.inputs || !Array.isArray(abiFunc.inputs)) {
          return userInput;
        } // tslint:disable-next-line: no-any


        abiFunc.inputs.map((val, i) => {
          // @ts-ignore
          userInput[val.name] = args[i];
        });

        if (abiFunc.stateMutability === "view") {
          const result = await this.provider.readContract({
            execution: this.pureEncodeMethod("0", func, ...args.slice(0, args.length - 1)),
            callerAddress: this.address
          });
          return this.decodeMethodResult(func, result.data);
        }

        const methodEnvelop = this.encodeMethod(executeParameter.amount || "0", func, userInput, executeParameter.gasLimit, executeParameter.gasPrice);
        const method = new _method.ExecutionMethod(this.provider, executeParameter.account, methodEnvelop, {
          signer: this.options && this.options.signer
        });
        return method.execute();
      };
    }
  } // tslint:disable-next-line: no-any


  getABI() {
    return this.abi;
  }

  getAddress() {
    return this.address;
  }

  async deploy(account, // tslint:disable-next-line: no-any
  inputs, amount, gasLimit, gasPrice) {
    if (!this.options) {
      throw new Error("must set contract byte code");
    }

    if (!this.provider) {
      throw new Error("no rpc method provider specified");
    }

    let data = this.options.data || Buffer.from([]);

    if (this.abi && this.abi.hasOwnProperty(_abiToByte.Constructor)) {
      const abiFunc = this.abi[_abiToByte.Constructor];
      const userInput = {}; // @ts-ignore

      if (!abiFunc.inputs || !Array.isArray(abiFunc.inputs)) {
        throw new Error("construtor input error");
      } // @ts-ignore
      // tslint:disable-next-line: no-any


      abiFunc.inputs.map((val, i) => {
        // @ts-ignore
        userInput[val.name] = inputs[i];
      });
      data = Buffer.concat([data, // @ts-ignore
      Buffer.from((0, _abiToByte.encodeArguments)((0, _abiToByte.getArgTypes)(abiFunc), userInput), "hex")]);
    }

    const contractEnvelop = {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      contract: "",
      amount: amount || "0",
      data: data
    };
    return new _method.ExecutionMethod(this.provider, account, contractEnvelop, {
      signer: this.options && this.options.signer
    }).execute();
  }

  pureEncodeMethod(amount, method, ...args) {
    if (!this.address || !this.abi) {
      throw new Error("must set contract address and abi");
    }

    if (!this.abi[method]) {
      throw new Error(`method ${method} does not in abi`);
    }

    const abiFunc = this.abi[method];
    const userInput = {}; // tslint:disable-next-line: no-any

    abiFunc.inputs.map((val, i) => {
      let name = val.name;

      if (name === "") {
        name = `arg${i}`;
      } // @ts-ignore


      userInput[name] = args[i];
    });
    return this.encodeMethod(amount, method, userInput);
  }

  encodeMethod(amount, method, // tslint:disable-next-line:no-any
  input, gasLimit, gasPrice) {
    if (!this.address || !this.abi) {
      throw new Error("must set contract address and abi");
    }

    if (!this.abi[method]) {
      throw new Error(`method ${method} does not in abi`);
    }

    return {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      contract: this.address,
      amount: amount,
      data: Buffer.from((0, _abiToByte.encodeInputData)(this.abi, method, input), "hex")
    };
  }

  decodeMethodResult(method, result) {
    const outTypes = []; // @ts-ignore

    this.getABI()[method].outputs.forEach(field => {
      outTypes.push(field.type);
    });

    if (outTypes.length === 0) {
      return null;
    }

    const results = Abi.decodeParameters(outTypes, result);

    for (let i = 0; i < outTypes.length; i++) {
      if (outTypes[i] === "address") {
        results[i] = (0, _address.fromBytes)(Buffer.from(results[i].substring(2), "hex")).string();
      }

      if (outTypes[i] === "address[]") {
        for (let j = 0; j < results[i].length; j++) {
          results[i][j] = (0, _address.fromBytes)(Buffer.from(results[i][j].substring(2), "hex")).string();
        }
      }
    }

    if (outTypes.length === 1) {
      return results[0];
    }

    return results;
  }

  decodeInput(data) {
    if (data.length < 8) {
      throw new Error("input data error");
    }

    const methodKey = data.substr(0, 8);
    const method = this.decodeMethods[methodKey];

    if (!method) {
      throw new Error(`method ${methodKey} is not contract method`);
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

exports.Contract = Contract;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cmFjdC9jb250cmFjdC50cyJdLCJuYW1lcyI6WyJBYmkiLCJXZWIzQWJpIiwiQ29udHJhY3QiLCJzZXRQcm92aWRlciIsInByb3ZpZGVyIiwiY29uc3RydWN0b3IiLCJqc29uSW50ZXJmYWNlIiwiYWRkcmVzcyIsIm9wdGlvbnMiLCJhYmkiLCJtZXRob2RzIiwiZm5OYW1lIiwiT2JqZWN0Iiwia2V5cyIsImZuQWJpIiwidHlwZSIsImFyZ3MiLCJoZWFkZXIiLCJuYW1lIiwiaW5wdXRzTmFtZXMiLCJtYXAiLCJpIiwiaW5wdXRzVHlwZXMiLCJkZWNvZGVNZXRob2RzIiwiZnVuYyIsImhhc093blByb3BlcnR5IiwiRXJyb3IiLCJsZW5ndGgiLCJleGVjdXRlUGFyYW1ldGVyIiwiYWJpRnVuYyIsInVzZXJJbnB1dCIsImlucHV0cyIsIkFycmF5IiwiaXNBcnJheSIsInZhbCIsInN0YXRlTXV0YWJpbGl0eSIsInJlc3VsdCIsInJlYWRDb250cmFjdCIsImV4ZWN1dGlvbiIsInB1cmVFbmNvZGVNZXRob2QiLCJzbGljZSIsImNhbGxlckFkZHJlc3MiLCJkZWNvZGVNZXRob2RSZXN1bHQiLCJkYXRhIiwibWV0aG9kRW52ZWxvcCIsImVuY29kZU1ldGhvZCIsImFtb3VudCIsImdhc0xpbWl0IiwiZ2FzUHJpY2UiLCJtZXRob2QiLCJFeGVjdXRpb25NZXRob2QiLCJhY2NvdW50Iiwic2lnbmVyIiwiZXhlY3V0ZSIsImdldEFCSSIsImdldEFkZHJlc3MiLCJkZXBsb3kiLCJCdWZmZXIiLCJmcm9tIiwiQ29uc3RydWN0b3IiLCJjb25jYXQiLCJjb250cmFjdEVudmVsb3AiLCJjb250cmFjdCIsImlucHV0Iiwib3V0VHlwZXMiLCJvdXRwdXRzIiwiZm9yRWFjaCIsImZpZWxkIiwicHVzaCIsInJlc3VsdHMiLCJkZWNvZGVQYXJhbWV0ZXJzIiwic3Vic3RyaW5nIiwic3RyaW5nIiwiaiIsImRlY29kZUlucHV0IiwibWV0aG9kS2V5Iiwic3Vic3Ry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QUFLLElBQUl6RCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHNEIsTUFBTSxDQUFDM0IsV0FBUCxDQUFtQkssTUFBdkMsRUFBK0NOLENBQUMsRUFBaEQsRUFBb0Q7QUFDbEQsVUFBSTRCLE1BQU0sQ0FBQzNCLFdBQVAsQ0FBbUJELENBQW5CLE1BQTBCLFNBQTlCLEVBQXlDO0FBQ3ZDd0QsUUFBQUEsTUFBTSxDQUFDeEQsQ0FBRCxDQUFOLEdBQVksd0JBQ1ZvQyxNQUFNLENBQUNDLElBQVAsQ0FBWW1CLE1BQU0sQ0FBQ3hELENBQUQsQ0FBTixDQUFVa0QsU0FBVixDQUFvQixDQUFwQixDQUFaLEVBQW9DLEtBQXBDLENBRFUsRUFFVkMsTUFGVSxFQUFaO0FBR0QsT0FMaUQsQ0FNbEQ7OztBQUNBTSxNQUFBQSxNQUFNLENBQUM3QixNQUFNLENBQUM5QixXQUFQLENBQW1CRSxDQUFuQixDQUFELENBQU4sR0FBZ0N3RCxNQUFNLENBQUN4RCxDQUFELENBQXRDO0FBQ0Q7O0FBRUQsV0FBTztBQUNMNEIsTUFBQUEsTUFBTSxFQUFFQSxNQUFNLENBQUMvQixJQURWO0FBRUx5QixNQUFBQSxJQUFJLEVBQUVtQztBQUZELEtBQVA7QUFJRDs7QUFoU21CIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXG5pbXBvcnQgV2ViM0FiaSwgeyBBYmlDb2RlciB9IGZyb20gXCJ3ZWIzLWV0aC1hYmlcIjtcbmltcG9ydCB7IElBY2NvdW50IH0gZnJvbSBcIi4uL2FjY291bnQvYWNjb3VudFwiO1xuaW1wb3J0IHsgRXhlY3V0aW9uTWV0aG9kLCBTaWduZXJQbHVnaW4gfSBmcm9tIFwiLi4vYWN0aW9uL21ldGhvZFwiO1xuaW1wb3J0IHsgRXhlY3V0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi90eXBlc1wiO1xuaW1wb3J0IHsgZnJvbUJ5dGVzIH0gZnJvbSBcIi4uL2NyeXB0by9hZGRyZXNzXCI7XG5pbXBvcnQgeyBJUnBjTWV0aG9kIH0gZnJvbSBcIi4uL3JwYy1tZXRob2QvdHlwZXNcIjtcbmltcG9ydCB7IEFCSURlZmluaXRpb24gfSBmcm9tIFwiLi9hYmlcIjtcbmltcG9ydCB7XG4gIEFiaUJ5RnVuYyxcbiAgQ29uc3RydWN0b3IsXG4gIGVuY29kZUFyZ3VtZW50cyxcbiAgZW5jb2RlSW5wdXREYXRhLFxuICBnZXRBYmlGdW5jdGlvbnMsXG4gIGdldEFyZ1R5cGVzLFxuICBnZXRIZWFkZXJIYXNoXG59IGZyb20gXCIuL2FiaS10by1ieXRlXCI7XG5cbmNvbnN0IEFiaSA9IChXZWIzQWJpIGFzIHVua25vd24pIGFzIEFiaUNvZGVyO1xuZXhwb3J0IHR5cGUgT3B0aW9ucyA9IHtcbiAgLy8gVGhlIGJ5dGUgY29kZSBvZiB0aGUgY29udHJhY3QuIFVzZWQgd2hlbiB0aGUgY29udHJhY3QgZ2V0cyBkZXBsb3llZFxuICBkYXRhPzogQnVmZmVyO1xuICBwcm92aWRlcj86IElScGNNZXRob2Q7XG4gIHNpZ25lcj86IFNpZ25lclBsdWdpbjtcbn07XG5cbmV4cG9ydCBjbGFzcyBDb250cmFjdCB7XG4gIC8vIFRoZSBqc29uIGludGVyZmFjZSBmb3IgdGhlIGNvbnRyYWN0IHRvIGluc3RhbnRpYXRlXG4gIHByaXZhdGUgcmVhZG9ubHkgYWJpPzogQWJpQnlGdW5jO1xuXG4gIC8vIFRoaXMgYWRkcmVzcyBpcyBuZWNlc3NhcnkgZm9yIGV4ZWN1dGlvbnMgYW5kIGNhbGwgcmVxdWVzdHNcbiAgcHJpdmF0ZSByZWFkb25seSBhZGRyZXNzPzogc3RyaW5nO1xuXG4gIC8vIFRoZSBvcHRpb25zIG9mIHRoZSBjb250cmFjdC5cbiAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zPzogT3B0aW9ucztcblxuICBwdWJsaWMgcHJvdmlkZXI/OiBJUnBjTWV0aG9kO1xuXG4gIHB1YmxpYyByZWFkb25seSBtZXRob2RzOiB7IFtmdW5jTmFtZTogc3RyaW5nXTogRnVuY3Rpb24gfTtcblxuICBwdWJsaWMgcmVhZG9ubHkgZGVjb2RlTWV0aG9kczogeyBba2V5OiBzdHJpbmddOiBEZWNvZGVNZXRob2QgfTtcblxuICBwdWJsaWMgc2V0UHJvdmlkZXIocHJvdmlkZXI6IElScGNNZXRob2QpOiB2b2lkIHtcbiAgICB0aGlzLnByb3ZpZGVyID0gcHJvdmlkZXI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWFueVxuICAgIGpzb25JbnRlcmZhY2U/OiBBcnJheTxBQklEZWZpbml0aW9uPixcbiAgICBhZGRyZXNzPzogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBPcHRpb25zXG4gICkge1xuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRpb25zICYmIG9wdGlvbnMucHJvdmlkZXI7XG4gICAgaWYgKGpzb25JbnRlcmZhY2UpIHtcbiAgICAgIHRoaXMuYWJpID0gZ2V0QWJpRnVuY3Rpb25zKGpzb25JbnRlcmZhY2UpO1xuICAgICAgY29uc3QgbWV0aG9kcyA9IHt9O1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZm9yIChjb25zdCBmbk5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5hYmkpKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29uc3QgZm5BYmkgPSB0aGlzLmFiaVtmbk5hbWVdO1xuICAgICAgICBpZiAoZm5BYmkudHlwZSA9PT0gXCJjb25zdHJ1Y3RvclwiKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0QXJnVHlwZXMoZm5BYmkpO1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBnZXRIZWFkZXJIYXNoKGZuQWJpLCBhcmdzKTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1ldGhvZHNbaGVhZGVyXSA9IHtcbiAgICAgICAgICBuYW1lOiBmbk5hbWUsXG4gICAgICAgICAgaW5wdXRzTmFtZXM6IGFyZ3MubWFwKGkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGAke2kubmFtZX1gO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGlucHV0c1R5cGVzOiBhcmdzLm1hcChpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBgJHtpLnR5cGV9YDtcbiAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdGhpcy5kZWNvZGVNZXRob2RzID0gbWV0aG9kcztcbiAgICB9XG4gICAgdGhpcy5hZGRyZXNzID0gYWRkcmVzcztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgLy8gbW91bnQgbWV0aG9kc1xuICAgIHRoaXMubWV0aG9kcyA9IHt9O1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tZm9yLWluXG4gICAgZm9yIChjb25zdCBmdW5jIGluIHRoaXMuYWJpKSB7XG4gICAgICBpZiAoIXRoaXMuYWJpLmhhc093blByb3BlcnR5KGZ1bmMpKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250aW51ZVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tZXRob2RzW2Z1bmNdID0gYXN5bmMgKC4uLmFyZ3M6IEFycmF5PGFueT4pID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmFkZHJlc3MgfHwgIXRoaXMuYWJpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibXVzdCBzZXQgY29udHJhY3QgYWRkcmVzcyBhbmQgYWJpXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtdXN0IHNldCBtZXRob2QgZXhlY3V0ZSBwYXJhbWV0ZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnByb3ZpZGVyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gcnBjIG1ldGhvZCBwcm92aWRlciBzcGVjaWZpZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXhlY3V0ZVBhcmFtZXRlcjogTWV0aG9kRXhlY3V0ZVBhcmFtZXRlciA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgYWJpRnVuYyA9IHRoaXMuYWJpW2Z1bmNdO1xuICAgICAgICBjb25zdCB1c2VySW5wdXQgPSB7fTtcbiAgICAgICAgaWYgKCFhYmlGdW5jLmlucHV0cyB8fCAhQXJyYXkuaXNBcnJheShhYmlGdW5jLmlucHV0cykpIHtcbiAgICAgICAgICByZXR1cm4gdXNlcklucHV0O1xuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gICAgICAgIGFiaUZ1bmMuaW5wdXRzLm1hcCgodmFsOiBhbnksIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICB1c2VySW5wdXRbdmFsLm5hbWVdID0gYXJnc1tpXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGFiaUZ1bmMuc3RhdGVNdXRhYmlsaXR5ID09PSBcInZpZXdcIikge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucHJvdmlkZXIucmVhZENvbnRyYWN0KHtcbiAgICAgICAgICAgIGV4ZWN1dGlvbjogdGhpcy5wdXJlRW5jb2RlTWV0aG9kKFxuICAgICAgICAgICAgICBcIjBcIixcbiAgICAgICAgICAgICAgZnVuYyxcbiAgICAgICAgICAgICAgLi4uYXJncy5zbGljZSgwLCBhcmdzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2FsbGVyQWRkcmVzczogdGhpcy5hZGRyZXNzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlTWV0aG9kUmVzdWx0KGZ1bmMsIHJlc3VsdC5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1ldGhvZEVudmVsb3AgPSB0aGlzLmVuY29kZU1ldGhvZChcbiAgICAgICAgICBleGVjdXRlUGFyYW1ldGVyLmFtb3VudCB8fCBcIjBcIixcbiAgICAgICAgICBmdW5jLFxuICAgICAgICAgIHVzZXJJbnB1dCxcbiAgICAgICAgICBleGVjdXRlUGFyYW1ldGVyLmdhc0xpbWl0LFxuICAgICAgICAgIGV4ZWN1dGVQYXJhbWV0ZXIuZ2FzUHJpY2VcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gbmV3IEV4ZWN1dGlvbk1ldGhvZChcbiAgICAgICAgICB0aGlzLnByb3ZpZGVyLFxuICAgICAgICAgIGV4ZWN1dGVQYXJhbWV0ZXIuYWNjb3VudCxcbiAgICAgICAgICBtZXRob2RFbnZlbG9wLFxuICAgICAgICAgIHsgc2lnbmVyOiB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnNpZ25lciB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG1ldGhvZC5leGVjdXRlKCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gIHB1YmxpYyBnZXRBQkkoKTogQWJpQnlGdW5jIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5hYmk7XG4gIH1cblxuICBwdWJsaWMgZ2V0QWRkcmVzcygpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmFkZHJlc3M7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGVwbG95KFxuICAgIGFjY291bnQ6IElBY2NvdW50LFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gICAgaW5wdXRzOiBBcnJheTxhbnk+LFxuICAgIGFtb3VudD86IHN0cmluZyxcbiAgICBnYXNMaW1pdD86IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBnYXNQcmljZT86IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGlmICghdGhpcy5vcHRpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtdXN0IHNldCBjb250cmFjdCBieXRlIGNvZGVcIik7XG4gICAgfVxuICAgIGlmICghdGhpcy5wcm92aWRlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gcnBjIG1ldGhvZCBwcm92aWRlciBzcGVjaWZpZWRcIik7XG4gICAgfVxuXG4gICAgbGV0IGRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YSB8fCBCdWZmZXIuZnJvbShbXSk7XG4gICAgaWYgKHRoaXMuYWJpICYmIHRoaXMuYWJpLmhhc093blByb3BlcnR5KENvbnN0cnVjdG9yKSkge1xuICAgICAgY29uc3QgYWJpRnVuYyA9IHRoaXMuYWJpW0NvbnN0cnVjdG9yXTtcbiAgICAgIGNvbnN0IHVzZXJJbnB1dCA9IHt9O1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgaWYgKCFhYmlGdW5jLmlucHV0cyB8fCAhQXJyYXkuaXNBcnJheShhYmlGdW5jLmlucHV0cykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29uc3RydXRvciBpbnB1dCBlcnJvclwiKTtcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gICAgICBhYmlGdW5jLmlucHV0cy5tYXAoKHZhbDogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB1c2VySW5wdXRbdmFsLm5hbWVdID0gaW5wdXRzW2ldO1xuICAgICAgfSk7XG4gICAgICBkYXRhID0gQnVmZmVyLmNvbmNhdChbXG4gICAgICAgIGRhdGEsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgQnVmZmVyLmZyb20oZW5jb2RlQXJndW1lbnRzKGdldEFyZ1R5cGVzKGFiaUZ1bmMpLCB1c2VySW5wdXQpLCBcImhleFwiKVxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udHJhY3RFbnZlbG9wID0ge1xuICAgICAgZ2FzTGltaXQ6IGdhc0xpbWl0LFxuICAgICAgZ2FzUHJpY2U6IGdhc1ByaWNlLFxuICAgICAgY29udHJhY3Q6IFwiXCIsXG4gICAgICBhbW91bnQ6IGFtb3VudCB8fCBcIjBcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHJldHVybiBuZXcgRXhlY3V0aW9uTWV0aG9kKHRoaXMucHJvdmlkZXIsIGFjY291bnQsIGNvbnRyYWN0RW52ZWxvcCwge1xuICAgICAgc2lnbmVyOiB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnNpZ25lclxuICAgIH0pLmV4ZWN1dGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBwdXJlRW5jb2RlTWV0aG9kKFxuICAgIGFtb3VudDogc3RyaW5nLFxuICAgIG1ldGhvZDogc3RyaW5nLFxuICAgIC4uLmFyZ3M6IEFycmF5PGFueT5cbiAgKTogRXhlY3V0aW9uIHtcbiAgICBpZiAoIXRoaXMuYWRkcmVzcyB8fCAhdGhpcy5hYmkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm11c3Qgc2V0IGNvbnRyYWN0IGFkZHJlc3MgYW5kIGFiaVwiKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmFiaVttZXRob2RdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1ldGhvZCAke21ldGhvZH0gZG9lcyBub3QgaW4gYWJpYCk7XG4gICAgfVxuICAgIGNvbnN0IGFiaUZ1bmMgPSB0aGlzLmFiaVttZXRob2RdO1xuXG4gICAgY29uc3QgdXNlcklucHV0ID0ge307XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1hbnlcbiAgICBhYmlGdW5jLmlucHV0cy5tYXAoKHZhbDogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGxldCBuYW1lID0gdmFsLm5hbWU7XG4gICAgICBpZiAobmFtZSA9PT0gXCJcIikge1xuICAgICAgICBuYW1lID0gYGFyZyR7aX1gO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdXNlcklucHV0W25hbWVdID0gYXJnc1tpXTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmVuY29kZU1ldGhvZChhbW91bnQsIG1ldGhvZCwgdXNlcklucHV0KTtcbiAgfVxuXG4gIHB1YmxpYyBlbmNvZGVNZXRob2QoXG4gICAgYW1vdW50OiBzdHJpbmcsXG4gICAgbWV0aG9kOiBzdHJpbmcsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGlucHV0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LFxuICAgIGdhc0xpbWl0Pzogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIGdhc1ByaWNlPzogc3RyaW5nXG4gICk6IEV4ZWN1dGlvbiB7XG4gICAgaWYgKCF0aGlzLmFkZHJlc3MgfHwgIXRoaXMuYWJpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtdXN0IHNldCBjb250cmFjdCBhZGRyZXNzIGFuZCBhYmlcIik7XG4gICAgfVxuICAgIGlmICghdGhpcy5hYmlbbWV0aG9kXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBtZXRob2QgJHttZXRob2R9IGRvZXMgbm90IGluIGFiaWApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBnYXNMaW1pdDogZ2FzTGltaXQsXG4gICAgICBnYXNQcmljZTogZ2FzUHJpY2UsXG4gICAgICBjb250cmFjdDogdGhpcy5hZGRyZXNzLFxuICAgICAgYW1vdW50OiBhbW91bnQsXG4gICAgICBkYXRhOiBCdWZmZXIuZnJvbShlbmNvZGVJbnB1dERhdGEodGhpcy5hYmksIG1ldGhvZCwgaW5wdXQpLCBcImhleFwiKVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZGVjb2RlTWV0aG9kUmVzdWx0KG1ldGhvZDogc3RyaW5nLCByZXN1bHQ6IHN0cmluZyk6IGFueSB8IEFycmF5PGFueT4ge1xuICAgIGNvbnN0IG91dFR5cGVzID0gW10gYXMgQXJyYXk8c3RyaW5nPjtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmdldEFCSSgpW21ldGhvZF0ub3V0cHV0cy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIG91dFR5cGVzLnB1c2goZmllbGQudHlwZSk7XG4gICAgfSk7XG5cbiAgICBpZiAob3V0VHlwZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRzID0gQWJpLmRlY29kZVBhcmFtZXRlcnMob3V0VHlwZXMsIHJlc3VsdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dFR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3V0VHlwZXNbaV0gPT09IFwiYWRkcmVzc1wiKSB7XG4gICAgICAgIHJlc3VsdHNbaV0gPSBmcm9tQnl0ZXMoXG4gICAgICAgICAgQnVmZmVyLmZyb20ocmVzdWx0c1tpXS5zdWJzdHJpbmcoMiksIFwiaGV4XCIpXG4gICAgICAgICkuc3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAob3V0VHlwZXNbaV0gPT09IFwiYWRkcmVzc1tdXCIpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZXN1bHRzW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgcmVzdWx0c1tpXVtqXSA9IGZyb21CeXRlcyhcbiAgICAgICAgICAgIEJ1ZmZlci5mcm9tKHJlc3VsdHNbaV1bal0uc3Vic3RyaW5nKDIpLCBcImhleFwiKVxuICAgICAgICAgICkuc3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3V0VHlwZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBwdWJsaWMgZGVjb2RlSW5wdXQoZGF0YTogc3RyaW5nKTogRGVjb2RlRGF0YSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoIDwgOCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5wdXQgZGF0YSBlcnJvclwiKTtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kS2V5ID0gZGF0YS5zdWJzdHIoMCwgOCk7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpcy5kZWNvZGVNZXRob2RzW21ldGhvZEtleV07XG4gICAgaWYgKCFtZXRob2QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbWV0aG9kICR7bWV0aG9kS2V5fSBpcyBub3QgY29udHJhY3QgbWV0aG9kYCk7XG4gICAgfVxuICAgIGNvbnN0IHBhcmFtcyA9IEFiaS5kZWNvZGVQYXJhbWV0ZXJzKG1ldGhvZC5pbnB1dHNUeXBlcywgZGF0YS5zdWJzdHJpbmcoOCkpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXRob2QuaW5wdXRzVHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtZXRob2QuaW5wdXRzVHlwZXNbaV0gPT09IFwiYWRkcmVzc1wiKSB7XG4gICAgICAgIHBhcmFtc1tpXSA9IGZyb21CeXRlcyhcbiAgICAgICAgICBCdWZmZXIuZnJvbShwYXJhbXNbaV0uc3Vic3RyaW5nKDIpLCBcImhleFwiKVxuICAgICAgICApLnN0cmluZygpO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdmFsdWVzW21ldGhvZC5pbnB1dHNOYW1lc1tpXV0gPSBwYXJhbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLm5hbWUsXG4gICAgICBkYXRhOiB2YWx1ZXNcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWV0aG9kRXhlY3V0ZVBhcmFtZXRlciB7XG4gIGFjY291bnQ6IElBY2NvdW50O1xuICBhbW91bnQ/OiBzdHJpbmc7XG4gIGdhc0xpbWl0Pzogc3RyaW5nO1xuICBnYXNQcmljZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZWNvZGVEYXRhIHtcbiAgbWV0aG9kOiBzdHJpbmc7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gIGRhdGE6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVjb2RlTWV0aG9kIHtcbiAgbmFtZTogc3RyaW5nO1xuICBpbnB1dHNOYW1lczogW3N0cmluZ107XG4gIGlucHV0c1R5cGVzOiBbc3RyaW5nXTtcbn1cbiJdfQ==