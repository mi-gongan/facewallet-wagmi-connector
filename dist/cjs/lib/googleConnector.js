"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleConnector = void 0;
const wagmi_1 = require("wagmi");
const face_sdk_1 = require("@haechi-labs/face-sdk");
const faceClass_js_1 = require("./faceClass.js");
const viem_1 = require("viem");
class GoogleConnector extends wagmi_1.Connector {
    constructor({ chains, options, apiKey, }) {
        super({ chains, options });
        this.id = "faceWallet";
        this.name = "FaceWallet";
        this.ready = true;
        this._apiKey = apiKey;
        this._chainId = options.chainId;
        if (!GoogleConnector.face && typeof document !== "undefined") {
            const faceClass = new faceClass_js_1.FaceClass({ chainId: options.chainId, apiKey });
            GoogleConnector.face = faceClass.getFace();
        }
    }
    getFace() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!GoogleConnector.face) {
                const faceClass = new faceClass_js_1.FaceClass({
                    chainId: this._chainId,
                    apiKey: this._apiKey,
                });
                GoogleConnector.face = faceClass.getFace();
            }
            return GoogleConnector.face;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.getProvider();
            this.emit("message", { type: "connecting" });
            let id = yield GoogleConnector.face.getChainId();
            if (yield this.isAuthorized()) {
                const account = yield this.getAccount();
                return {
                    account,
                    chain: { id, unsupported: false },
                    provider: provider,
                };
            }
            yield GoogleConnector.face.auth.directSocialLogin("google.com");
            const account = yield this.getAccount();
            return {
                account,
                chain: { id, unsupported: false },
                provider: provider,
            };
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield GoogleConnector.face.auth.logout();
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const _face = yield this.getFace();
            const account = (yield _face.getAddresses())[0];
            return `0x${account.slice(2)}`;
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            const _face = yield this.getFace();
            const id = yield _face.getChainId();
            return id;
        });
    }
    getProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            const _face = yield this.getFace();
            return (0, viem_1.createPublicClient)({
                chain: this.chains.find((x) => x.id === this._chainId) || this.chains[0],
                transport: (0, viem_1.custom)(_face.getEthLikeProvider()),
            });
        });
    }
    getWalletClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.getProvider();
            const address = yield this.getAccount();
            const chainId = yield this.getChainId();
            return (0, viem_1.createWalletClient)({
                account: address,
                chain: this.chains.find((x) => x.id === chainId) || this.chains[0],
                transport: (0, viem_1.custom)(provider),
            });
        });
    }
    isAuthorized() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.getAccount();
                return !!account;
            }
            catch (_a) {
                return false;
            }
        });
    }
    switchChain(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = String(Number(chainId));
            const currentId = yield this.getChainId();
            if (id !== String(currentId)) {
                if (id === "1") {
                    yield GoogleConnector.face.switchNetwork(face_sdk_1.Network.ETHEREUM);
                }
                else if (id === "80001") {
                    yield GoogleConnector.face.switchNetwork(face_sdk_1.Network.MUMBAI);
                }
            }
            return this.chains.find((x) => x.id === chainId);
        });
    }
    onAccountsChanged(accounts) {
        if (accounts.length === 0)
            this.emit("disconnect");
        else
            this.emit("change", {
                account: (0, viem_1.getAddress)(accounts[0]),
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
exports.GoogleConnector = GoogleConnector;
