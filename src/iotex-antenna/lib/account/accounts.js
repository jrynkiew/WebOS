"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accounts = void 0;

var _account = _interopRequireDefault(require("eth-lib/lib/account"));

var _account2 = require("./account");

var _wallet = _interopRequireDefault(require("./wallet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Accounts extends Array {
  constructor() {
    super();

    _defineProperty(this, "wallet", void 0);

    this.wallet = new _wallet.default();
    return new Proxy(this, {
      get: (target, name) => {
        // @ts-ignore
        if (target.wallet[name]) {
          // @ts-ignore
          return target.wallet[name];
        } // @ts-ignore


        return target[name];
      }
    });
  }

  create(entropy) {
    const acct = _account.default.create(entropy);

    const privateKey = acct.privateKey.substr(2);

    const realAccount = _account2.Account.fromPrivateKey(privateKey);

    this.wallet.add(realAccount);
    return realAccount;
  }

  privateKeyToAccount(privateKey) {
    const account = _account2.Account.fromPrivateKey(privateKey);

    this.wallet.add(account);
    return account;
  }

  addressToAccount(address) {
    const account = _account2.Account.fromAddress(address);

    this.wallet.add(account);
    return account;
  }

  addAccount(account) {
    this.wallet.add(account);
    return account;
  }

  getAccount(address) {
    // @ts-ignore
    return this.wallet[address];
  }

  removeAccount(address) {
    return this.wallet.remove(address);
  }

  async sign(data, privateKey) {
    return _account2.Account.fromPrivateKey(privateKey).sign(data);
  }

}

exports.Accounts = Accounts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY2NvdW50L2FjY291bnRzLnRzIl0sIm5hbWVzIjpbIkFjY291bnRzIiwiQXJyYXkiLCJjb25zdHJ1Y3RvciIsIndhbGxldCIsIldhbGxldCIsIlByb3h5IiwiZ2V0IiwidGFyZ2V0IiwibmFtZSIsImNyZWF0ZSIsImVudHJvcHkiLCJhY2N0IiwiYWNjb3VudCIsInByaXZhdGVLZXkiLCJzdWJzdHIiLCJyZWFsQWNjb3VudCIsIkFjY291bnQiLCJmcm9tUHJpdmF0ZUtleSIsImFkZCIsInByaXZhdGVLZXlUb0FjY291bnQiLCJhZGRyZXNzVG9BY2NvdW50IiwiYWRkcmVzcyIsImZyb21BZGRyZXNzIiwiYWRkQWNjb3VudCIsImdldEFjY291bnQiLCJyZW1vdmVBY2NvdW50IiwicmVtb3ZlIiwic2lnbiIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7O0FBRU8sTUFBTUEsUUFBTixTQUF1QkMsS0FBdkIsQ0FBdUM7QUFHNUNDLEVBQUFBLFdBQVcsR0FBRztBQUNaOztBQURZOztBQUdaLFNBQUtDLE1BQUwsR0FBYyxJQUFJQyxlQUFKLEVBQWQ7QUFFQSxXQUFPLElBQUlDLEtBQUosQ0FBVSxJQUFWLEVBQWdCO0FBQ3JCQyxNQUFBQSxHQUFHLEVBQUUsQ0FBQ0MsTUFBRCxFQUFTQyxJQUFULEtBQW1DO0FBQ3RDO0FBQ0EsWUFBSUQsTUFBTSxDQUFDSixNQUFQLENBQWNLLElBQWQsQ0FBSixFQUF5QjtBQUN2QjtBQUNBLGlCQUFPRCxNQUFNLENBQUNKLE1BQVAsQ0FBY0ssSUFBZCxDQUFQO0FBQ0QsU0FMcUMsQ0FPdEM7OztBQUNBLGVBQU9ELE1BQU0sQ0FBQ0MsSUFBRCxDQUFiO0FBQ0Q7QUFWb0IsS0FBaEIsQ0FBUDtBQVlEOztBQUVNQyxFQUFBQSxNQUFNLENBQUNDLE9BQUQsRUFBNkI7QUFDeEMsVUFBTUMsSUFBSSxHQUFHQyxpQkFBUUgsTUFBUixDQUFlQyxPQUFmLENBQWI7O0FBQ0EsVUFBTUcsVUFBVSxHQUFHRixJQUFJLENBQUNFLFVBQUwsQ0FBZ0JDLE1BQWhCLENBQXVCLENBQXZCLENBQW5COztBQUNBLFVBQU1DLFdBQVcsR0FBR0Msa0JBQVFDLGNBQVIsQ0FBdUJKLFVBQXZCLENBQXBCOztBQUNBLFNBQUtWLE1BQUwsQ0FBWWUsR0FBWixDQUFnQkgsV0FBaEI7QUFDQSxXQUFPQSxXQUFQO0FBQ0Q7O0FBRU1JLEVBQUFBLG1CQUFtQixDQUFDTixVQUFELEVBQStCO0FBQ3ZELFVBQU1ELE9BQU8sR0FBR0ksa0JBQVFDLGNBQVIsQ0FBdUJKLFVBQXZCLENBQWhCOztBQUNBLFNBQUtWLE1BQUwsQ0FBWWUsR0FBWixDQUFnQk4sT0FBaEI7QUFDQSxXQUFPQSxPQUFQO0FBQ0Q7O0FBRU1RLEVBQUFBLGdCQUFnQixDQUFDQyxPQUFELEVBQTRCO0FBQ2pELFVBQU1ULE9BQU8sR0FBR0ksa0JBQVFNLFdBQVIsQ0FBb0JELE9BQXBCLENBQWhCOztBQUNBLFNBQUtsQixNQUFMLENBQVllLEdBQVosQ0FBZ0JOLE9BQWhCO0FBQ0EsV0FBT0EsT0FBUDtBQUNEOztBQUVNVyxFQUFBQSxVQUFVLENBQUNYLE9BQUQsRUFBNkI7QUFDNUMsU0FBS1QsTUFBTCxDQUFZZSxHQUFaLENBQWdCTixPQUFoQjtBQUNBLFdBQU9BLE9BQVA7QUFDRDs7QUFFTVksRUFBQUEsVUFBVSxDQUFDSCxPQUFELEVBQXdDO0FBQ3ZEO0FBQ0EsV0FBTyxLQUFLbEIsTUFBTCxDQUFZa0IsT0FBWixDQUFQO0FBQ0Q7O0FBRU1JLEVBQUFBLGFBQWEsQ0FBQ0osT0FBRCxFQUF3QjtBQUMxQyxXQUFPLEtBQUtsQixNQUFMLENBQVl1QixNQUFaLENBQW1CTCxPQUFuQixDQUFQO0FBQ0Q7O0FBRWdCLFFBQUpNLElBQUksQ0FDZkMsSUFEZSxFQUVmZixVQUZlLEVBR0U7QUFDakIsV0FBT0csa0JBQVFDLGNBQVIsQ0FBdUJKLFVBQXZCLEVBQW1DYyxJQUFuQyxDQUF3Q0MsSUFBeEMsQ0FBUDtBQUNEOztBQTdEMkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBhY2NvdW50IGZyb20gXCJldGgtbGliL2xpYi9hY2NvdW50XCI7XG5cbmltcG9ydCB7IEFjY291bnQgfSBmcm9tIFwiLi9hY2NvdW50XCI7XG5pbXBvcnQgeyBJQWNjb3VudCB9IGZyb20gXCIuL2FjY291bnRcIjtcbmltcG9ydCBXYWxsZXQgZnJvbSBcIi4vd2FsbGV0XCI7XG5cbmV4cG9ydCBjbGFzcyBBY2NvdW50cyBleHRlbmRzIEFycmF5PElBY2NvdW50PiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgd2FsbGV0OiBXYWxsZXQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMud2FsbGV0ID0gbmV3IFdhbGxldCgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIG5hbWU6IHN0cmluZyB8IG51bWJlcikgPT4ge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmICh0YXJnZXQud2FsbGV0W25hbWVdKSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHJldHVybiB0YXJnZXQud2FsbGV0W25hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZShlbnRyb3B5Pzogc3RyaW5nKTogSUFjY291bnQge1xuICAgIGNvbnN0IGFjY3QgPSBhY2NvdW50LmNyZWF0ZShlbnRyb3B5KTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gYWNjdC5wcml2YXRlS2V5LnN1YnN0cigyKTtcbiAgICBjb25zdCByZWFsQWNjb3VudCA9IEFjY291bnQuZnJvbVByaXZhdGVLZXkocHJpdmF0ZUtleSk7XG4gICAgdGhpcy53YWxsZXQuYWRkKHJlYWxBY2NvdW50KTtcbiAgICByZXR1cm4gcmVhbEFjY291bnQ7XG4gIH1cblxuICBwdWJsaWMgcHJpdmF0ZUtleVRvQWNjb3VudChwcml2YXRlS2V5OiBzdHJpbmcpOiBJQWNjb3VudCB7XG4gICAgY29uc3QgYWNjb3VudCA9IEFjY291bnQuZnJvbVByaXZhdGVLZXkocHJpdmF0ZUtleSk7XG4gICAgdGhpcy53YWxsZXQuYWRkKGFjY291bnQpO1xuICAgIHJldHVybiBhY2NvdW50O1xuICB9XG5cbiAgcHVibGljIGFkZHJlc3NUb0FjY291bnQoYWRkcmVzczogc3RyaW5nKTogSUFjY291bnQge1xuICAgIGNvbnN0IGFjY291bnQgPSBBY2NvdW50LmZyb21BZGRyZXNzKGFkZHJlc3MpO1xuICAgIHRoaXMud2FsbGV0LmFkZChhY2NvdW50KTtcbiAgICByZXR1cm4gYWNjb3VudDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRBY2NvdW50KGFjY291bnQ6IEFjY291bnQpOiBJQWNjb3VudCB7XG4gICAgdGhpcy53YWxsZXQuYWRkKGFjY291bnQpO1xuICAgIHJldHVybiBhY2NvdW50O1xuICB9XG5cbiAgcHVibGljIGdldEFjY291bnQoYWRkcmVzczogc3RyaW5nKTogSUFjY291bnQgfCB1bmRlZmluZWQge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gdGhpcy53YWxsZXRbYWRkcmVzc107XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQWNjb3VudChhZGRyZXNzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy53YWxsZXQucmVtb3ZlKGFkZHJlc3MpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ24oXG4gICAgZGF0YTogc3RyaW5nIHwgQnVmZmVyIHwgVWludDhBcnJheSxcbiAgICBwcml2YXRlS2V5OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxCdWZmZXI+IHtcbiAgICByZXR1cm4gQWNjb3VudC5mcm9tUHJpdmF0ZUtleShwcml2YXRlS2V5KS5zaWduKGRhdGEpO1xuICB9XG59XG4iXX0=