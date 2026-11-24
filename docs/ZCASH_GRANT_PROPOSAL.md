# Zcash Community Grants (ZCG) Proposal — ZecFlow

## Project Summary

**Project Name:** ZecFlow  
**Category:** Interoperability, Payments & Privacy-Preserving Commerce (Zapps)  
**Repository:** [https://github.com/saymanlal/ZecFlow](https://github.com/saymanlal/ZecFlow)  
**License:** MIT (Open Source)

ZecFlow is an open-source, privacy-preserving product distribution and affiliate settlement protocol built for the **Zcash ecosystem**. It enables merchants to launch verifiable referral campaigns while allowing buyers and distributors to interact using **Zcash Unified Addresses (`u1` / `utest1`)**, **ZIP-321 payment URIs**, and **Orchard shielded memos**, backed by deterministic escrow accounting.

---

## Why Zcash (and Not Generic EVM Testnets)?

Generic EVM testnets (such as Ethereum Sepolia) expose every buyer address, purchase graph, and payout trail publicly. For real-world commerce and community distribution:

1. **Buyer Privacy:** Customers should be able to purchase through a referral link without exposing their entire financial history on a public ledger.
2. **ZIP-321 Native UX:** Zcash wallets (Zashi, Ywallet, Zingo!) already support `zcash:` payment URIs with base64url-encoded encrypted memos.
3. **Selective Auditability:** Merchants and auditors can verify order commitments using **Unified Viewing Keys (`uview1` / `uviewtest1`)** without making sensitive customer relationships public.
4. **ZSA Readiness:** ZecFlow's token and ledger abstractions are designed to align with **Zcash Shielded Assets (ZSAs / ZIP-226 & ZIP-227)** as they roll out on mainnet.

---

## Technical Architecture Implemented Today

- **`@zecflow/protocol/zcash`:**
  - Unified (`u1` / `utest1`), Sapling (`zs1` / `ztestsapling1`), and Transparent (`t1` / `tm`) address classification and Zod validation.
  - Viewing Key (`uview1` / `uviewtest1` / `zxviews1`) validation.
  - Compliant **ZIP-321 Payment URI** encoder/decoder with base64url shielded memo support.
  - Compact `zecflow-v1` shielded attribution memo formatter (`campaignId`, `nodeId`, `orderKey`) within the 512-byte Zcash memo limit.
- **`@zecflow/contracts`:**
  - `ZecFlowProtocol.sol` & `ZecFlowToken.sol` (`ZFT`): immutable escrow separating merchant proceeds from distributor reward budgets, 1–5 level referral path resolution, refund window enforcement, and Foundry invariant testing (32/32 tests passing).
- **`@zecflow/web`:**
  - Dark-gold Zcash-themed Next.js 16 interface with an interactive **Zcash Shielded Settlement & ZIP-321 QR Generator** (`/wallet`), passkey-encrypted private campaign notebooks (WebAuthn PRF + AES-256-GCM), and hardened Web3/wallet error handling.

---

## Proposed ZCG Grant Milestones

| Milestone | Deliverable | Verification |
| --- | --- | --- |
| **M1: Core Protocol & ZIP-321 SDK** | `ZecFlowProtocol`, `@zecflow/protocol` ZIP-321/UA primitives, `@zecflow/sdk`, and full test suite | All Foundry invariants & Vitest unit suites passing (Completed) |
| **M2: `lightwalletd` & Viewing Key Verifier** | Rust/WASM or gRPC `lightwalletd` backend worker verifying Orchard memo commitments via merchant Unified Viewing Keys | Automated integration tests against Zcash Testnet (`TAZ`) |
| **M3: Zashi / Ywallet Checkout Flow** | End-to-end merchant checkout accepting native shielded ZEC/TAZ via ZIP-321 QR + automatic escrow release | Live Zcash Testnet demonstration & security review |
| **M4: ZSA Bridge & Mainnet Readiness** | Zcash Shielded Asset (ZSA) issuance/settlement adapter and public documentation | Open-source audit report & mainnet deployment guide |
