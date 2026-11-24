import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "../src/lib/env";

describe("parsePublicEnv", () => {
  it("treats unset contract addresses as not deployed", () => {
    const env = parsePublicEnv({
      NEXT_PUBLIC_CHAIN_ID: "31337",
      NEXT_PUBLIC_API_URL: "http://localhost:8740",
      NEXT_PUBLIC_PROTOCOL_ADDRESS: "",
    });
    expect(env.NEXT_PUBLIC_PROTOCOL_ADDRESS).toBeNull();
    expect(env.NEXT_PUBLIC_DEMO_TOKEN_ADDRESS).toBeNull();
  });

  it("defaults to deployed Zcash Testnet contracts when unset on chain 888001", () => {
    const env = parsePublicEnv({});
    expect(env.NEXT_PUBLIC_CHAIN_ID).toBe(888001);
    expect(env.NEXT_PUBLIC_PROTOCOL_ADDRESS).toBe("0x1Fa5e94e44DB2101664C0a24dBf1e52912af3eca");
    expect(env.NEXT_PUBLIC_DEMO_TOKEN_ADDRESS).toBe("0xb6279237003eD710bB4ccE6fbd126e07eD4D8E23");
  });

  it("refuses a chain ZecFlow does not support", () => {
    expect(() =>
      parsePublicEnv({ NEXT_PUBLIC_CHAIN_ID: "1", NEXT_PUBLIC_API_URL: "http://localhost:8740" }),
    ).toThrow();
  });
});
