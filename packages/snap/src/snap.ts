import {EmptyMetamaskState, Wallet} from "./interfaces";
import {exportPrivateKey} from "./rpc/exportPrivateKey";
import {getPublicKey} from "./rpc/getPublicKey";
import {getApi} from "./filecoin/api";
import {LotusRpcApi} from "./filecoin/types";
import {getBalance} from "./rpc/getBalance";
import {configure} from "./rpc/configure";
import {getMessages} from "./rpc/getMessages";
import {signMessage, signMessageRaw} from "./rpc/signMessage";
import {sendMessage} from "./rpc/sendMessage";
import {estimateMessageGas} from "./rpc/estimateMessageGas";

declare let wallet: Wallet;

const apiDependentMethods = [
  "mina_getBalance", "mina_signMessage", "mina_sendMessage", "mina_getGasForMessage", "mina_configure"
];

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    // initialize state if empty and set default config
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', EmptyMetamaskState()],
    });
  }

  let api: LotusRpcApi;
  // initialize lotus RPC api if needed
  if (apiDependentMethods.indexOf(requestObject.method) >= 0) {
    api = await getApi(wallet);
  }

  switch (requestObject.method) {
    case "mina_configure":
      const resp = await configure(
        wallet, requestObject.params.configuration.network, requestObject.params.configuration
      );
      api = resp.api;
      return resp.snapConfig;
    case "mina_getPublicKey":
      return await getPublicKey(wallet);
    case "mina_exportPrivateKey":
      return exportPrivateKey(wallet);
    case "mina_getBalance":
      const balance = await getBalance(wallet, api);
      return balance;
    case "mina_getMessages":
      return getMessages(wallet);
    case "mina_signMessage":
      return await signMessage(wallet, api, requestObject.params.message);
    case "mina_signMessageRaw":
      return await signMessageRaw(wallet, requestObject.params.message);
    case "mina_sendMessage":
      return await sendMessage(wallet, api, requestObject.params.signedMessage);
    case "mina_getGasForMessage":
      return await estimateMessageGas(wallet, api, requestObject.params.message, requestObject.params.maxFee);
    default:
      throw new Error("Unsupported RPC method");
  }
});
