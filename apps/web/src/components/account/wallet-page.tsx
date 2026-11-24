"use client";

import { FundsPanel } from "@/components/buy/funds-panel";
import { ProductPage, PageLink } from "@/components/product/page";
import { CopyField } from "@/components/ui/copy-field";
import { useSessionStore } from "@/lib/stores/session";
import { ZcashWalletPanel } from "./zcash-wallet-panel";

export function WalletPage() {
  const address = useSessionStore((state) => state.address);
  return (
    <ProductPage
      title="Your Zcash &amp; settlement wallet"
      description="TAZ pays settlement network fees. ZFT is a Zcash-pegged testnet settlement token with ZIP-321 shielded URI support."
      actions={
        <>
          <PageLink href="/wallet/fund">Mainnet funding</PageLink>
          <PageLink href="/settings/wallets">Linked addresses</PageLink>
        </>
      }
    >
      {address ? (
        <CopyField value={address} label="Copy your address" copiedMessage="Address copied" />
      ) : null}
      <ZcashWalletPanel />
      <FundsPanel />
    </ProductPage>
  );
}
