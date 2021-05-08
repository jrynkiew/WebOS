import sleepPromise from "sleep-promise";
import Antenna from "iotex-antenna";

import { WsSignerPlugin } from "iotex-antenna/lib/plugin/ws/ws.js";
import { toRau } from "iotex-antenna/lib/account/utils.js";
import { Contract } from "iotex-antenna/lib/contract/contract.js";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
(async () => {
  const antenna = new Antenna("http://api.iotex.one:80", {
    signer: new WsSignerPlugin()
  });

  await sleepPromise(3000);

  // example for transfer
  let resp = await antenna.iotx.sendTransfer({
    to: "io1mwekae7qqwlr23220k5n9z3fmjxz72tuchra3m",
    from: antenna.iotx.accounts[0].address,
    value: toRau("1", "Iotx"),
    gasLimit: "100000",
    gasPrice: toRau("1", "Qev")
  });

  console.log(resp);

  // example for contract call
  // option 1: using simple executeContract shortcut
  resp = await antenna.iotx.executeContract(
    {
      contractAddress: "io1jmq0epcswzu7vyquxlr9j9jvplwpvtc4d50ze9",
      amount: "0",
      abi:
        '[{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
      method: "set",
      gasLimit: "100000",
      gasPrice: toRau("1", "Qev"),
      from: antenna.iotx.accounts[0].address
    },
    666
  );
  console.log(resp);

  // example for contract call
  // option 2: using full-featured contract class
  const contract = new Contract(
    [
      {
        constant: false,
        inputs: [{ name: "x", type: "uint256" }],
        name: "set",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "get",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      }
    ],
    "io1jmq0epcswzu7vyquxlr9j9jvplwpvtc4d50ze9",
    { provider: antenna.iotx, signer: antenna.iotx.signer }
  );
  resp = await contract.methods.set(999, {
    account: antenna.iotx.accounts[0],
    gasLimit: "300000",
    gasPrice: "1000000000000",
    amount: toRau(0, "IOTX")
  });
  console.log(`contract.set() => ${resp}`);

  await sleepPromise(20000);

  resp = await contract.methods.get({ from: antenna.iotx.accounts[0].address });
  console.log(`contract.get() => ${resp}`);
})();
