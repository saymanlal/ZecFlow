import { addressString, isSupportedChainId } from "@zecflow/protocol";
import { getAddress } from "viem";
import { z } from "zod";

const optionalAddress = z
  .union([addressString, z.literal("")])
  .optional()
  .transform((value) => (value ? getAddress(value) : null));

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CHAIN_ID: z.coerce
    .number()
    .int()
    .default(888001)
    .refine(isSupportedChainId, "NEXT_PUBLIC_CHAIN_ID must be 888001 or 31337"),
  NEXT_PUBLIC_API_URL: z.url().default("http://127.0.0.1:8740"),
  NEXT_PUBLIC_PROTOCOL_ADDRESS: optionalAddress,
  NEXT_PUBLIC_DEMO_TOKEN_ADDRESS: optionalAddress,
  NEXT_PUBLIC_REOWN_PROJECT_ID: z
    .union([z.string().regex(/^[a-fA-F0-9]{32}$/), z.literal("")])
    .optional()
    .transform((value) => value || undefined),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

const TESTNET_DEPLOYMENTS = {
  protocol: "0x1Fa5e94e44DB2101664C0a24dBf1e52912af3eca",
  token: "0xb6279237003eD710bB4ccE6fbd126e07eD4D8E23",
} as const;

export const parsePublicEnv = (source: Record<string, string | undefined>): PublicEnv => {
  const chainId = publicEnvSchema.shape.NEXT_PUBLIC_CHAIN_ID.parse(
    source.NEXT_PUBLIC_CHAIN_ID || undefined,
  );
  const protocolDefault = chainId === 888001 ? TESTNET_DEPLOYMENTS.protocol : undefined;
  const tokenDefault = chainId === 888001 ? TESTNET_DEPLOYMENTS.token : undefined;
  return publicEnvSchema.parse({
    ...source,
    NEXT_PUBLIC_CHAIN_ID: chainId,
    NEXT_PUBLIC_API_URL: source.NEXT_PUBLIC_API_URL || undefined,
    NEXT_PUBLIC_PROTOCOL_ADDRESS:
      source.NEXT_PUBLIC_PROTOCOL_ADDRESS === undefined
        ? protocolDefault
        : source.NEXT_PUBLIC_PROTOCOL_ADDRESS,
    NEXT_PUBLIC_DEMO_TOKEN_ADDRESS:
      source.NEXT_PUBLIC_DEMO_TOKEN_ADDRESS === undefined
        ? tokenDefault
        : source.NEXT_PUBLIC_DEMO_TOKEN_ADDRESS,
  });
};
