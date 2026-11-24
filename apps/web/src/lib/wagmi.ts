import { chainById, localChain, zcashTestnet } from "@zecflow/protocol";
import { cookieStorage, createConfig, createStorage, http, injected } from "wagmi";
import { publicEnv } from "./public-env";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

export const activeChain = chainById(publicEnv.NEXT_PUBLIC_CHAIN_ID);

const config = {
  chains: [zcashTestnet, localChain],
  connectors: [injected()],
  transports: {
    [zcashTestnet.id]: http(),
    [localChain.id]: http(),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
} satisfies Parameters<typeof createConfig>[0];

export const reownAdapter = publicEnv.NEXT_PUBLIC_REOWN_PROJECT_ID
  ? new WagmiAdapter({
      ...config,
      projectId: publicEnv.NEXT_PUBLIC_REOWN_PROJECT_ID,
      networks: [zcashTestnet, localChain],
    })
  : null;

export const wagmiConfig = reownAdapter?.wagmiConfig ?? createConfig(config);

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
