import { z } from "zod";

export type ZcashAddressKind = "unified" | "sapling" | "transparent";

const UNIFIED_RE = /^(u1|utest1)[0-9a-z]{50,260}$/;
const SAPLING_RE = /^(zs1|ztestsapling1)[0-9a-z]{60,120}$/;
const TRANSPARENT_RE = /^(t1|t3|tm|t2)[1-9A-HJ-NP-Za-km-z]{30,40}$/;
const VIEWING_KEY_RE = /^(uview1|uviewtest1|zxviews1|zxviewtestsapling1)[0-9a-z]{60,400}$/;

export const zcashAddressKind = (value: string): ZcashAddressKind | null => {
  const trimmed = value.trim();
  if (UNIFIED_RE.test(trimmed)) return "unified";
  if (SAPLING_RE.test(trimmed)) return "sapling";
  if (TRANSPARENT_RE.test(trimmed)) return "transparent";
  return null;
};

export const isZcashAddress = (value: string): boolean => zcashAddressKind(value) !== null;

export const isZcashShieldedAddress = (value: string): boolean => {
  const kind = zcashAddressKind(value);
  return kind === "unified" || kind === "sapling";
};

export const isZcashViewingKey = (value: string): boolean => VIEWING_KEY_RE.test(value.trim());

export const zcashAddressSchema = z
  .string()
  .trim()
  .refine(
    isZcashAddress,
    "Enter a valid Zcash Unified (u1/utest1), Sapling (zs1), or Transparent (t1/tm) address.",
  );

export const zcashViewingKeySchema = z
  .string()
  .trim()
  .refine(isZcashViewingKey, "Enter a valid Zcash Unified or Sapling Viewing Key.");

export const encodeBase64Url = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const decodeBase64Url = (encoded: string): string => {
  const padded =
    encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export interface Zip321PaymentParams {
  address: string;
  amountZec?: string | undefined;
  memo?: string | undefined;
  label?: string | undefined;
  message?: string | undefined;
}

/**
 * Builds a ZIP-321 compliant Zcash Payment URI (e.g. for Zashi, Ywallet, Zingo!).
 * Shielded memos are base64url-encoded per ZIP-321 specification.
 */
export const buildZip321Uri = ({
  address,
  amountZec,
  memo,
  label,
  message,
}: Zip321PaymentParams): string => {
  const trimmed = address.trim();
  if (!isZcashAddress(trimmed)) {
    throw new RangeError("Invalid Zcash recipient address for ZIP-321 URI");
  }
  const params: string[] = [];
  if (amountZec !== undefined && amountZec !== "") {
    if (!/^\d+(\.\d{1,8})?$/.test(amountZec) || Number(amountZec) <= 0) {
      throw new RangeError("Amount must be a positive ZEC value with at most 8 decimals");
    }
    params.push(`amount=${amountZec}`);
  }
  if (memo) {
    params.push(`memo=${encodeBase64Url(memo)}`);
  }
  if (label) {
    params.push(`label=${encodeURIComponent(label)}`);
  }
  if (message) {
    params.push(`message=${encodeURIComponent(message)}`);
  }
  return params.length > 0 ? `zcash:${trimmed}?${params.join("&")}` : `zcash:${trimmed}`;
};

export const parseZip321Uri = (uri: string): Zip321PaymentParams => {
  const trimmed = uri.trim();
  if (!trimmed.toLowerCase().startsWith("zcash:")) {
    throw new RangeError("URI must start with zcash:");
  }
  const rest = trimmed.slice(6);
  const qIndex = rest.indexOf("?");
  const address = qIndex === -1 ? rest : rest.slice(0, qIndex);
  if (!isZcashAddress(address)) {
    throw new RangeError("Invalid Zcash address in ZIP-321 URI");
  }
  const result: Zip321PaymentParams = { address };
  if (qIndex !== -1) {
    const query = new URLSearchParams(rest.slice(qIndex + 1));
    const amount = query.get("amount");
    const memo = query.get("memo");
    const label = query.get("label");
    const message = query.get("message");
    if (amount) result.amountZec = amount;
    if (memo) result.memo = decodeBase64Url(memo);
    if (label) result.label = label;
    if (message) result.message = message;
  }
  return result;
};

/**
 * Encodes a compact ZecFlow shielded attribution memo for Zcash Orchard/Sapling notes (<= 512 bytes).
 */
export const encodeAttributionMemo = ({
  campaignId,
  nodeId,
  orderKey,
}: {
  campaignId: string | number;
  nodeId: string | number;
  orderKey: string;
}): string =>
  JSON.stringify({
    p: "zecflow-v1",
    c: String(campaignId),
    n: String(nodeId),
    o: orderKey,
  });

export const formatZatoshi = (zatoshi: bigint): string => {
  const whole = zatoshi / 100_000_000n;
  const frac = (zatoshi % 100_000_000n).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${String(whole)}.${frac}` : String(whole);
};
