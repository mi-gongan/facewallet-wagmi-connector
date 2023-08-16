"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceClass = void 0;
const face_sdk_1 = require("@haechi-labs/face-sdk");
const network_js_1 = require("../utils/network.js");
class FaceClass {
    constructor({ chainId, apiKey }) {
        this._apiKey = apiKey;
        this._chainId = chainId;
        if (!FaceClass.face && typeof document !== "undefined") {
            FaceClass.face = new face_sdk_1.Face({
                network: (0, network_js_1.convertChainIdToName)(chainId),
                apiKey,
            });
        }
    }
    getFace() {
        if (!FaceClass.face) {
            FaceClass.face = new face_sdk_1.Face({
                network: (0, network_js_1.convertChainIdToName)(this._chainId),
                apiKey: this._apiKey,
            });
        }
        return FaceClass.face;
    }
}
exports.FaceClass = FaceClass;
