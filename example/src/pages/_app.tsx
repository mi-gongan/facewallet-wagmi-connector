import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { GoogleConnector, KakaoConnector } from "facewallet-wagmi-connector";
import { ChakraProvider } from "@chakra-ui/react";
import { polygonMumbai } from "@wagmi/core/chains";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const chainId = 80001;
const faceApiKey = process.env.NEXT_PUBLIC_FACE_API_KEY || "";

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new KakaoConnector({
      chains,
      options: { chainId },
      apiKey: faceApiKey,
    }),
    new GoogleConnector({
      chains,
      options: { chainId },
      apiKey: faceApiKey,
    }),
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
}
