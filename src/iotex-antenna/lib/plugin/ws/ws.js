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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW4vd3Mvd3MudHMiXSwibmFtZXMiOlsicmVxSWQiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJXc1NpZ25lclBsdWdpbiIsImNvbnN0cnVjdG9yIiwicHJvdmlkZXIiLCJvcHRpb25zIiwicmV0cnlDb3VudCIsInJldHJ5RHVyYXRpb24iLCJpbml0Iiwid3MiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJ3aW5kb3ciLCJjb25zb2xlIiwibG9nIiwib25jbG9zZSIsInNlbmQiLCJyZXEiLCJyZWFkeVN0YXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlY29ubmVjdEFuZFNlbmQiLCJ0aW1lb3V0SWQiLCJjbGVhclRpbWVvdXQiLCJpZCIsInNldFRpbWVvdXQiLCJjb3VudCIsImVycm9yIiwic2lnbkFuZFNlbmQiLCJlbnZlbG9wIiwiQnVmZmVyIiwiZnJvbSIsImJ5dGVzdHJlYW0iLCJ0b1N0cmluZyIsInR5cGUiLCJvcmlnaW4iLCJnZXRPcmlnaW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9ubWVzc2FnZSIsImV2ZW50IiwicmVzcCIsImFjdGlvbkhhc2giLCJkYXRhIiwicGFyc2UiLCJfIiwiZ2V0QWNjb3VudCIsImFkZHJlc3MiLCJhY2N0IiwiQWNjb3VudCIsImdldEFjY291bnRzIiwiYWNjb3VudHMiLCJwbHVnaW4iLCJsb2NhdGlvbiIsInVuZGVmaW5lZCIsImhhc093blByb3BlcnR5IiwiaG9zdG5hbWUiLCJsZW5ndGgiLCJzdWJzdHIiLCJyZXBsYWNlIiwic2lnbk1lc3NhZ2UiLCJtc2ciLCJzaWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBS0E7QUFDQSxJQUFJQSxLQUFLLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsS0FBM0IsQ0FBWjs7QUFZTyxNQUFNQyxjQUFOLENBQTZDO0FBT2xEQyxFQUFBQSxXQUFXLENBQ1RDLFFBQWdCLEdBQUcsNEJBRFYsRUFFVEMsT0FBOEIsR0FBRztBQUFFQyxJQUFBQSxVQUFVLEVBQUUsQ0FBZDtBQUFpQkMsSUFBQUEsYUFBYSxFQUFFO0FBQWhDLEdBRnhCLEVBR1Q7QUFBQTs7QUFBQTs7QUFBQTs7QUFDQSxTQUFLSCxRQUFMLEdBQWdCQSxRQUFoQjtBQUVBLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUVBLFNBQUtHLElBQUw7QUFDRDs7QUFFT0EsRUFBQUEsSUFBSSxHQUFTO0FBQ25CLFNBQUtDLEVBQUwsR0FBVSxJQUFJQyxxQkFBSixDQUFjLEtBQUtOLFFBQW5CLENBQVY7O0FBQ0EsU0FBS0ssRUFBTCxDQUFRRSxNQUFSLEdBQWlCLE1BQVk7QUFDM0JDLHNCQUFPQyxPQUFQLENBQWVDLEdBQWYsQ0FBbUIsd0JBQW5CO0FBQ0QsS0FGRDs7QUFHQSxTQUFLTCxFQUFMLENBQVFNLE9BQVIsR0FBa0IsTUFBWTtBQUM1Qkgsc0JBQU9DLE9BQVAsQ0FBZUMsR0FBZixDQUFtQiwyQkFBbkI7QUFDRCxLQUZEO0FBR0Q7O0FBRU1FLEVBQUFBLElBQUksQ0FBQ0MsR0FBRCxFQUF1QjtBQUNoQyxVQUFNQyxVQUFVLEdBQUcsS0FBS1QsRUFBTCxDQUFRUyxVQUEzQjs7QUFFQSxRQUFJQSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDcEIsV0FBS1QsRUFBTCxDQUFRTyxJQUFSLENBQWFHLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQWI7QUFDRCxLQUZELE1BRU87QUFDTCxVQUFJQyxVQUFVLEtBQUssQ0FBZixJQUFvQkEsVUFBVSxLQUFLLENBQXZDLEVBQTBDO0FBQ3hDLGFBQUtWLElBQUw7QUFDRDs7QUFDRCxXQUFLYSxnQkFBTCxDQUFzQixLQUFLaEIsT0FBTCxDQUFhQyxVQUFuQyxFQUErQ1csR0FBL0M7QUFDRDtBQUNGOztBQUVPSSxFQUFBQSxnQkFBZ0IsQ0FDdEJmLFVBRHNCLEVBRXRCVyxHQUZzQixFQUd0QkssU0FIc0IsRUFJaEI7QUFDTixVQUFNSixVQUFVLEdBQUcsS0FBS1QsRUFBTCxDQUFRUyxVQUEzQjs7QUFFQSxRQUFJSSxTQUFKLEVBQWU7QUFDYlYsc0JBQU9XLFlBQVAsQ0FBb0JELFNBQXBCO0FBQ0Q7O0FBRUQsUUFBSWhCLFVBQVUsR0FBRyxDQUFqQixFQUFvQjtBQUNsQixZQUFNa0IsRUFBRSxHQUFHWixnQkFBT2EsVUFBUCxDQUFrQixNQUFNO0FBQ2pDLFlBQUlQLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUNwQixlQUFLVCxFQUFMLENBQVFPLElBQVIsQ0FBYUcsSUFBSSxDQUFDQyxTQUFMLENBQWVILEdBQWYsQ0FBYjs7QUFDQUwsMEJBQU9XLFlBQVAsQ0FBb0JDLEVBQXBCO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsZ0JBQU1FLEtBQUssR0FBR3BCLFVBQVUsR0FBRyxDQUEzQjtBQUNBLGVBQUtlLGdCQUFMLENBQXNCSyxLQUF0QixFQUE2QlQsR0FBN0IsRUFBa0NPLEVBQWxDO0FBQ0Q7QUFDRixPQVJVLEVBUVIsS0FBS25CLE9BQUwsQ0FBYUUsYUFSTCxDQUFYO0FBU0QsS0FWRCxNQVVPO0FBQ0xLLHNCQUFPQyxPQUFQLENBQWVjLEtBQWYsQ0FDRSxvREFERjtBQUdEO0FBQ0Y7O0FBRXVCLFFBQVhDLFdBQVcsQ0FBQ0MsT0FBRCxFQUFvQztBQUMxRCxVQUFNTCxFQUFFLEdBQUcxQixLQUFLLEVBQWhCO0FBQ0EsVUFBTW1CLEdBQWEsR0FBRztBQUNwQm5CLE1BQUFBLEtBQUssRUFBRTBCLEVBRGE7QUFFcEJLLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxDQUFDQyxJQUFQLENBQVlGLE9BQU8sQ0FBQ0csVUFBUixFQUFaLEVBQWtDQyxRQUFsQyxDQUEyQyxLQUEzQyxDQUZXO0FBR3BCQyxNQUFBQSxJQUFJLEVBQUUsZUFIYztBQUlwQkMsTUFBQUEsTUFBTSxFQUFFLEtBQUtDLFNBQUw7QUFKWSxLQUF0QjtBQU1BLFNBQUtwQixJQUFMLENBQVVDLEdBQVYsRUFSMEQsQ0FTMUQ7O0FBQ0EsV0FBTyxJQUFJb0IsT0FBSixDQUFvQkMsT0FBTyxJQUFJO0FBQ3BDLFdBQUs3QixFQUFMLENBQVE4QixTQUFSLEdBQW9CQyxLQUFLLElBQUk7QUFDM0IsWUFBSUMsSUFBSSxHQUFHO0FBQUUzQyxVQUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFWO0FBQWE0QyxVQUFBQSxVQUFVLEVBQUU7QUFBekIsU0FBWDs7QUFDQSxZQUFJO0FBQ0YsY0FBSSxPQUFPRixLQUFLLENBQUNHLElBQWIsS0FBc0IsUUFBMUIsRUFBb0M7QUFDbENGLFlBQUFBLElBQUksR0FBR3RCLElBQUksQ0FBQ3lCLEtBQUwsQ0FBV0osS0FBSyxDQUFDRyxJQUFqQixDQUFQO0FBQ0Q7QUFDRixTQUpELENBSUUsT0FBT0UsQ0FBUCxFQUFVO0FBQ1Y7QUFDRDs7QUFDRCxZQUFJSixJQUFJLENBQUMzQyxLQUFMLEtBQWUwQixFQUFuQixFQUF1QjtBQUNyQmMsVUFBQUEsT0FBTyxDQUFDRyxJQUFJLENBQUNDLFVBQU4sQ0FBUDtBQUNEO0FBQ0YsT0FaRDtBQWFELEtBZE0sQ0FBUDtBQWVEOztBQUVzQixRQUFWSSxVQUFVLENBQUNDLE9BQUQsRUFBb0M7QUFDekQsVUFBTUMsSUFBSSxHQUFHLElBQUlDLGdCQUFKLEVBQWI7QUFDQUQsSUFBQUEsSUFBSSxDQUFDRCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxXQUFPQyxJQUFQO0FBQ0Q7O0FBRXVCLFFBQVhFLFdBQVcsR0FBNEI7QUFDbEQsVUFBTTFCLEVBQUUsR0FBRzFCLEtBQUssRUFBaEI7QUFDQSxVQUFNbUIsR0FBRyxHQUFHO0FBQ1ZuQixNQUFBQSxLQUFLLEVBQUUwQixFQURHO0FBRVZVLE1BQUFBLElBQUksRUFBRTtBQUZJLEtBQVo7QUFJQSxTQUFLbEIsSUFBTCxDQUFVQyxHQUFWLEVBTmtELENBT2xEOztBQUNBLFdBQU8sSUFBSW9CLE9BQUosQ0FBNEJDLE9BQU8sSUFBSTtBQUM1QyxXQUFLN0IsRUFBTCxDQUFROEIsU0FBUixHQUFvQkMsS0FBSyxJQUFJO0FBQzNCLFlBQUlDLElBQUksR0FBRztBQUFFM0MsVUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBVjtBQUFhcUQsVUFBQUEsUUFBUSxFQUFFO0FBQXZCLFNBQVg7O0FBQ0EsWUFBSTtBQUNGLGNBQUksT0FBT1gsS0FBSyxDQUFDRyxJQUFiLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDRixZQUFBQSxJQUFJLEdBQUd0QixJQUFJLENBQUN5QixLQUFMLENBQVdKLEtBQUssQ0FBQ0csSUFBakIsQ0FBUDtBQUNEO0FBQ0YsU0FKRCxDQUlFLE9BQU9FLENBQVAsRUFBVTtBQUNWO0FBQ0Q7O0FBQ0QsWUFBSUosSUFBSSxDQUFDM0MsS0FBTCxLQUFlMEIsRUFBbkIsRUFBdUI7QUFDckJjLFVBQUFBLE9BQU8sQ0FBQ0csSUFBSSxDQUFDVSxRQUFOLENBQVA7QUFDRDtBQUNGLE9BWkQ7QUFhRCxLQWRNLENBQVA7QUFlRDs7QUFFTWYsRUFBQUEsU0FBUyxDQUFDZ0IsTUFBYyxHQUFHLEVBQWxCLEVBQThCO0FBQzVDLFFBQUlqQixNQUFjLEdBQUcsRUFBckI7O0FBQ0EsUUFDRWtCLFFBQVEsS0FBS0MsU0FBYixJQUNBRCxRQUFRLENBQUNFLGNBQVQsQ0FBd0IsVUFBeEIsQ0FEQSxJQUVBRixRQUFRLENBQUNHLFFBQVQsQ0FBa0JDLE1BSHBCLEVBSUU7QUFDQXRCLE1BQUFBLE1BQU0sR0FBR2tCLFFBQVEsQ0FBQ0csUUFBbEI7QUFDRCxLQU5ELE1BTU87QUFDTHJCLE1BQUFBLE1BQU0sR0FBR2lCLE1BQVQ7QUFDRDs7QUFFRCxRQUFJakIsTUFBTSxDQUFDdUIsTUFBUCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsTUFBd0IsTUFBNUIsRUFBb0M7QUFDbEN2QixNQUFBQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQ3dCLE9BQVAsQ0FBZSxNQUFmLEVBQXVCLEVBQXZCLENBQVQ7QUFDRDs7QUFDRCxXQUFPeEIsTUFBUDtBQUNEOztBQUV1QixRQUFYeUIsV0FBVyxDQUN0QmpCLElBRHNCLEVBRUw7QUFDakIsVUFBTW5CLEVBQUUsR0FBRzFCLEtBQUssRUFBaEI7QUFDQSxVQUFNbUIsR0FBYSxHQUFHO0FBQ3BCbkIsTUFBQUEsS0FBSyxFQUFFMEIsRUFEYTtBQUVwQnFDLE1BQUFBLEdBQUcsRUFBRWxCLElBRmU7QUFHcEJULE1BQUFBLElBQUksRUFBRTtBQUhjLEtBQXRCO0FBS0EsU0FBS2xCLElBQUwsQ0FBVUMsR0FBVjtBQUNBLFdBQU8sSUFBSW9CLE9BQUosQ0FBb0JDLE9BQU8sSUFBSTtBQUNwQyxXQUFLN0IsRUFBTCxDQUFROEIsU0FBUixHQUFvQkMsS0FBSyxJQUFJO0FBQzNCLFlBQUlDLElBQUksR0FBRztBQUFFM0MsVUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBVjtBQUFhZ0UsVUFBQUEsR0FBRyxFQUFFO0FBQWxCLFNBQVg7O0FBQ0EsWUFBSTtBQUNGLGNBQUksT0FBT3RCLEtBQUssQ0FBQ0csSUFBYixLQUFzQixRQUExQixFQUFvQztBQUNsQ0YsWUFBQUEsSUFBSSxHQUFHdEIsSUFBSSxDQUFDeUIsS0FBTCxDQUFXSixLQUFLLENBQUNHLElBQWpCLENBQVA7QUFDRDtBQUNGLFNBSkQsQ0FJRSxPQUFPRSxDQUFQLEVBQVU7QUFDVlAsVUFBQUEsT0FBTyxDQUFDLElBQUlSLE1BQUosQ0FBVyxFQUFYLENBQUQsQ0FBUDtBQUNBO0FBQ0Q7O0FBQ0QsWUFBSVcsSUFBSSxDQUFDM0MsS0FBTCxLQUFlMEIsRUFBbkIsRUFBdUI7QUFDckJjLFVBQUFBLE9BQU8sQ0FBQ1IsTUFBTSxDQUFDQyxJQUFQLENBQVlVLElBQUksQ0FBQ3FCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUQsQ0FBUDtBQUNEO0FBQ0YsT0FiRDtBQWNELEtBZk0sQ0FBUDtBQWdCRDs7QUEzS2lEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHdpbmRvdyBmcm9tIFwiZ2xvYmFsL3dpbmRvd1wiO1xuaW1wb3J0IFdlYlNvY2tldCBmcm9tIFwiaXNvbW9ycGhpYy13c1wiO1xuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gXCIuLi8uLi9hY2NvdW50L2FjY291bnRcIjtcbmltcG9ydCB7IEVudmVsb3AgfSBmcm9tIFwiLi4vLi4vYWN0aW9uL2VudmVsb3BcIjtcbmltcG9ydCB7IFNpZ25lclBsdWdpbiB9IGZyb20gXCIuLi8uLi9hY3Rpb24vbWV0aG9kXCI7XG5pbXBvcnQgeyBJUmVxdWVzdCB9IGZyb20gXCIuL3JlcXVlc3RcIjtcblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmluc2VjdXJlLXJhbmRvbVxubGV0IHJlcUlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdzU2lnbmVyUGx1Z2luT3B0aW9ucyB7XG4gIHJldHJ5Q291bnQ6IG51bWJlcjtcbiAgcmV0cnlEdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdzUmVxdWVzdCB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFdzU2lnbmVyUGx1Z2luIGltcGxlbWVudHMgU2lnbmVyUGx1Z2luIHtcbiAgcHVibGljIHdzOiBXZWJTb2NrZXQ7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwcm92aWRlcjogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogV3NTaWduZXJQbHVnaW5PcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3ZpZGVyOiBzdHJpbmcgPSBcIndzczovL2xvY2FsLmlvdGV4LmlvOjY0MTAyXCIsXG4gICAgb3B0aW9uczogV3NTaWduZXJQbHVnaW5PcHRpb25zID0geyByZXRyeUNvdW50OiAzLCByZXRyeUR1cmF0aW9uOiA1MCB9XG4gICkge1xuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlcjtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh0aGlzLnByb3ZpZGVyKTtcbiAgICB0aGlzLndzLm9ub3BlbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyhcIlthbnRlbm5hLXdzXSBjb25uZWN0ZWRcIik7XG4gICAgfTtcbiAgICB0aGlzLndzLm9uY2xvc2UgPSAoKTogdm9pZCA9PiB7XG4gICAgICB3aW5kb3cuY29uc29sZS5sb2coXCJbYW50ZW5uYS13c10gZGlzY29ubmVjdGVkXCIpO1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc2VuZChyZXE6IFdzUmVxdWVzdCk6IHZvaWQge1xuICAgIGNvbnN0IHJlYWR5U3RhdGUgPSB0aGlzLndzLnJlYWR5U3RhdGU7XG5cbiAgICBpZiAocmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVhZHlTdGF0ZSA9PT0gMiB8fCByZWFkeVN0YXRlID09PSAzKSB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWNvbm5lY3RBbmRTZW5kKHRoaXMub3B0aW9ucy5yZXRyeUNvdW50LCByZXEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVjb25uZWN0QW5kU2VuZChcbiAgICByZXRyeUNvdW50OiBudW1iZXIsXG4gICAgcmVxOiBXc1JlcXVlc3QsXG4gICAgdGltZW91dElkPzogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHJlYWR5U3RhdGUgPSB0aGlzLndzLnJlYWR5U3RhdGU7XG5cbiAgICBpZiAodGltZW91dElkKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuXG4gICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICBjb25zdCBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkocmVxKSk7XG4gICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgY291bnQgPSByZXRyeUNvdW50IC0gMTtcbiAgICAgICAgICB0aGlzLnJlY29ubmVjdEFuZFNlbmQoY291bnQsIHJlcSwgaWQpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLm9wdGlvbnMucmV0cnlEdXJhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKFxuICAgICAgICBcIndzIHBsdWdpbiBjb25uZWN0IGVycm9yLCBwbGVhc2UgcmV0cnkgYWdhaW4gbGF0ZXIuXCJcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIHNpZ25BbmRTZW5kKGVudmVsb3A6IEVudmVsb3ApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGlkID0gcmVxSWQrKztcbiAgICBjb25zdCByZXE6IElSZXF1ZXN0ID0ge1xuICAgICAgcmVxSWQ6IGlkLFxuICAgICAgZW52ZWxvcDogQnVmZmVyLmZyb20oZW52ZWxvcC5ieXRlc3RyZWFtKCkpLnRvU3RyaW5nKFwiaGV4XCIpLFxuICAgICAgdHlwZTogXCJTSUdOX0FORF9TRU5EXCIsXG4gICAgICBvcmlnaW46IHRoaXMuZ2V0T3JpZ2luKClcbiAgICB9O1xuICAgIHRoaXMuc2VuZChyZXEpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLW11c3QtY29tcGxldGVcbiAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMud3Mub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgICBsZXQgcmVzcCA9IHsgcmVxSWQ6IC0xLCBhY3Rpb25IYXNoOiBcIlwiIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXNwID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3AucmVxSWQgPT09IGlkKSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXNwLmFjdGlvbkhhc2gpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEFjY291bnQoYWRkcmVzczogc3RyaW5nKTogUHJvbWlzZTxBY2NvdW50PiB7XG4gICAgY29uc3QgYWNjdCA9IG5ldyBBY2NvdW50KCk7XG4gICAgYWNjdC5hZGRyZXNzID0gYWRkcmVzcztcbiAgICByZXR1cm4gYWNjdDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRBY2NvdW50cygpOiBQcm9taXNlPEFycmF5PEFjY291bnQ+PiB7XG4gICAgY29uc3QgaWQgPSByZXFJZCsrO1xuICAgIGNvbnN0IHJlcSA9IHtcbiAgICAgIHJlcUlkOiBpZCxcbiAgICAgIHR5cGU6IFwiR0VUX0FDQ09VTlRTXCJcbiAgICB9O1xuICAgIHRoaXMuc2VuZChyZXEpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcm9taXNlLW11c3QtY29tcGxldGVcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QXJyYXk8QWNjb3VudD4+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgICAgIGxldCByZXNwID0geyByZXFJZDogLTEsIGFjY291bnRzOiBbXSB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmVzcCA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwLnJlcUlkID09PSBpZCkge1xuICAgICAgICAgIHJlc29sdmUocmVzcC5hY2NvdW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0T3JpZ2luKHBsdWdpbjogc3RyaW5nID0gXCJcIik6IHN0cmluZyB7XG4gICAgbGV0IG9yaWdpbjogc3RyaW5nID0gXCJcIjtcbiAgICBpZiAoXG4gICAgICBsb2NhdGlvbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBsb2NhdGlvbi5oYXNPd25Qcm9wZXJ0eShcImhvc3RuYW1lXCIpICYmXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZS5sZW5ndGhcbiAgICApIHtcbiAgICAgIG9yaWdpbiA9IGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnaW4gPSBwbHVnaW47XG4gICAgfVxuXG4gICAgaWYgKG9yaWdpbi5zdWJzdHIoMCwgNCkgPT09IFwid3d3LlwiKSB7XG4gICAgICBvcmlnaW4gPSBvcmlnaW4ucmVwbGFjZShcInd3dy5cIiwgXCJcIik7XG4gICAgfVxuICAgIHJldHVybiBvcmlnaW47XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2lnbk1lc3NhZ2UoXG4gICAgZGF0YTogc3RyaW5nIHwgQnVmZmVyIHwgVWludDhBcnJheVxuICApOiBQcm9taXNlPEJ1ZmZlcj4ge1xuICAgIGNvbnN0IGlkID0gcmVxSWQrKztcbiAgICBjb25zdCByZXE6IElSZXF1ZXN0ID0ge1xuICAgICAgcmVxSWQ6IGlkLFxuICAgICAgbXNnOiBkYXRhLFxuICAgICAgdHlwZTogXCJTSUdOX01TR1wiXG4gICAgfTtcbiAgICB0aGlzLnNlbmQocmVxKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QnVmZmVyPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMud3Mub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgICBsZXQgcmVzcCA9IHsgcmVxSWQ6IC0xLCBzaWc6IFwiXCIgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJlc3AgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJlc29sdmUobmV3IEJ1ZmZlcihcIlwiKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwLnJlcUlkID09PSBpZCkge1xuICAgICAgICAgIHJlc29sdmUoQnVmZmVyLmZyb20ocmVzcC5zaWcsIFwiaGV4XCIpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuIl19