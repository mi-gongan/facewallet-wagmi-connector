import { Box, Button, Center, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);
  return (
    <>
      {render && (
        <Center h="100vh">
          <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            borderColor={"gray.800"}
            overflow="hidden"
            p={24}
          >
            {!address ? (
              <Stack direction="column" spacing={4}>
                <Button
                  leftIcon={
                    <Image
                      src={"/logo/metamask_logo.svg"}
                      alt="metamask-logo"
                      width={24}
                      height={24}
                    />
                  }
                  colorScheme="orange"
                  size="lg"
                  onClick={() => {
                    connect({ connector: connectors[0] });
                  }}
                >
                  Metamask Login
                </Button>
                <Button
                  leftIcon={
                    <Image
                      src={"/logo/kakao_logo.svg"}
                      alt="kakao-logo"
                      width={24}
                      height={24}
                    />
                  }
                  colorScheme="yellow"
                  size="lg"
                  onClick={() => {
                    connect({ connector: connectors[1] });
                  }}
                >
                  Kakao Login
                </Button>
                <Button
                  leftIcon={
                    <Image
                      src={"/logo/google_logo.svg"}
                      alt="google-logo"
                      width={24}
                      height={24}
                    />
                  }
                  colorScheme="blue"
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    connect({ connector: connectors[2] });
                  }}
                >
                  Google Login
                </Button>
              </Stack>
            ) : (
              <Stack spacing={12}>
                <Text>Address: {address}</Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Logout
                </Button>
              </Stack>
            )}
          </Box>
        </Center>
      )}
    </>
  );
}
