export interface GetPublicKeyRequest{
  method: "mina_getPublicKey";
}

export interface GetAddressRequest {
  method: "mina_getAddress";
}

export interface ExportSeedRequest {
  method: "mina_exportPrivateKey";
}

export interface ConfigureRequest {
  method: "mina_configure";
  params: {
    configuration: SnapConfig;
  };
}

export interface SignMessageRequest {
  method: "mina_signMessage";
  params: {
    message: MessageRequest;
  };
}

export interface SignMessageRawRequest {
  method: "mina_signMessageRaw";
  params: {
    message: string;
  };
}

export interface SendMessageRequest {
  method: "mina_sendMessage";
  params: {
    signedMessage: SignedMessage;
  };
}

export interface GetBalanceRequest {
  method: "mina_getBalance";
}

export interface GetMessagesRequest {
  method: "mina_getMessages";
}

export interface GetGasForMessageRequest {
  method: "mina_getGasForMessage";
  params: {
    message: MessageRequest;
    maxFee?: string;
  };
}

export type MetamaskFilecoinRpcRequest =
    GetPublicKeyRequest |
    GetAddressRequest |
    ExportSeedRequest |
    ConfigureRequest |
    GetBalanceRequest |
    GetMessagesRequest |
    SignMessageRequest |
    SignMessageRawRequest |
    SendMessageRequest |
    GetGasForMessageRequest;

type Method = MetamaskFilecoinRpcRequest["method"];

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: [];
}

export interface GetSnapsRequest {
  method: "wallet_getSnaps";
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskFilecoinRpcRequest];
}

export type MetamaskRpcRequest = WalletEnableRequest | GetSnapsRequest | SnapRpcMethodRequest;

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}

export interface SnapConfig {
  derivationPath: string;
  network: FilecoinNetwork;
  rpc: {
    token: string;
    url: string;
  };
  unit?: UnitConfiguration;
}

export type Callback<T> = (arg: T) => void;

// Filecoin types

export interface Message {
  to: string;
  from: string;
  nonce: number;
  value: string;
  gasfeecap: string;
  gaspremium: string;
  gaslimit: number;
  method: number;
  params?: string;
}

export interface SignedMessage {
  message: Message;
  signature: MessageSignature;
}

export interface MessageSignature {
  data: string;
  type: number;
}

export interface SignMessageResponse {
  signedMessage: SignedMessage
  confirmed: boolean
  error: Error
}

export interface SignRawMessageResponse {
  signature: string
  confirmed: boolean
  error: Error
}

export interface MessageRequest {
  to: string;
  value: string;
  gaslimit?: number;
  gasfeecap?: string;
  gaspremium?: string;
  nonce?: number;
  method?: number;
  params?: string;
}

export interface MessageGasEstimate {
  gaslimit: number;
  gasfeecap: string;
  gaspremium: string;
  maxfee: string;
}

export interface MessageStatus {
  message: Message;
  cid: string;
}

export type FilecoinNetwork = "f" | "t";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FilecoinEventApi {}

export interface FilecoinSnapApi {
  getPublicKey(): Promise<string>;
  getBalance(): Promise<string>;
  exportPrivateKey(): Promise<string>;
  configure(configuration: Partial<SnapConfig>): Promise<void>;
  signMessage(message: MessageRequest): Promise<SignMessageResponse>;
  signMessageRaw(message: string): Promise<SignRawMessageResponse>;
  sendMessage(signedMessage: SignedMessage): Promise<MessageStatus>;
  getMessages(): Promise<MessageStatus[]>;
  calculateGasForMessage(message: MessageRequest, maxFee?: string): Promise<MessageGasEstimate>;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}