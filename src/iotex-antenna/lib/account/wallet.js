"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _randombytes = _interopRequireDefault(require("randombytes"));

var _scrypt = _interopRequireDefault(require("scrypt.js"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _address = require("../crypto/address");

var _crypto2 = require("../crypto/crypto");

var _hash = require("../crypto/hash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function runCipherBuffer(cipher, data) {
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

class Wallet {
  constructor() {
    _defineProperty(this, "accounts", void 0);

    _defineProperty(this, "accountsIndex", void 0);

    this.accounts = {};
    this.accountsIndex = 0;
    return new Proxy(this, {
      get: (target, name) => {
        if (target.accounts[name]) {
          return target.accounts[name];
        }

        if (name === "length") {
          return target.accountsIndex;
        } // @ts-ignore


        return target[name];
      }
    });
  }

  add(account) {
    if (!this.accounts[account.address]) {
      this.accounts[this.accountsIndex] = account;
      this.accounts[account.address] = account;
      this.accountsIndex++;
    }
  }

  remove(addressOrIndex) {
    const account = this.accounts[addressOrIndex];

    if (account) {
      // @ts-ignore
      delete this.accounts.delete(account.address);

      if (account.address !== addressOrIndex) {
        // @ts-ignore
        delete this.accounts.delete(addressOrIndex);
      }
    }
  }

} // ported from ethereumjs-wallet


exports.default = Wallet;

function encrypt(privateKey, password, opts = {}) {
  const account = (0, _crypto2.privateKeyToAccount)(privateKey);
  const salt = opts.salt || (0, _randombytes.default)(32);
  const iv = opts.iv || (0, _randombytes.default)(16);
  let derivedKey;
  const kdf = opts.kdf || "scrypt";
  const kdfparams = {
    dklen: opts.dklen || 32,
    salt: salt.toString("hex")
  };

  if (kdf === "pbkdf2") {
    kdfparams.c = opts.c || 262144;
    kdfparams.prf = "hmac-sha256";
    derivedKey = _crypto.default.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, "sha256");
  } else if (kdf === "scrypt") {
    // FIXME: support progress reporting callback
    kdfparams.n = opts.n || 262144;
    kdfparams.r = opts.r || 8;
    kdfparams.p = opts.p || 1;
    derivedKey = (0, _scrypt.default)(Buffer.from(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
  } else {
    throw new Error("Unsupported kdf");
  }

  const cipher = _crypto.default.createCipheriv(opts.cipher || "aes-128-ctr", derivedKey.slice(0, 16), iv);

  if (!cipher) {
    throw new Error("Unsupported cipher");
  }

  const ciphertext = runCipherBuffer(cipher, Buffer.from(privateKey, "hex"));
  const mac = (0, _hash.hash256b)(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
  return {
    version: 3,
    // @ts-ignore
    id: (0, _v.default)({
      random: opts.uuid || (0, _randombytes.default)(16)
    }),
    address: String((0, _address.fromString)(account.address).stringEth()).replace(/^0x/, ""),
    crypto: {
      ciphertext: ciphertext.toString("hex"),
      cipherparams: {
        iv: iv.toString("hex")
      },
      cipher: opts.cipher || "aes-128-ctr",
      kdf: kdf,
      kdfparams: kdfparams,
      mac: mac.toString("hex")
    }
  };
} // ported from ethereumjs-wallet


function decrypt(privateKey, password) {
  let derivedKey;
  let kdfparams;

  if (privateKey.crypto.kdf === "scrypt") {
    kdfparams = privateKey.crypto.kdfparams; // FIXME: support progress reporting callback

    derivedKey = (0, _scrypt.default)(Buffer.from(password), Buffer.from(kdfparams.salt, "hex"), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
  } else if (privateKey.crypto.kdf === "pbkdf2") {
    kdfparams = privateKey.crypto.kdfparams;

    if (kdfparams.prf !== "hmac-sha256") {
      throw new Error("Unsupported parameters to PBKDF2");
    }

    derivedKey = _crypto.default.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, "hex"), kdfparams.c || 0, kdfparams.dklen, "sha256");
  } else {
    throw new Error("Unsupported key derivation scheme");
  }

  const ciphertext = Buffer.from(privateKey.crypto.ciphertext, "hex");
  const mac = (0, _hash.hash256b)(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));

  if (mac.toString("hex") !== privateKey.crypto.mac) {
    throw new Error("Key derivation failed - possibly wrong passphrase");
  }

  const decipher = _crypto.default.createDecipheriv(privateKey.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(privateKey.crypto.cipherparams.iv, "hex"));

  const seed = runCipherBuffer(decipher, ciphertext);
  return (0, _crypto2.privateKeyToAccount)(seed.toString("hex"));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY2NvdW50L3dhbGxldC50cyJdLCJuYW1lcyI6WyJydW5DaXBoZXJCdWZmZXIiLCJjaXBoZXIiLCJkYXRhIiwiQnVmZmVyIiwiY29uY2F0IiwidXBkYXRlIiwiZmluYWwiLCJXYWxsZXQiLCJjb25zdHJ1Y3RvciIsImFjY291bnRzIiwiYWNjb3VudHNJbmRleCIsIlByb3h5IiwiZ2V0IiwidGFyZ2V0IiwibmFtZSIsImFkZCIsImFjY291bnQiLCJhZGRyZXNzIiwicmVtb3ZlIiwiYWRkcmVzc09ySW5kZXgiLCJkZWxldGUiLCJlbmNyeXB0IiwicHJpdmF0ZUtleSIsInBhc3N3b3JkIiwib3B0cyIsInNhbHQiLCJpdiIsImRlcml2ZWRLZXkiLCJrZGYiLCJrZGZwYXJhbXMiLCJka2xlbiIsInRvU3RyaW5nIiwiYyIsInByZiIsImNyeXB0byIsInBia2RmMlN5bmMiLCJmcm9tIiwibiIsInIiLCJwIiwiRXJyb3IiLCJjcmVhdGVDaXBoZXJpdiIsInNsaWNlIiwiY2lwaGVydGV4dCIsIm1hYyIsInZlcnNpb24iLCJpZCIsInJhbmRvbSIsInV1aWQiLCJTdHJpbmciLCJzdHJpbmdFdGgiLCJyZXBsYWNlIiwiY2lwaGVycGFyYW1zIiwiZGVjcnlwdCIsImRlY2lwaGVyIiwiY3JlYXRlRGVjaXBoZXJpdiIsInNlZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFpQ0EsU0FBU0EsZUFBVCxDQUNFQyxNQURGLEVBRUVDLElBRkYsRUFHVTtBQUNSLFNBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLENBQUNILE1BQU0sQ0FBQ0ksTUFBUCxDQUFjSCxJQUFkLENBQUQsRUFBc0JELE1BQU0sQ0FBQ0ssS0FBUCxFQUF0QixDQUFkLENBQVA7QUFDRDs7QUFlYyxNQUFNQyxNQUFOLENBQWE7QUFPMUJDLEVBQUFBLFdBQVcsR0FBRztBQUFBOztBQUFBOztBQUNaLFNBQUtDLFFB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LEVBR2Z2QyxNQUFNLENBQUNpQyxJQUFQLENBQVlkLFVBQVUsQ0FBQ1ksTUFBWCxDQUFrQmtCLFlBQWxCLENBQStCMUIsRUFBM0MsRUFBK0MsS0FBL0MsQ0FIZSxDQUFqQjs7QUFLQSxRQUFNOEIsSUFBSSxHQUFHeEQsZUFBZSxDQUFDc0QsUUFBRCxFQUFXWCxVQUFYLENBQTVCO0FBRUEsU0FBTyxrQ0FBb0JhLElBQUksQ0FBQ3pCLFFBQUwsQ0FBYyxLQUFkLENBQXBCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOm5vLWFueSAqL1xuaW1wb3J0IGNyeXB0bywgeyBDaXBoZXIsIERlY2lwaGVyIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0IHJhbmRvbUJ5dGVzIGZyb20gXCJyYW5kb21ieXRlc1wiO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHNjcnlwdHN5IGZyb20gXCJzY3J5cHQuanNcIjtcbmltcG9ydCB1dWlkdjQgZnJvbSBcInV1aWQvdjRcIjtcbmltcG9ydCB7IGZyb21TdHJpbmcgfSBmcm9tIFwiLi4vY3J5cHRvL2FkZHJlc3NcIjtcbmltcG9ydCB7IHByaXZhdGVLZXlUb0FjY291bnQgfSBmcm9tIFwiLi4vY3J5cHRvL2NyeXB0b1wiO1xuaW1wb3J0IHsgaGFzaDI1NmIgfSBmcm9tIFwiLi4vY3J5cHRvL2hhc2hcIjtcbmltcG9ydCB7IElBY2NvdW50IH0gZnJvbSBcIi4vYWNjb3VudFwiO1xuXG50eXBlIEtkZnBhcmFtcyA9IHtcbiAgZGtsZW46IG51bWJlcjtcbiAgc2FsdDogc3RyaW5nO1xuXG4gIC8vIHNjcnlwdFxuICBuPzogbnVtYmVyO1xuICBwPzogbnVtYmVyO1xuICByPzogbnVtYmVyO1xuXG4gIC8vIHBia2RmMlxuICBjPzogbnVtYmVyO1xuICBwcmY/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFByaXZhdGVLZXkge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGNyeXB0bzoge1xuICAgIGNpcGhlcjogc3RyaW5nO1xuICAgIGNpcGhlcnRleHQ6IHN0cmluZztcbiAgICBjaXBoZXJwYXJhbXM6IHtcbiAgICAgIGl2OiBzdHJpbmc7XG4gICAgfTtcbiAgICBrZGY6IHN0cmluZztcbiAgICBrZGZwYXJhbXM6IEtkZnBhcmFtcztcbiAgICBtYWM6IHN0cmluZztcbiAgfTtcbiAgaWQ6IHN0cmluZztcbiAgdmVyc2lvbjogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBydW5DaXBoZXJCdWZmZXIoXG4gIGNpcGhlcjogQ2lwaGVyIHwgRGVjaXBoZXIsXG4gIGRhdGE6IGNyeXB0by5CaW5hcnlcbik6IEJ1ZmZlciB7XG4gIHJldHVybiBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKGRhdGEpLCBjaXBoZXIuZmluYWwoKV0pO1xufVxuXG50eXBlIEVuY3J5cHRPcHRpb25zID0ge1xuICBjaXBoZXI/OiBzdHJpbmc7XG4gIHNhbHQ/OiBzdHJpbmc7XG4gIGRrbGVuPzogbnVtYmVyO1xuICBpdj86IHN0cmluZztcbiAga2RmPzogc3RyaW5nO1xuICBjPzogbnVtYmVyO1xuICBuPzogbnVtYmVyO1xuICByPzogbnVtYmVyO1xuICBwPzogbnVtYmVyO1xuICB1dWlkPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbGV0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBhY2NvdW50czoge1xuICAgIFtrZXk6IHN0cmluZ106IElBY2NvdW50O1xuICAgIFtpbmRleDogbnVtYmVyXTogSUFjY291bnQ7XG4gIH07XG4gIHByaXZhdGUgYWNjb3VudHNJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWNjb3VudHMgPSB7fTtcbiAgICB0aGlzLmFjY291bnRzSW5kZXggPSAwO1xuXG4gICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIG5hbWU6IHN0cmluZyB8IG51bWJlcikgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LmFjY291bnRzW25hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5hY2NvdW50c1tuYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuYW1lID09PSBcImxlbmd0aFwiKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5hY2NvdW50c0luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZChhY2NvdW50OiBJQWNjb3VudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hY2NvdW50c1thY2NvdW50LmFkZHJlc3NdKSB7XG4gICAgICB0aGlzLmFjY291bnRzW3RoaXMuYWNjb3VudHNJbmRleF0gPSBhY2NvdW50O1xuICAgICAgdGhpcy5hY2NvdW50c1thY2NvdW50LmFkZHJlc3NdID0gYWNjb3VudDtcbiAgICAgIHRoaXMuYWNjb3VudHNJbmRleCsrO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW1vdmUoYWRkcmVzc09ySW5kZXg6IHN0cmluZyB8IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjY291bnRzW2FkZHJlc3NPckluZGV4XTtcbiAgICBpZiAoYWNjb3VudCkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZGVsZXRlIHRoaXMuYWNjb3VudHMuZGVsZXRlKGFjY291bnQuYWRkcmVzcyk7XG4gICAgICBpZiAoYWNjb3VudC5hZGRyZXNzICE9PSBhZGRyZXNzT3JJbmRleCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRlbGV0ZSB0aGlzLmFjY291bnRzLmRlbGV0ZShhZGRyZXNzT3JJbmRleCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIHBvcnRlZCBmcm9tIGV0aGVyZXVtanMtd2FsbGV0XG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdChcbiAgcHJpdmF0ZUtleTogc3RyaW5nLFxuICBwYXNzd29yZDogc3RyaW5nLFxuICBvcHRzOiBFbmNyeXB0T3B0aW9ucyA9IHt9XG4pOiBQcml2YXRlS2V5IHtcbiAgY29uc3QgYWNjb3VudCA9IHByaXZhdGVLZXlUb0FjY291bnQocHJpdmF0ZUtleSk7XG5cbiAgY29uc3Qgc2FsdCA9IG9wdHMuc2FsdCB8fCByYW5kb21CeXRlcygzMik7XG4gIGNvbnN0IGl2ID0gb3B0cy5pdiB8fCByYW5kb21CeXRlcygxNik7XG5cbiAgbGV0IGRlcml2ZWRLZXk7XG4gIGNvbnN0IGtkZiA9IG9wdHMua2RmIHx8IFwic2NyeXB0XCI7XG4gIGNvbnN0IGtkZnBhcmFtczogS2RmcGFyYW1zID0ge1xuICAgIGRrbGVuOiBvcHRzLmRrbGVuIHx8IDMyLFxuICAgIHNhbHQ6IHNhbHQudG9TdHJpbmcoXCJoZXhcIilcbiAgfTtcblxuICBpZiAoa2RmID09PSBcInBia2RmMlwiKSB7XG4gICAga2RmcGFyYW1zLmMgPSBvcHRzLmMgfHwgMjYyMTQ0O1xuICAgIGtkZnBhcmFtcy5wcmYgPSBcImhtYWMtc2hhMjU2XCI7XG4gICAgZGVyaXZlZEtleSA9IGNyeXB0by5wYmtkZjJTeW5jKFxuICAgICAgQnVmZmVyLmZyb20ocGFzc3dvcmQpLFxuICAgICAgc2FsdCxcbiAgICAgIGtkZnBhcmFtcy5jLFxuICAgICAga2RmcGFyYW1zLmRrbGVuLFxuICAgICAgXCJzaGEyNTZcIlxuICAgICk7XG4gIH0gZWxzZSBpZiAoa2RmID09PSBcInNjcnlwdFwiKSB7XG4gICAgLy8gRklYTUU6IHN1cHBvcnQgcHJvZ3Jlc3MgcmVwb3J0aW5nIGNhbGxiYWNrXG4gICAga2RmcGFyYW1zLm4gPSBvcHRzLm4gfHwgMjYyMTQ0O1xuICAgIGtkZnBhcmFtcy5yID0gb3B0cy5yIHx8IDg7XG4gICAga2RmcGFyYW1zLnAgPSBvcHRzLnAgfHwgMTtcbiAgICBkZXJpdmVkS2V5ID0gc2NyeXB0c3koXG4gICAgICBCdWZmZXIuZnJvbShwYXNzd29yZCksXG4gICAgICBzYWx0LFxuICAgICAga2RmcGFyYW1zLm4sXG4gICAgICBrZGZwYXJhbXMucixcbiAgICAgIGtkZnBhcmFtcy5wLFxuICAgICAga2RmcGFyYW1zLmRrbGVuXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBrZGZcIik7XG4gIH1cblxuICBjb25zdCBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoXG4gICAgb3B0cy5jaXBoZXIgfHwgXCJhZXMtMTI4LWN0clwiLFxuICAgIGRlcml2ZWRLZXkuc2xpY2UoMCwgMTYpLFxuICAgIGl2XG4gICk7XG4gIGlmICghY2lwaGVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgY2lwaGVyXCIpO1xuICB9XG5cbiAgY29uc3QgY2lwaGVydGV4dCA9IHJ1bkNpcGhlckJ1ZmZlcihjaXBoZXIsIEJ1ZmZlci5mcm9tKHByaXZhdGVLZXksIFwiaGV4XCIpKTtcblxuICBjb25zdCBtYWMgPSBoYXNoMjU2YihCdWZmZXIuY29uY2F0KFtkZXJpdmVkS2V5LnNsaWNlKDE2LCAzMiksIGNpcGhlcnRleHRdKSk7XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZDogdXVpZHY0KHsgcmFuZG9tOiBvcHRzLnV1aWQgfHwgcmFuZG9tQnl0ZXMoMTYpIH0pLFxuICAgIGFkZHJlc3M6IFN0cmluZyhmcm9tU3RyaW5nKGFjY291bnQuYWRkcmVzcykuc3RyaW5nRXRoKCkpLnJlcGxhY2UoL14weC8sIFwiXCIpLFxuICAgIGNyeXB0bzoge1xuICAgICAgY2lwaGVydGV4dDogY2lwaGVydGV4dC50b1N0cmluZyhcImhleFwiKSxcbiAgICAgIGNpcGhlcnBhcmFtczoge1xuICAgICAgICBpdjogaXYudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIH0sXG4gICAgICBjaXBoZXI6IG9wdHMuY2lwaGVyIHx8IFwiYWVzLTEyOC1jdHJcIixcbiAgICAgIGtkZjoga2RmLFxuICAgICAga2RmcGFyYW1zOiBrZGZwYXJhbXMsXG4gICAgICBtYWM6IG1hYy50b1N0cmluZyhcImhleFwiKVxuICAgIH1cbiAgfTtcbn1cblxuLy8gcG9ydGVkIGZyb20gZXRoZXJldW1qcy13YWxsZXRcbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0KFxuICBwcml2YXRlS2V5OiBQcml2YXRlS2V5LFxuICBwYXNzd29yZDogc3RyaW5nXG4pOiB7IGFkZHJlc3M6IHN0cmluZzsgcHVibGljS2V5OiBzdHJpbmc7IHByaXZhdGVLZXk6IHN0cmluZyB9IHtcbiAgbGV0IGRlcml2ZWRLZXk7XG4gIGxldCBrZGZwYXJhbXM7XG4gIGlmIChwcml2YXRlS2V5LmNyeXB0by5rZGYgPT09IFwic2NyeXB0XCIpIHtcbiAgICBrZGZwYXJhbXMgPSBwcml2YXRlS2V5LmNyeXB0by5rZGZwYXJhbXM7XG5cbiAgICAvLyBGSVhNRTogc3VwcG9ydCBwcm9ncmVzcyByZXBvcnRpbmcgY2FsbGJhY2tcbiAgICBkZXJpdmVkS2V5ID0gc2NyeXB0c3koXG4gICAgICBCdWZmZXIuZnJvbShwYXNzd29yZCksXG4gICAgICBCdWZmZXIuZnJvbShrZGZwYXJhbXMuc2FsdCwgXCJoZXhcIiksXG4gICAgICBrZGZwYXJhbXMubixcbiAgICAgIGtkZnBhcmFtcy5yLFxuICAgICAga2RmcGFyYW1zLnAsXG4gICAgICBrZGZwYXJhbXMuZGtsZW5cbiAgICApO1xuICB9IGVsc2UgaWYgKHByaXZhdGVLZXkuY3J5cHRvLmtkZiA9PT0gXCJwYmtkZjJcIikge1xuICAgIGtkZnBhcmFtcyA9IHByaXZhdGVLZXkuY3J5cHRvLmtkZnBhcmFtcztcblxuICAgIGlmIChrZGZwYXJhbXMucHJmICE9PSBcImhtYWMtc2hhMjU2XCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHBhcmFtZXRlcnMgdG8gUEJLREYyXCIpO1xuICAgIH1cblxuICAgIGRlcml2ZWRLZXkgPSBjcnlwdG8ucGJrZGYyU3luYyhcbiAgICAgIEJ1ZmZlci5mcm9tKHBhc3N3b3JkKSxcbiAgICAgIEJ1ZmZlci5mcm9tKGtkZnBhcmFtcy5zYWx0LCBcImhleFwiKSxcbiAgICAgIGtkZnBhcmFtcy5jIHx8IDAsXG4gICAgICBrZGZwYXJhbXMuZGtsZW4sXG4gICAgICBcInNoYTI1NlwiXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBrZXkgZGVyaXZhdGlvbiBzY2hlbWVcIik7XG4gIH1cblxuICBjb25zdCBjaXBoZXJ0ZXh0ID0gQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5jcnlwdG8uY2lwaGVydGV4dCwgXCJoZXhcIik7XG5cbiAgY29uc3QgbWFjID0gaGFzaDI1NmIoQnVmZmVyLmNvbmNhdChbZGVyaXZlZEtleS5zbGljZSgxNiwgMzIpLCBjaXBoZXJ0ZXh0XSkpO1xuICBpZiAobWFjLnRvU3RyaW5nKFwiaGV4XCIpICE9PSBwcml2YXRlS2V5LmNyeXB0by5tYWMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXkgZGVyaXZhdGlvbiBmYWlsZWQgLSBwb3NzaWJseSB3cm9uZyBwYXNzcGhyYXNlXCIpO1xuICB9XG5cbiAgY29uc3QgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdihcbiAgICBwcml2YXRlS2V5LmNyeXB0by5jaXBoZXIsXG4gICAgZGVyaXZlZEtleS5zbGljZSgwLCAxNiksXG4gICAgQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5jcnlwdG8uY2lwaGVycGFyYW1zLml2LCBcImhleFwiKVxuICApO1xuICBjb25zdCBzZWVkID0gcnVuQ2lwaGVyQnVmZmVyKGRlY2lwaGVyLCBjaXBoZXJ0ZXh0KTtcblxuICByZXR1cm4gcHJpdmF0ZUtleVRvQWNjb3VudChzZWVkLnRvU3RyaW5nKFwiaGV4XCIpKTtcbn1cbiJdfQ==