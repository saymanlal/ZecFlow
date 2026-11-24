"use client";

import { useMemo, useState } from "react";
import {
  buildZip321Uri,
  encodeAttributionMemo,
  isZcashAddress,
  zcashAddressKind,
} from "@zecflow/protocol";
import { CopyField } from "@/components/ui/copy-field";
import { Qr } from "@/components/ui/qr";

const DEFAULT_TESTNET_UA =
  "utest1q9w7z8x5c4v3b2n1m0lkjhgfdsapoiuytrewq23456789abcdefghijklmnopqrstuvwxyz012345";

export function ZcashWalletPanel() {
  const [address, setAddress] = useState(DEFAULT_TESTNET_UA);
  const [amountZec, setAmountZec] = useState("0.5");
  const [campaignId, setCampaignId] = useState("3");
  const [nodeId, setNodeId] = useState("8");

  const kind = useMemo(() => zcashAddressKind(address), [address]);
  const validAddress = isZcashAddress(address);

  const zip321Result = useMemo(() => {
    if (!validAddress) {
      return { uri: null, error: "Enter a valid Zcash Unified (utest1/u1), Sapling, or Transparent address." };
    }
    try {
      const memo = encodeAttributionMemo({
        campaignId: campaignId || "1",
        nodeId: nodeId || "0",
        orderKey: "0xzecflow-shielded-order",
      });
      const uri = buildZip321Uri({
        address,
        amountZec: amountZec || undefined,
        memo,
        label: `ZecFlow Campaign #${campaignId || "1"}`,
      });
      return { uri, error: null };
    } catch (err) {
      return {
        uri: null,
        error: err instanceof Error ? err.message : "Could not encode ZIP-321 payment URI.",
      };
    }
  }, [address, amountZec, campaignId, nodeId, validAddress]);

  return (
    <section className="bg-surface border-line rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="bg-lime-soft text-lime inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <span className="bg-lime size-1.5 rounded-full" />
            Zcash Shielded Settlement (ZIP-321)
          </span>
          <h2 className="font-display text-ink mt-2 text-xl font-semibold">
            Shielded Payout Address &amp; Payment URI
          </h2>
          <p className="text-body mt-1 text-sm">
            Generate a ZIP-321 Zcash payment request with an encrypted Orchard attribution memo for Zashi, Ywallet, or Zingo!.
          </p>
        </div>
        {kind ? (
          <span className="border-pill-edge bg-pill text-ink rounded-full border px-3 py-1 text-xs font-medium capitalize">
            {kind} address
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block">
            <span className="text-body text-xs font-medium">Zcash Recipient Address</span>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              placeholder="utest1... or u1..."
              className="border-line bg-soft text-ink focus:border-lime mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs outline-none"
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="text-body text-xs font-medium">Amount (ZEC/TAZ)</span>
              <input
                type="text"
                value={amountZec}
                onChange={(e) => {
                  setAmountZec(e.target.value);
                }}
                className="border-line bg-soft text-ink focus:border-lime mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs outline-none"
              />
            </label>
            <label className="block">
              <span className="text-body text-xs font-medium">Campaign ID</span>
              <input
                type="text"
                value={campaignId}
                onChange={(e) => {
                  setCampaignId(e.target.value);
                }}
                className="border-line bg-soft text-ink focus:border-lime mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs outline-none"
              />
            </label>
            <label className="block">
              <span className="text-body text-xs font-medium">Node ID</span>
              <input
                type="text"
                value={nodeId}
                onChange={(e) => {
                  setNodeId(e.target.value);
                }}
                className="border-line bg-soft text-ink focus:border-lime mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs outline-none"
              />
            </label>
          </div>
          {zip321Result.error ? (
            <p className="text-pink text-xs font-medium">{zip321Result.error}</p>
          ) : zip321Result.uri ? (
            <CopyField value={zip321Result.uri} label="Copy ZIP-321 URI" copiedMessage="ZIP-321 URI copied" />
          ) : null}
        </div>

        <div className="bg-soft border-line flex flex-col items-center justify-center rounded-xl border p-4">
          {zip321Result.uri ? (
            <>
              <div className="rounded-xl bg-surface p-2">
                <Qr value={zip321Result.uri} label="ZIP-321 Zcash payment QR code" size={144} />
              </div>
              <p className="text-muted mt-2 text-center text-xs">
                Scan with any ZIP-321 compatible Zcash wallet
              </p>
            </>
          ) : (
            <p className="text-muted text-center text-xs">Enter a valid Zcash address to render QR</p>
          )}
        </div>
      </div>
    </section>
  );
}
