# facewallet-wagmi-connector

기존에 wagmi를 사용하여 지갑연동 기능을 만들고 wagmi의 훅을 사용하던 서비스에서 페이스월렛의 소셜 로그인 기능(구글, 카카오)를 사용하고 싶은 유저를 위해서 만들어짐

## 구현

전역에 face 객체는 하나만 존재해야 하므로 이는 싱글톤으로 구현되고 이것을 각 connector에서 불러와서 wagmi의 connector에 필요한 인터페이스를 구현하여 와그미와 연동되도록 만듦

## Quick Start

### Installation

```
npm install viem wagmi @wagmi/core facewallet-wagmi-connector
```

### Wagmi 연결

.env에 NEXT_PUBLIC_FACE_API_KEY 입력
(https://dashboard.facewallet.xyz 에서 발급)

### .env

```
NEXT_PUBLIC_FACE_API_KEY=""
```

### pages/\_app.tsx

```
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

```

## demo url

https://face-wagmi-connector.vercel.app/

## face wallet document

https://docs.facewallet.xyz/docs
