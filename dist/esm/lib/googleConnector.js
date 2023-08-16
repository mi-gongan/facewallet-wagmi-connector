import { Connector } from "wagmi";
import { Network } from "@haechi-labs/face-sdk";
import { FaceClass } from "./faceClass.js";
import { createWalletClient, custom, getAddress, createPublicClient, } from "viem";
export class GoogleConnector extends Connector {
    static face;
    _apiKey;
    _chainId;
    id = "faceWallet";
    name = "FaceWallet";
    ready = true;
    constructor({ chains, options, apiKey, }) {
        super({ chains, options });
        this._apiKey = apiKey;
        this._chainId = options.chainId;
        if (!GoogleConnector.face && typeof document !== "undefined") {
            const faceClass = new FaceClass({ chainId: options.chainId, apiKey });
            GoogleConnector.face = faceClass.getFace();
        }
    }
    async getFace() {
        if (!GoogleConnector.face) {
            const faceClass = new FaceClass({
                chainId: this._chainId,
                apiKey: this._apiKey,
            });
            GoogleConnector.face = faceClass.getFace();
        }
        return GoogleConnector.face;
    }
    async connect() {
        const provider = await this.getProvider();
        this.emit("message", { type: "connecting" });
        let id = await GoogleConnector.face.getChainId();
        if (await this.isAuthorized()) {
            const account = await this.getAccount();
            return {
                account,
                chain: { id, unsupported: false },
                provider: provider,
            };
        }
        await GoogleConnector.face.auth.directSocialLogin("google.com");
        const account = await this.getAccount();
        return {
            account,
            chain: { id, unsupported: false },
            provider: provider,
        };
    }
    async disconnect() {
        await GoogleConnector.face.auth.logout();
    }
    async getAccount() {
        const _face = await this.getFace();
        const account = (await _face.getAddresses())[0];
        return `0x${account.slice(2)}`;
    }
    async getChainId() {
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
    async isAuthorized() {
        try {
            const account = await this.getAccount();
            return !!account;
        }
        catch {
            return false;
        }
    }
    async switchChain(chainId) {
        const id = String(Number(chainId));
        const currentId = await this.getChainId();
        if (id !== String(currentId)) {
            if (id === "1") {
                await GoogleConnector.face.switchNetwork(Network.ETHEREUM);
            }
            else if (id === "80001") {
                await GoogleConnector.face.switchNetwork(Network.MUMBAI);
            }
        }
        return this.chains.find((x) => x.id === chainId);
    }
    onAccountsChanged(accounts) {
        if (accounts.length === 0)
            this.emit("disconnect");
        else
            this.emit("change", {
                account: getAddress(accounts[0]),
            });
    }
    onChainChanged(chainId) {
        const id = Number(chainId);
        const unsupported = this.isChainUnsupported(id);
        this.emit("change", { chain: { id, unsupported } });
    }
    onDisconnect() {
        this.emit("disconnect");
    }
}
