import { Face } from "@haechi-labs/face-sdk";
import { convertChainIdToName } from "../utils/network.js";
export class FaceClass {
    static face;
    _apiKey;
    _chainId;
    constructor({ chainId, apiKey }) {
        this._apiKey = apiKey;
        this._chainId = chainId;
        if (!FaceClass.face && typeof document !== "undefined") {
            FaceClass.face = new Face({
                network: convertChainIdToName(chainId),
                apiKey,
            });
        }
    }
    getFace() {
        if (!FaceClass.face) {
            FaceClass.face = new Face({
                network: convertChainIdToName(this._chainId),
                apiKey: this._apiKey,
            });
        }
        return FaceClass.face;
    }
}
