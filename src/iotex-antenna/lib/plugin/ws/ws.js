"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WsSignerPlugin = void 0;

var _window = _interopRequireDefault(require("global/window"));

var _isomorphicWs = _interopRequireDefault(require("isomorphic-ws"));

var _account = require("../../account/account");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// tslint:disable-next-line:insecure-random
let reqId = Math.round(Math.random() * 10000);

class WsSignerPlugin {
  constructor(provider = "wss://local.iotex.io:64102", options = {
    retryCount: 3,
    retryDuration: 50
  }) {
    _defineProperty(this, "ws", void 0);

    _defineProperty(this, "provider", void 0);

    _defineProperty(this, "options", void 0);

    this.provider = provider;
    this.options = options;
    this.init();
  }

  init() {
    this.ws = new _isomorphicWs.default(this.provider);

    this.ws.onopen = () => {
      _window.default.console.log("[antenna-ws] connected");
    };

    this.ws.onclose = () => {
      _window.default.console.log("[antenna-ws] disconnected");
    };
  }

  send(req) {
    const readyState = this.ws.readyState;

    if (readyState === 1) {
      this.ws.send(JSON.stringify(req));
    } else {
      if (readyState === 2 || readyState === 3) {
        this.init();
      }

      this.reconnectAndSend(this.options.retryCount, req);
    }
  }

  reconnectAndSend(retryCount, req, timeoutId) {
    const readyState = this.ws.readyState;

    if (timeoutId) {
      _window.default.clearTimeout(timeoutId);
    }

    if (retryCount > 0) {
      const id = _window.default.setTimeout(() => {
        if (readyState === 1) {
          this.ws.send(JSON.stringify(req));

          _window.default.clearTimeout(id);
        } else {
          const count = retryCount - 1;
          this.reconnectAndSend(count, req, id);
        }
      }, this.options.retryDuration);
    } else {
      _window.default.console.error("ws plugin connect error, please retry again later.");
    }
  }

  async signAndSend(envelop) {
    const id = reqId++;
    const req = {
      reqId: id,
      envelop: Buffer.from(envelop.bytestream()).toString("hex"),
      type: "SIGN_AND_SEND",
      origin: this.getOrigin()
    };
    this.send(req); // tslint:disable-next-line:promise-must-complete

    return new Promise(resolve => {
      this.ws.onmessage = event => {
        let resp = {
          reqId: -1,
          actionHash: ""
        };

        try {
          if (typeof event.data === "string") {
            resp = JSON.parse(event.data);
          }
        } catch (_) {
          return;
        }

        if (resp.reqId === id) {
          resolve(resp.actionHash);
        }
      };
    });
  }

  async getAccount(address) {
    const acct = new _account.Account();
    acct.address = address;
    return acct;
  }

  async getAccounts() {
    const id = reqId++;
    const req = {
      reqId: id,
      type: "GET_ACCOUNTS"
    };
    this.send(req); // tslint:disable-next-line:promise-must-complete

    return new Promise(resolve => {
      this.ws.onmessage = event => {
        let resp = {
          reqId: -1,
          accounts: []
        };

        try {
          if (typeof event.data === "string") {
            resp = JSON.parse(event.data);
          }
        } catch (_) {
          return;
        }

        if (resp.reqId === id) {
          resolve(resp.accounts);
        }
      };
    });
  }

  getOrigin(plugin = "") {
    let origin = "";

    if (location !== undefined && location.hasOwnProperty("hostname") && location.hostname.length) {
      origin = location.hostname;
    } else {
      origin = plugin;
    }

    if (origin.substr(0, 4) === "www.") {
      origin = origin.replace("www.", "");
    }

    return origin;
  }

  async signMessage(data) {
    const id = reqId++;
    const req = {
      reqId: id,
      msg: data,
      type: "SIGN_MSG"
    };
    this.send(req);
    return new Promise(resolve => {
      this.ws.onmessage = event => {
        let resp = {
          reqId: -1,
          sig: ""
        };

        try {
          if (typeof event.data === "string") {
            resp = JSON.parse(event.data);
          }
        } catch (_) {
          resolve(new Buffer(""));
          return;
        }

        if (resp.reqId === id) {
          resolve(Buffer.from(resp.sig, "hex"));
        }
      };
    });
  }

}

exports.WsSignerPlugin = WsSignerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vd3Mvd3MudHMiXSwibmFtZXMiOlsicmVxSWQiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJXc1NpZ25lclBsdWdpbiIsImNvbnN0cnVjdG9yIiwicHJvdmlkZXIiLCJvcHRpb25zIiwicmV0cnlDb3VudCIsInJldHJ5RHVyYXRpb24iLCJpbml0Iiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJ3aW5kb3ciLCJjb25zb2xlIiwibG9nIiwib25jbG9zZSIsInNlbmQiLCJyZXEiLCJyZWFkeVN0YXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlY29ubmVjdEFuZFNlbmQiLCJ0aW1lb3V0SWQiLCJjbGVhclRpbWVvdXQiLCJpZCIsInNldFRpbWVvdXQiLCJjb3VudCIsImVycm9yIiwic2lnbkFuZFNlbmQiLCJlbnZlbG9wIiwiQnVmZmVyIiwiZnJvbSIsImJ5dGVzdHJlYW0iLCJ0b1N0cmluZyIsInR5cGUiLCJvcmlnaW4iLCJnZXRPcmlnaW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9ubWVzc2FnZSIsImV2ZW50IiwicmVzcCIsImFjdGlvbkhhc2giLCJkYXRhIiwicGFyc2UiLCJfIiwiZ2V0QWNjb3VudCIsImFkZHJlc3MiLCJhY2N0IiwiQWNjb3VudCIsImdldEFjY291bnRzIiwiYWNjb3VudHMiLCJwbHVnaW4iLCJsb2NhdGlvbiIsInVuZGVmaW5lZCIsImhhc093blByb3BlcnR5IiwiaG9zdG5hbWUiLCJsZW5ndGgiLCJzdWJzdHIiLCJyZXBsYWNlIiwic2lnbk1lc3NhZ2UiLCJtc2ciLCJzaWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBS0E7QUFDQSxJQUFJQSxLQUFLLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsS0FBM0IsQ0FBWjs7QUFZTyxNQUFNQyxjQUFOLENBQTZDO0FBT2xEQyxFQUFBQSxXQUFXLENBQ1RDLFFBQWdCLEdB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LEdBQUcsRUFBRWxCLElBRmU7QUFHcEJULE1BQUFBLElBQUksRUFBRTtBQUhjLEtBQXRCO0FBS0EsU0FBS2xCLElBQUwsQ0FBVUMsR0FBVjtBQUNBLFdBQU8sSUFBSW9CLE9BQUosQ0FBb0JDLE9BQU8sSUFBSTtBQUNwQyxXQUFLN0IsRUFBTCxDQUFROEIsU0FBUixHQUFvQkMsS0FBSyxJQUFJO0FBQzNCLFlBQUlDLElBQUksR0FBRztBQUFFM0MsVUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBVjtBQUFhZ0UsVUFBQUEsR0FBRyxFQUFFO0FBQWxCLFNBQVg7O0FBQ0EsWUFBSTtBQUNGLGNBQUksT0FBT3RCLEtBQUssQ0FBQ0csSUFBYixLQUFzQixRQUExQixFQUFvQztBQUNsQ0YsWUFBQUEsSUFBSSxHQUFHdEIsSUFBSSxDQUFDeUIsS0FBTCxDQUFXSixLQUFLLENBQUNHLElBQWpCLENBQVA7QUFDRDtBQUNGLFNBSkQsQ0FJRSxPQUFPRSxDQUFQLEVBQVU7QUFDVlAsVUFBQUEsT0FBTyxDQUFDLElBQUlSLE1BQUosQ0FBVyxFQUFYLENBQUQsQ0FBUDtBQUNBO0FBQ0Q7O0FBQ0QsWUFBSVcsSUFBSSxDQUFDM0MsS0FBTCxLQUFlMEIsRUFBbkIsRUFBdUI7QUFDckJjLFVBQUFBLE9BQU8sQ0FBQ1IsTUFBTSxDQUFDQyxJQUFQLENBQVlVLElBQUksQ0FBQ3FCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUQsQ0FBUDtBQUNEO0FBQ0YsT0FiRDtBQWNELEtBZk0sQ0FBUDtBQWdCRDs7QUE1S2lEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHdpbmRvdyBmcm9tIFwiZ2xvYmFsL3dpbmRvd1wiO1xuaW1wb3J0IFdlYlNvY2tldCBmcm9tIFwiaXNvbW9ycGhpYy13c1wiO1xuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gXCIuLi8uLi9hY2NvdW50L2FjY291bnRcIjtcbmltcG9ydCB7IEVudmVsb3AgfSBmcm9tIFwiLi4vLi4vYWN0aW9uL2VudmVsb3BcIjtcbmltcG9ydCB7IFNpZ25lclBsdWdpbiB9IGZyb20gXCIuLi8uLi9hY3Rpb24vbWV0aG9kXCI7XG5pbXBvcnQgeyBJUmVxdWVzdCB9IGZyb20gXCIuL3JlcXVlc3RcIjtcblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmluc2VjdXJlLXJhbmRvbVxubGV0IHJlcUlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdzU2lnbmVyUGx1Z2luT3B0aW9ucyB7XG4gIHJldHJ5Q291bnQ6IG51bWJlcjtcbiAgcmV0cnlEdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdzUmVxdWVzdCB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFdzU2lnbmVyUGx1Z2luIGltcGxlbWVudHMgU2lnbmVyUGx1Z2luIHtcbiAgcHVibGljIHdzOiBXZWJTb2NrZXQ7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwcm92aWRlcjogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogV3NTaWduZXJQbHVnaW5PcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3ZpZGVyOiBzdHJpbmcgPSBcIndzczovL2xvY2FsLmlvdGV4LmlvOjY0MTAyXCIsXG4gICAgb3B0aW9uczogV3NTaWduZXJQbHVnaW5PcHRpb25zID0geyByZXRyeUNvdW50OiAzLCByZXRyeUR1cmF0aW9uOiA1MCB9XG4gICkge1xuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlcjtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh0aGlzLnByb3ZpZGVyKVxuXG4gICAgdGhpcy53cy5vbm9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICB3aW5kb3cuY29uc29sZS5sb2coXCJbYW50ZW5uYS13c10gY29ubmVjdGVkXCIpOyAgICAgIFxuICAgIH07XG4gICAgdGhpcy53cy5vbmNsb3NlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgd2luZG93LmNvbnNvbGUubG9nKFwiW2FudGVubmEtd3NdIGRpc2Nvbm5lY3RlZFwiKTtcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHNlbmQocmVxOiBXc1JlcXVlc3QpOiB2b2lkIHtcbiAgICBjb25zdCByZWFkeVN0YXRlID0gdGhpcy53cy5yZWFkeVN0YXRlO1xuXG4gICAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShyZXEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlYWR5U3RhdGUgPT09IDIgfHwgcmVhZHlTdGF0ZSA9PT0gMykge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVjb25uZWN0QW5kU2VuZCh0aGlzLm9wdGlvbnMucmV0cnlDb3VudCwgcmVxKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlY29ubmVjdEFuZFNlbmQoXG4gICAgcmV0cnlDb3VudDogbnVtYmVyLFxuICAgIHJlcTogV3NSZXF1ZXN0LFxuICAgIHRpbWVvdXRJZD86IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBjb25zdCByZWFkeVN0YXRlID0gdGhpcy53cy5yZWFkeVN0YXRlO1xuXG4gICAgaWYgKHRpbWVvdXRJZCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cblxuICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgY29uc3QgaWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChyZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcSkpO1xuICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGNvdW50ID0gcmV0cnlDb3VudCAtIDE7XG4gICAgICAgICAgdGhpcy5yZWNvbm5lY3RBbmRTZW5kKGNvdW50LCByZXEsIGlkKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcy5vcHRpb25zLnJldHJ5RHVyYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJ3cyBwbHVnaW4gY29ubmVjdCBlcnJvciwgcGxlYXNlIHJldHJ5IGFnYWluIGxhdGVyLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaWduQW5kU2VuZChlbnZlbG9wOiBFbnZlbG9wKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBpZCA9IHJlcUlkKys7XG4gICAgY29uc3QgcmVxOiBJUmVxdWVzdCA9IHtcbiAgICAgIHJlcUlkOiBpZCxcbiAgICAgIGVudmVsb3A6IEJ1ZmZlci5mcm9tKGVudmVsb3AuYnl0ZXN0cmVhbSgpKS50b1N0cmluZyhcImhleFwiKSxcbiAgICAgIHR5cGU6IFwiU0lHTl9BTkRfU0VORFwiLFxuICAgICAgb3JpZ2luOiB0aGlzLmdldE9yaWdpbigpXG4gICAgfTtcbiAgICB0aGlzLnNlbmQocmVxKTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJvbWlzZS1tdXN0LWNvbXBsZXRlXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLndzLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgbGV0IHJlc3AgPSB7IHJlcUlkOiAtMSwgYWN0aW9uSGFzaDogXCJcIiB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmVzcCA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwLnJlcUlkID09PSBpZCkge1xuICAgICAgICAgIHJlc29sdmUocmVzcC5hY3Rpb25IYXNoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRBY2NvdW50KGFkZHJlc3M6IHN0cmluZyk6IFByb21pc2U8QWNjb3VudD4ge1xuICAgIGNvbnN0IGFjY3QgPSBuZXcgQWNjb3VudCgpO1xuICAgIGFjY3QuYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgcmV0dXJuIGFjY3Q7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0QWNjb3VudHMoKTogUHJvbWlzZTxBcnJheTxBY2NvdW50Pj4ge1xuICAgIGNvbnN0IGlkID0gcmVxSWQrKztcbiAgICBjb25zdCByZXEgPSB7XG4gICAgICByZXFJZDogaWQsXG4gICAgICB0eXBlOiBcIkdFVF9BQ0NPVU5UU1wiXG4gICAgfTtcbiAgICB0aGlzLnNlbmQocmVxKTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJvbWlzZS1tdXN0LWNvbXBsZXRlXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEFycmF5PEFjY291bnQ+PihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMud3Mub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgICBsZXQgcmVzcCA9IHsgcmVxSWQ6IC0xLCBhY2NvdW50czogW10gfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJlc3AgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzcC5yZXFJZCA9PT0gaWQpIHtcbiAgICAgICAgICByZXNvbHZlKHJlc3AuYWNjb3VudHMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldE9yaWdpbihwbHVnaW46IHN0cmluZyA9IFwiXCIpOiBzdHJpbmcge1xuICAgIGxldCBvcmlnaW46IHN0cmluZyA9IFwiXCI7XG4gICAgaWYgKFxuICAgICAgbG9jYXRpb24gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgbG9jYXRpb24uaGFzT3duUHJvcGVydHkoXCJob3N0bmFtZVwiKSAmJlxuICAgICAgbG9jYXRpb24uaG9zdG5hbWUubGVuZ3RoXG4gICAgKSB7XG4gICAgICBvcmlnaW4gPSBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIGlmIChvcmlnaW4uc3Vic3RyKDAsIDQpID09PSBcInd3dy5cIikge1xuICAgICAgb3JpZ2luID0gb3JpZ2luLnJlcGxhY2UoXCJ3d3cuXCIsIFwiXCIpO1xuICAgIH1cbiAgICByZXR1cm4gb3JpZ2luO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ25NZXNzYWdlKFxuICAgIGRhdGE6IHN0cmluZyB8IEJ1ZmZlciB8IFVpbnQ4QXJyYXlcbiAgKTogUHJvbWlzZTxCdWZmZXI+IHtcbiAgICBjb25zdCBpZCA9IHJlcUlkKys7XG4gICAgY29uc3QgcmVxOiBJUmVxdWVzdCA9IHtcbiAgICAgIHJlcUlkOiBpZCxcbiAgICAgIG1zZzogZGF0YSxcbiAgICAgIHR5cGU6IFwiU0lHTl9NU0dcIlxuICAgIH07XG4gICAgdGhpcy5zZW5kKHJlcSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEJ1ZmZlcj4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLndzLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgbGV0IHJlc3AgPSB7IHJlcUlkOiAtMSwgc2lnOiBcIlwiIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXNwID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXNvbHZlKG5ldyBCdWZmZXIoXCJcIikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzcC5yZXFJZCA9PT0gaWQpIHtcbiAgICAgICAgICByZXNvbHZlKEJ1ZmZlci5mcm9tKHJlc3Auc2lnLCBcImhleFwiKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==