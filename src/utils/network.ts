import { Network } from "@haechi-labs/face-sdk";

export const convertChainIdToName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return Network.ETHEREUM;
    case 5:
      return Network.GOERLI;
    case 56:
      return Network.BNB_SMART_CHAIN;
    case 97:
      return Network.BNB_SMART_CHAIN_TESTNET;
    case 137:
      return Network.POLYGON;
    case 80001:
      return Network.MUMBAI;
    case 8217:
      return Network.KLAYTN;
    default:
  }
};
