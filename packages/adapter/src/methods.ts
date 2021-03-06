import {
  MessageStatus,
  MetamaskFilecoinRpcRequest,
  MessageRequest,
  SignedMessage,
  SignMessageResponse,
  SnapConfig, MessageGasEstimate, SignRawMessageResponse
} from "@karelnagel/minasnap-types";
import {MetamaskFilecoinSnap} from "./snap";

async function sendSnapMethod<T>(request: MetamaskFilecoinRpcRequest, snapId: string): Promise<T> {
  return await window.ethereum.request({
    method: snapId,
    params: [
      request
    ]
  });
}

export async function getPublicKey(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "mina_getPublicKey"}, this.snapId);
}

export async function getBalance(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "mina_getBalance"}, this.snapId);
}

export async function exportPrivateKey(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "mina_exportPrivateKey"}, this.snapId);
}

export async function configure(this: MetamaskFilecoinSnap, configuration: SnapConfig): Promise<void> {
  return await sendSnapMethod({method: "mina_configure", params: {configuration: configuration}}, this.snapId);
}

export async function signMessage(this: MetamaskFilecoinSnap, message: MessageRequest): Promise<SignMessageResponse> {
  return await sendSnapMethod({method: "mina_signMessage", params: {message: message}}, this.snapId);
}

export async function signMessageRaw(this: MetamaskFilecoinSnap, rawMessage: string): Promise<SignRawMessageResponse> {
  return await sendSnapMethod({method: "mina_signMessageRaw", params: {message: rawMessage}}, this.snapId);
}

export async function sendMessage(this: MetamaskFilecoinSnap, signedMessage: SignedMessage): Promise<MessageStatus> {
  return await sendSnapMethod({method: "mina_sendMessage", params: {signedMessage: signedMessage}}, this.snapId);
}

export async function getMessages(this: MetamaskFilecoinSnap): Promise<MessageStatus[]> {
  return await sendSnapMethod({method: "mina_getMessages"}, this.snapId);
}

export async function calculateGasForMessage(
  this: MetamaskFilecoinSnap, message: MessageRequest, maxFee?: string
): Promise<MessageGasEstimate> {
  return await sendSnapMethod(
    {method: "mina_getGasForMessage", params: {maxFee: maxFee, message: message}}, 
    this.snapId,
  );
}