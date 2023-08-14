import { Face } from "@haechi-labs/face-sdk";
import { convertChainIdToName } from "../utils/network";

export class FaceClass {
  static face: Face;
  private _apiKey: string;
  private _chainId: number;
  constructor({ chainId, apiKey }: { chainId: number; apiKey: string }) {
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
