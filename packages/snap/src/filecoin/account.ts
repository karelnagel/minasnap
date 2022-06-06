import { Wallet } from "../interfaces";
import { KeyPair } from "@karelnagel/minasnap-types";
import { getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode } from "@metamask/key-tree";
import bs58check from "bs58check";
// import Client from "mina-signer";
// const client = new Client({ network: "mainnet" });
/**
 * Return derived KeyPair from seed.
 * @param wallet
 */
export async function getKeyPair(wallet: Wallet): Promise<KeyPair> {
  // const snapState = await wallet.request({ method: 'snap_manageState', params: ['get'] }) as MetamaskState;
  // const { derivationPath } = snapState.filecoin.config;
  // const [, , , , , addressIndex] = derivationPath.split('/'); // Todo think through

  const bip44Code = 12586;

  const bip44Node = await wallet.request({
    method: `snap_getBip44Entropy_${bip44Code}`,
    params: []
  }) as JsonBIP44CoinTypeNode;


  const keyDeriver = await getBIP44AddressKeyDeriver(bip44Node);
  const extendedPrivateKey = await keyDeriver(0);// Todo add addressIndex
  const almostPrivateKey = extendedPrivateKey.slice(0, 32);
  almostPrivateKey[0] &= 0x3f;

  const childPrivateKey = almostPrivateKey.reverse();
  const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`;
  const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'));

  // const publicKey = client.derivePublicKey(privateKey);
  const publicKey ="Publickey coming soon";
  return {
    privateKey,
    publicKey
  };
}
