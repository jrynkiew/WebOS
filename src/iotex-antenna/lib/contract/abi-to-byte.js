"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbiFunctions = getAbiFunctions;
exports.getArgTypes = getArgTypes;
exports.getHeaderHash = getHeaderHash;
exports.encodeArguments = encodeArguments;
exports.encodeInputData = encodeInputData;
exports.Constructor = void 0;

var _web3EthAbi = _interopRequireDefault(require("web3-eth-abi"));

var address = _interopRequireWildcard(require("../crypto/address"));

var _hash = require("../crypto/hash");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tslint:disable:no-any */
const Abi = _web3EthAbi.default;

function getAbiFunctions(abi) {
  const abiFunctions = {};
  abi.forEach(f => {
    if (f.type === "function") {
      abiFunctions[f.name] = f;
    }

    if (f.type === "constructor") {
      abiFunctions[Constructor] = f;
    }
  });
  return abiFunctions;
}

function getArgTypes(fnAbi) {
  const args = [];
  fnAbi.inputs.forEach(field => {
    args.push({
      name: field.name,
      type: field.type
    });
  });
  return args;
}

function getHeaderHash(fnAbi, args) {
  const inputs = args.map(i => {
    return i.type;
  });
  const signature = `${fnAbi.name}(${inputs.join(",")})`;
  const keccak256 = (0, _hash.hash256b)(signature).toString("hex");
  return keccak256.slice(0, 8);
}

function encodeArguments(args, userInput) {
  const types = [];
  const values = [];
  (args || []).forEach((arg, index) => {
    let name = arg.name;

    if (name === "") {
      name = `arg${index}`;
    }

    if (arg.type === "bool") {
      types.push("uint256");
    } else {
      types.push(arg.type);
    }

    if (userInput.hasOwnProperty(name)) {
      let value = userInput[name];

      if (arg.type === "address") {
        value = address.fromString(value).stringEth();
      }

      if (arg.type === "address[]") {
        for (let i = 0; i < value.length; i++) {
          value[i] = address.fromString(value[i]).stringEth();
        }
      }

      values.push(value);
    } else {
      values.push("");
    }
  });

  try {
    const encoded = Abi.encodeParameters(types, values);
    return encoded.substring(2);
  } catch (e) {
    throw new Error(`failed to rawEncode: ${e.stack}, types: ${types}, values: ${values}`);
  }
}

const Constructor = "constructor";
exports.Constructor = Constructor;

function encodeInputData(abiByFunc, fnName, userInput) {
  const fnAbi = abiByFunc[fnName];
  const args = getArgTypes(fnAbi);
  const header = getHeaderHash(fnAbi, args);
  const encodedArgs = encodeArguments(args, userInput);
  return `${header}${encodedArgs}`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cmFjdC9hYmktdG8tYnl0ZS50cyJdLCJuYW1lcyI6WyJBYmkiLCJXZWIzQWJpIiwiZ2V0QWJpRnVuY3Rpb25zIiwiYWJpIiwiYWJpRnVuY3Rpb25zIiwiZm9yRWFjaCIsImYiLCJ0eXBlIiwibmFtZSIsIkNvbnN0cnVjdG9yIiwiZ2V0QXJnVHlwZXMiLCJmbkFiaSIsImFyZ3MiLCJpbnB1dHMiLCJmaWVsZCIsInB1c2giLCJnZXRIZWFkZXJIYXNoIiwibWFwIiwiaSIsInNpZ25hdHVyZSIsImpvaW4iLCJrZWNjYWsyNTYiLCJ0b1N0cmluZyIsInNsaWNlIiwiZW5jb2RlQXJndW1lbnRzIiwidXNlcklucHV0IiwidHlwZXMiLCJ2YWx1ZXMiLCJhcmciLCJpbmRleCIsImhhc093blByb3BlcnR5IiwidmFsdWUiLCJhZGRyZXNzIiwiZnJvbVN0cmluZyIsInN0cmluZ0V0aCIsImxlbmd0aCIsImVuY29kZWQiLCJlbmNvZGVQYXJhbWV0ZXJzIiwic3Vic3RyaW5nIiwiZSIsIkVycm9yIiwic3RhY2siLCJlbmNvZGVJbnB1dERhdGEiLCJhYmlCeUZ1bmMiLCJmbk5hbWUiLCJoZWFkZXIiLCJlbmNvZGVkQXJncyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBSEE7QUFNQSxNQUFNQSxHQUFHLEdBQUlDLG1CQUFiOztBQU1PLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQXFEO0FBQzFELFFBQU1DLFlBQVksR0FBSSxFQUF0QjtBQUNBRCxFQUFBQSxHQUFHLENBQUNFLE9BQUosQ0FBWUMsQ0FBQyxJQUFJO0FBQ2YsUUFBSUEsQ0FBQyxDQUFDQyxJQUFGLEtBQVcsVUFBZixFQUEyQjtBQUN6QkgsTUFBQUEsWUFBWSxDQUFDRSxDQUFDLENBQUNFLElBQUgsQ0FBWixHQUF1QkYsQ0FBdkI7QUFDRDs7QUFDRCxRQUFJQSxDQUFDLENBQUNDLElBQUYsS0FBVyxhQUFmLEVBQThCO0FBQzVCSCxNQUFB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TUFBNUIsQ0FBaEI7QUFDQSxXQUFPUyxPQUFPLENBQUNFLFNBQVIsQ0FBa0IsQ0FBbEIsQ0FBUDtBQUNELEdBSEQsQ0FHRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixVQUFNLElBQUlDLEtBQUosQ0FDSCx3QkFBdUJELENBQUMsQ0FBQ0UsS0FBTSxZQUFXZixLQUFNLGFBQVlDLE1BQU8sRUFEaEUsQ0FBTjtBQUdEO0FBQ0Y7O0FBRU0sTUFBTWxCLFdBQVcsR0FBRyxhQUFwQjs7O0FBTUEsU0FBU2lDLGVBQVQsQ0FDTEMsU0FESyxFQUVMQyxNQUZLLEVBR0xuQixTQUhLLEVBSUc7QUFDUixRQUFNZCxLQUFLLEdBQUdnQyxTQUFTLENBQUNDLE1BQUQsQ0FBdkI7QUFDQSxRQUFNaEMsSUFBSSxHQUFHRixXQUFXLENBQUNDLEtBQUQsQ0FBeEI7QUFDQSxRQUFNa0MsTUFBTSxHQUFHN0IsYUFBYSxDQUFDTCxLQUFELEVBQVFDLElBQVIsQ0FBNUI7QUFDQSxRQUFNa0MsV0FBVyxHQUFHdEIsZUFBZSxDQUFDWixJQUFELEVBQU9hLFNBQVAsQ0FBbkM7QUFDQSxTQUFRLEdBQUVvQixNQUFPLEdBQUVDLFdBQVksRUFBL0I7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOm5vLWFueSAqL1xuaW1wb3J0IFdlYjNBYmksIHsgQWJpQ29kZXIgfSBmcm9tIFwid2ViMy1ldGgtYWJpXCI7XG5pbXBvcnQgKiBhcyBhZGRyZXNzIGZyb20gXCIuLi9jcnlwdG8vYWRkcmVzc1wiO1xuaW1wb3J0IHsgaGFzaDI1NmIgfSBmcm9tIFwiLi4vY3J5cHRvL2hhc2hcIjtcbmltcG9ydCB7IEV0aEFiaURlY29kZVBhcmFtZXRlcnNUeXBlIH0gZnJvbSBcIi4vYWJpXCI7XG5cbmNvbnN0IEFiaSA9IChXZWIzQWJpIGFzIHVua25vd24pIGFzIEFiaUNvZGVyO1xuXG5leHBvcnQgdHlwZSBBYmlCeUZ1bmMgPSB7XG4gIFtmdW5jOiBzdHJpbmddOiBhbnk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWJpRnVuY3Rpb25zKGFiaTogQXJyYXk8YW55Pik6IEFiaUJ5RnVuYyB7XG4gIGNvbnN0IGFiaUZ1bmN0aW9ucyA9ICh7fSBhcyBhbnkpIGFzIEFiaUJ5RnVuYztcbiAgYWJpLmZvckVhY2goZiA9PiB7XG4gICAgaWYgKGYudHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhYmlGdW5jdGlvbnNbZi5uYW1lXSA9IGY7XG4gICAgfVxuICAgIGlmIChmLnR5cGUgPT09IFwiY29uc3RydWN0b3JcIikge1xuICAgICAgYWJpRnVuY3Rpb25zW0NvbnN0cnVjdG9yXSA9IGY7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYWJpRnVuY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXJnVHlwZXMoZm5BYmk6IHtcbiAgaW5wdXRzOiBBcnJheTx7IG5hbWU6IHN0cmluZzsgdHlwZTogc3RyaW5nIH0+O1xufSk6IEFycmF5PEV0aEFiaURlY29kZVBhcmFtZXRlcnNUeXBlPiB7XG4gIGNvbnN0IGFyZ3MgPSBbXSBhcyBBcnJheTxFdGhBYmlEZWNvZGVQYXJhbWV0ZXJzVHlwZT47XG4gIGZuQWJpLmlucHV0cy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICBhcmdzLnB1c2goeyBuYW1lOiBmaWVsZC5uYW1lLCB0eXBlOiBmaWVsZC50eXBlIH0pO1xuICB9KTtcbiAgcmV0dXJuIGFyZ3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIZWFkZXJIYXNoKFxuICBmbkFiaTogYW55LFxuICBhcmdzOiBBcnJheTxFdGhBYmlEZWNvZGVQYXJhbWV0ZXJzVHlwZT5cbik6IHN0cmluZyB7XG4gIGNvbnN0IGlucHV0cyA9IGFyZ3MubWFwKGkgPT4ge1xuICAgIHJldHVybiBpLnR5cGU7XG4gIH0pO1xuICBjb25zdCBzaWduYXR1cmUgPSBgJHtmbkFiaS5uYW1lfSgke2lucHV0cy5qb2luKFwiLFwiKX0pYDtcbiAgY29uc3Qga2VjY2FrMjU2ID0gaGFzaDI1NmIoc2lnbmF0dXJlKS50b1N0cmluZyhcImhleFwiKTtcbiAgcmV0dXJuIGtlY2NhazI1Ni5zbGljZSgwLCA4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUFyZ3VtZW50cyhcbiAgYXJnczogQXJyYXk8RXRoQWJpRGVjb2RlUGFyYW1ldGVyc1R5cGU+LFxuICB1c2VySW5wdXQ6IFVzZXJJbnB1dFxuKTogc3RyaW5nIHtcbiAgY29uc3QgdHlwZXMgPSBbXSBhcyBBcnJheTxhbnk+O1xuICBjb25zdCB2YWx1ZXMgPSBbXSBhcyBBcnJheTxhbnk+O1xuXG4gIChhcmdzIHx8IFtdKS5mb3JFYWNoKChhcmcsIGluZGV4KSA9PiB7XG4gICAgbGV0IG5hbWUgPSBhcmcubmFtZTtcbiAgICBpZiAobmFtZSA9PT0gXCJcIikge1xuICAgICAgbmFtZSA9IGBhcmcke2luZGV4fWA7XG4gICAgfVxuICAgIGlmIChhcmcudHlwZSA9PT0gXCJib29sXCIpIHtcbiAgICAgIHR5cGVzLnB1c2goXCJ1aW50MjU2XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlcy5wdXNoKGFyZy50eXBlKTtcbiAgICB9XG4gICAgaWYgKHVzZXJJbnB1dC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgbGV0IHZhbHVlID0gdXNlcklucHV0W25hbWVdO1xuICAgICAgaWYgKGFyZy50eXBlID09PSBcImFkZHJlc3NcIikge1xuICAgICAgICB2YWx1ZSA9IGFkZHJlc3MuZnJvbVN0cmluZyh2YWx1ZSkuc3RyaW5nRXRoKCk7XG4gICAgICB9XG4gICAgICBpZiAoYXJnLnR5cGUgPT09IFwiYWRkcmVzc1tdXCIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhbHVlW2ldID0gYWRkcmVzcy5mcm9tU3RyaW5nKHZhbHVlW2ldKS5zdHJpbmdFdGgoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMucHVzaChcIlwiKTtcbiAgICB9XG4gIH0pO1xuICB0cnkge1xuICAgIGNvbnN0IGVuY29kZWQgPSBBYmkuZW5jb2RlUGFyYW1ldGVycyh0eXBlcywgdmFsdWVzKTtcbiAgICByZXR1cm4gZW5jb2RlZC5zdWJzdHJpbmcoMik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgZmFpbGVkIHRvIHJhd0VuY29kZTogJHtlLnN0YWNrfSwgdHlwZXM6ICR7dHlwZXN9LCB2YWx1ZXM6ICR7dmFsdWVzfWBcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBDb25zdHJ1Y3RvciA9IFwiY29uc3RydWN0b3JcIjtcblxudHlwZSBVc2VySW5wdXQgPSB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVJbnB1dERhdGEoXG4gIGFiaUJ5RnVuYzogQWJpQnlGdW5jLFxuICBmbk5hbWU6IHN0cmluZyxcbiAgdXNlcklucHV0OiBVc2VySW5wdXRcbik6IHN0cmluZyB7XG4gIGNvbnN0IGZuQWJpID0gYWJpQnlGdW5jW2ZuTmFtZV07XG4gIGNvbnN0IGFyZ3MgPSBnZXRBcmdUeXBlcyhmbkFiaSk7XG4gIGNvbnN0IGhlYWRlciA9IGdldEhlYWRlckhhc2goZm5BYmksIGFyZ3MpO1xuICBjb25zdCBlbmNvZGVkQXJncyA9IGVuY29kZUFyZ3VtZW50cyhhcmdzLCB1c2VySW5wdXQpO1xuICByZXR1cm4gYCR7aGVhZGVyfSR7ZW5jb2RlZEFyZ3N9YDtcbn1cbiJdfQ==