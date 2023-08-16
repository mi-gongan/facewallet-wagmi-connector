import { Face } from "@haechi-labs/face-sdk";
export declare class FaceClass {
    static face: Face;
    private _apiKey;
    private _chainId;
    constructor({ chainId, apiKey }: {
        chainId: number;
        apiKey: string;
    });
    getFace(): Face;
}
//# sourceMappingURL=faceClass.d.ts.map