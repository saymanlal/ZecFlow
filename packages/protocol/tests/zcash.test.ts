import { describe, expect, it } from "vitest";
import {
  buildZip321Uri,
  encodeAttributionMemo,
  formatZatoshi,
  isZcashAddress,
  isZcashShieldedAddress,
  isZcashViewingKey,
  parseZip321Uri,
  zcashAddressKind,
} from "../src/zcash";

describe("zcash primitives", () => {
  const sampleUnifiedTestnet =
    "utest1q9w7z8x5c4v3b2n1m0lkjhgfdsapoiuytrewq23456789abcdefghijklmnopqrstuvwxyz012345";
  const sampleTransparent = "tmP9jLgTNh5X2f7G8kL3mN4pQ5rS6tU7vWx";

  it("classifies Unified, Sapling, and Transparent addresses", () => {
    expect(zcashAddressKind(sampleUnifiedTestnet)).toBe("unified");
    expect(isZcashShieldedAddress(sampleUnifiedTestnet)).toBe(true);
    expect(zcashAddressKind(sampleTransparent)).toBe("transparent");
    expect(isZcashShieldedAddress(sampleTransparent)).toBe(false);
    expect(isZcashAddress("0x0000000000000000000000000000000000000001")).toBe(false);
  });

  it("validates Unified Viewing Keys", () => {
    const sampleUvk =
      "uviewtest1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
    expect(isZcashViewingKey(sampleUvk)).toBe(true);
    expect(isZcashViewingKey("invalid-key")).toBe(false);
  });

  it("builds and parses ZIP-321 payment URIs with shielded attribution memos", () => {
    const memo = encodeAttributionMemo({ campaignId: 3, nodeId: 8, orderKey: "0xabc123" });
    const uri = buildZip321Uri({
      address: sampleUnifiedTestnet,
      amountZec: "1.25",
      memo,
      label: "ZecFlow Campaign #3",
    });
    expect(uri.startsWith(`zcash:${sampleUnifiedTestnet}?amount=1.25&memo=`)).toBe(true);
    const parsed = parseZip321Uri(uri);
    expect(parsed.address).toBe(sampleUnifiedTestnet);
    expect(parsed.amountZec).toBe("1.25");
    expect(parsed.memo).toBe(memo);
    expect(parsed.label).toBe("ZecFlow Campaign #3");
  });

  it("formats zatoshi amounts cleanly", () => {
    expect(formatZatoshi(100_000_000n)).toBe("1");
    expect(formatZatoshi(12_500_000n)).toBe("0.125");
    expect(formatZatoshi(1n)).toBe("0.00000001");
  });
});
