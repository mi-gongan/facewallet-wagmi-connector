import { Connector } from "wagmi";
import { Face, Network } from "@haechi-labs/face-sdk";
import { Chain } from "@wagmi/core";
import { FaceClass } from "./faceClass";
import { createWalletClient, custom, getAddress } from "viem";
import { createPublicClient } from "viem";

export class KakaoConnector extends Connector {
  static face: Face;
  private _apiKey: string;
  private _chainId: number;

  readonly id = "faceWallet";
  readonly name = "FaceWallet";
  readonly ready = true;

  constructor({
    chains,
    options,
    apiKey,
  }: {
    chains?: Chain[] | undefined;
    options?: any;
    apiKey: string;
  }) {
    super({ chains, options });
    this._apiKey = apiKey;
    this._chainId = options.chainId;
    if (!KakaoConnector.face && typeof document !== "undefined") {
      const faceClass = new FaceClass({ chainId: options.chainId, apiKey });
      KakaoConnector.face = faceClass.getFace();
    }
  }

  async getFace() {
    if (!KakaoConnector.face) {
      const faceClass = new FaceClass({
        chainId: this._chainId,
        apiKey: this._apiKey,
      });
      KakaoConnector.face = faceClass.getFace();
    }
    return KakaoConnector.face;
  }

  async connect() {
    const provider = await this.getProvider();
    this.emit("message", { type: "connecting" });
    let id = await KakaoConnector.face.getChainId();
    if (await this.isAuthorized()) {
      const account = await this.getAccount();
      return {
        account,
        chain: { id, unsupported: false },
        provider: provider,
      };
    }
    await KakaoConnector.face.auth.directSocialLogin("kakao.com");

    const account = await this.getAccount();

    return {
      account,
      chain: { id, unsupported: false },
      provider: provider,
    };
  }

  async disconnect(): Promise<void> {
    await KakaoConnector.face.auth.logout();
  }

  async getAccount(): Promise<`0x${string}`> {
    const _face = await this.getFace();
    const account = (await _face.getAddresses())[0];
    return `0x${account.slice(2)}`;
  }
  async getChainId(): Promise<number> {
    const _face = await this.getFace();
    const id = await _face.getChainId();
    return id;
  }
  async getProvider() {
    const _face = await this.getFace();
    return createPublicClient({
      chain: this.chains.find((x) => x.id === this._chainId) || this.chains[0],
      transport: custom(_face.getEthLikeProvider()),
    });
  }
  async getWalletClient() {
    const provider = await this.getProvider();
    const address = await this.getAccount();
    const chainId = await this.getChainId();
    return createWalletClient({
      account: address,
      chain: this.chains.find((x) => x.id === chainId) || this.chains[0],
      transport: custom(provider),
    });
  }
  async isAuthorized(): Promise<boolean> {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }
  async switchChain(chainId: any): Promise<Chain> {
    const id = String(Number(chainId));
    const currentId = await this.getChainId();
    if (id !== String(currentId)) {
      if (id === "1") {
        await KakaoConnector.face.switchNetwork(Network.ETHEREUM);
      } else if (id === "80001") {
        await KakaoConnector.face.switchNetwork(Network.MUMBAI);
      }
    }
    return this.chains.find((x) => x.id === chainId)!;
  }
  protected onAccountsChanged(accounts: `0x${string}`[]): void {
    if (accounts.length === 0) this.emit("disconnect");
    else
      this.emit("change", {
        account: getAddress(accounts[0]) as `0x${string}`,
      });
  }
  protected onChainChanged(chainId: string | number): void {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }
  protected onDisconnect(): void {
    this.emit("disconnect");
  }
}
