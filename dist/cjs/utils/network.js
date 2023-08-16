"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertChainIdToName = void 0;
const face_sdk_1 = require("@haechi-labs/face-sdk");
const convertChainIdToName = (chainId) => {
    switch (chainId) {
        case 1:
            return face_sdk_1.Network.ETHEREUM;
        case 5:
            return face_sdk_1.Network.GOERLI;
        case 56:
            return face_sdk_1.Network.BNB_SMART_CHAIN;
        case 97:
            return face_sdk_1.Network.BNB_SMART_CHAIN_TESTNET;
        case 137:
            return face_sdk_1.Network.POLYGON;
        case 80001:
            return face_sdk_1.Network.MUMBAI;
        case 8217:
            return face_sdk_1.Network.KLAYTN;
        default:
    }
};
exports.convertChainIdToName = convertChainIdToName;
