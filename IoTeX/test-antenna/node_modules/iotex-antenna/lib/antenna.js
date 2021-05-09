"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _contract = require("./contract/contract");

var _iotx = require("./iotx");

var _ws = require("./plugin/ws");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Antenna {
  constructor(provider, opts) {
    _defineProperty(this, "iotx", void 0);

    this.iotx = new _iotx.Iotx(provider, {
      signer: opts && opts.signer,
      timeout: opts && opts.timeout,
      apiToken: opts && opts.apiToken
    });
  }

  setProvider(provider) {
    if (typeof provider === "object") {
      if (provider === this.iotx.currentProvider()) {
        return;
      }
    }

    this.iotx.setProvider(provider);
  }

  currentProvider() {
    return this.iotx.currentProvider();
  }

}

exports.default = Antenna;

_defineProperty(Antenna, "modules", {
  Iotx: _iotx.Iotx,
  WsSignerPlugin: _ws.WsSignerPlugin,
  Contract: _contract.Contract
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbnRlbm5hLnRzIl0sIm5hbWVzIjpbIkFudGVubmEiLCJjb25zdHJ1Y3RvciIsInByb3ZpZGVyIiwib3B0cyIsImlvdHgiLCJJb3R4Iiwic2lnbmVyIiwidGltZW91dCIsImFwaVRva2VuIiwic2V0UHJvdmlkZXIiLCJjdXJyZW50UHJvdmlkZXIiLCJXc1NpZ25lclBsdWdpbiIsIkNvbnRyYWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFTZSxNQUFNQSxPQUFOLENBQWM7QUFHM0JDLEVBQUFBLFdBQVcsQ0FBQ0MsUUFBRCxFQUFtQkMsSUFBbkIsRUFBZ0M7QUFBQTs7QUFDekMsU0FBS0MsSUFBTCxHQUFZLElBQUlDLFVBQUosQ0FBU0gsUUFBVCxFQUFtQjtBQUM3QkksTUFBQUEsTUFBTSxFQUFFSCxJQUFJLElBQUlBLElBQUksQ0FBQ0csTUFEUTtBQUU3QkMsTUFBQUEsT0FBTyxFQUFFSixJQUFJLElBQUlBLElBQUksQ0FBQ0ksT0FGTztBQUc3QkMsTUFBQUEsUUFBUSxFQUFFTCxJQUFJLElBQUlBLElBQUksQ0FBQ0s7QUFITSxLQUFuQixDQUFaO0FBS0Q7O0FBWU1DLEVBQUFBLFdBQVcsQ0FBQ1AsUUFBRCxFQUFzQztBQUN0RCxRQUFJLE9BQU9BLFFBQVAsS0FBb0IsUUFBeEIsRUFBa0M7QUFDaEMsVUFBSUEsUUFBUSxLQUFLLEtBQUtFLElBQUwsQ0FBVU0sZUFBVixFQUFqQixFQUE4QztBQUM1QztBQUNEO0FBQ0Y7O0FBQ0QsU0FBS04sSUFBTCxDQUFVSyxXQUFWLENBQXNCUCxRQUF0QjtBQUNEOztBQUVNUSxFQUFBQSxlQUFlLEdBQWU7QUFDbkMsV0FBTyxLQUFLTixJQUFMLENBQVVNLGVBQVYsRUFBUDtBQUNEOztBQWhDMEI7Ozs7Z0JBQVJWLE8sYUFlZjtBQUNGSyxFQUFBQSxJQUFJLEVBQUpBLFVBREU7QUFFRk0sRUFBQUEsY0FBYyxFQUFkQSxrQkFGRTtBQUdGQyxFQUFBQSxRQUFRLEVBQVJBO0FBSEUsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNpZ25lclBsdWdpbiB9IGZyb20gXCIuL2FjdGlvbi9tZXRob2RcIjtcbmltcG9ydCB7IENvbnRyYWN0IH0gZnJvbSBcIi4vY29udHJhY3QvY29udHJhY3RcIjtcbmltcG9ydCB7IElvdHggfSBmcm9tIFwiLi9pb3R4XCI7XG5pbXBvcnQgeyBXc1NpZ25lclBsdWdpbiB9IGZyb20gXCIuL3BsdWdpbi93c1wiO1xuaW1wb3J0IHsgSVJwY01ldGhvZCB9IGZyb20gXCIuL3JwYy1tZXRob2QvdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgT3B0cyA9IHtcbiAgc2lnbmVyPzogU2lnbmVyUGx1Z2luO1xuICB0aW1lb3V0PzogbnVtYmVyO1xuICBhcGlUb2tlbj86IHN0cmluZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFudGVubmEge1xuICBwdWJsaWMgaW90eDogSW90eDtcblxuICBjb25zdHJ1Y3Rvcihwcm92aWRlcjogc3RyaW5nLCBvcHRzPzogT3B0cykge1xuICAgIHRoaXMuaW90eCA9IG5ldyBJb3R4KHByb3ZpZGVyLCB7XG4gICAgICBzaWduZXI6IG9wdHMgJiYgb3B0cy5zaWduZXIsXG4gICAgICB0aW1lb3V0OiBvcHRzICYmIG9wdHMudGltZW91dCxcbiAgICAgIGFwaVRva2VuOiBvcHRzICYmIG9wdHMuYXBpVG9rZW5cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbW9kdWxlczoge1xuICAgIElvdHg6IHR5cGVvZiBJb3R4O1xuICAgIFdzU2lnbmVyUGx1Z2luOiB0eXBlb2YgV3NTaWduZXJQbHVnaW47XG4gICAgQ29udHJhY3Q6IHR5cGVvZiBDb250cmFjdDtcbiAgfSA9IHtcbiAgICBJb3R4LFxuICAgIFdzU2lnbmVyUGx1Z2luLFxuICAgIENvbnRyYWN0XG4gIH07XG5cbiAgcHVibGljIHNldFByb3ZpZGVyKHByb3ZpZGVyOiBzdHJpbmcgfCBJUnBjTWV0aG9kKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBwcm92aWRlciA9PT0gXCJvYmplY3RcIikge1xuICAgICAgaWYgKHByb3ZpZGVyID09PSB0aGlzLmlvdHguY3VycmVudFByb3ZpZGVyKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmlvdHguc2V0UHJvdmlkZXIocHJvdmlkZXIpO1xuICB9XG5cbiAgcHVibGljIGN1cnJlbnRQcm92aWRlcigpOiBJUnBjTWV0aG9kIHtcbiAgICByZXR1cm4gdGhpcy5pb3R4LmN1cnJlbnRQcm92aWRlcigpO1xuICB9XG59XG4iXX0=