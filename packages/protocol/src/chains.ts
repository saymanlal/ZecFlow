import { defineChain } from "viem";
import { foundry } from "viem/chains";

export const zcashTestnet = defineChain({
  id: 888001,
  name: "Zcash Testnet (TAZ)",
  nativeCurrency: {
    name: "Testnet ZEC",
    symbol: "TAZ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.usezecflow.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Zcash Explorer",
      url: "https://testnet.zcashblockexplorer.com",
    },
  },
  testnet: true,
});

export const localChain = foundry;

export const supportedChains = [zcashTestnet, localChain] as const;

export type SupportedChainId = (typeof supportedChains)[number]["id"];

export const isSupportedChainId = (chainId: number): chainId is SupportedChainId =>
  supportedChains.some((chain) => chain.id === chainId);

export const chainById = (chainId: SupportedChainId) => {
  const chain = supportedChains.find((candidate) => candidate.id === chainId);
  if (!chain) throw new RangeError(`Unsupported chain ${String(chainId)}`);
  return chain;
};

export const explorerTxUrl = (chainId: SupportedChainId, txHash: string): string | null => {
  const explorer = chainById(chainId).blockExplorers?.default.url;
  return explorer ? `${explorer}/tx/${txHash}` : null;
};

export const explorerAddressUrl = (chainId: SupportedChainId, address: string): string | null => {
  const explorer = chainById(chainId).blockExplorers?.default.url;
  return explorer ? `${explorer}/address/${address}` : null;
};
