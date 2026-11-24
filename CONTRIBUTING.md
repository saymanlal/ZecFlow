# Contributing to ZecFlow

Thank you for contributing to **ZecFlow**! This project adheres to high engineering, security, and privacy standards modeled on the Zcash ecosystem and the [`librustzcash`](https://github.com/zcash/librustzcash) development and style guides.

---

## Development Principles

1. **Privacy & Security First:** Never introduce telemetry, unencrypted PII storage, or changes that weaken ZIP-321 memo validation, Unified Address (`u1` / `utest1`) parsing, Unified Viewing Key (`uview1` / `uviewtest1`) handling, or WebAuthn PRF key derivation.
2. **Deterministic Accounting:** Smart contract and protocol math changes must preserve strict separation between merchant proceeds and distributor reward budgets, with full unit, fuzz, and invariant test coverage.
3. **Minimal, Focused Pull Requests:** Keep PRs scoped to a single feature, fix, or documentation improvement. Large changes should be discussed in an issue first.

---

## Style & Code Quality

- **TypeScript / React (`apps/*`, `packages/protocol`, `packages/sdk`):**
  - Strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`).
  - Zero ESLint errors (`pnpm lint`) and Prettier formatting (`pnpm format:check`).
  - No `console.log` in production code (`no-console: error`).
- **Solidity (`packages/contracts`):**
  - Follow Foundry formatting (`forge fmt --check`).
  - Document public/external functions with NatSpec and preserve invariant coverage.
- **Rust / `librustzcash` Conventions (for Zcash verification workers & bindings):**
  - Follow `rustfmt`, `clippy` (`-D warnings`), and the [`librustzcash` style & contribution guidelines](https://github.com/zcash/librustzcash/blob/main/CONTRIBUTING.md).

---

## Local Verification Checklist

Before opening a pull request, verify all relevant checks pass:

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Typecheck all workspace packages
pnpm typecheck

# Lint & formatting
NODE_OPTIONS="--max-old-space-size=4096" pnpm lint
pnpm format:check

# Unit & integration tests
pnpm vitest run --project protocol --project sdk --project web

# Smart contract tests & formatting (requires Foundry)
pnpm contracts:test
(cd packages/contracts && forge fmt --check)

# Production web build
pnpm --filter @zecflow/web build
```

---

## Branch, Commit & PR Guidelines

- **Branching:** Branch from `main` using descriptive names such as `feat/zip321-memo-verifier`, `fix/wallet-chain-switch`, or `docs/zcash-integration`.
- **Commit Messages:** Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat(protocol): ...`, `fix(web): ...`, `docs: ...`, `test(contracts): ...`).
- **Pull Requests:**
  - Describe *what* changed and *why*.
  - Link any related GitHub issue.
  - Include test results or screenshots for UI changes.

---

## Security Disclosures

If you discover a vulnerability in ZecFlow's smart contracts, ZIP-321/viewing-key handling, or passkey encryption, **do not open a public issue**. Report it privately to the maintainers via GitHub Security Advisories on `saymanlal/ZecFlow`.

---

## License

By contributing to ZecFlow, you agree that your contributions will be licensed under the [MIT License](LICENSE).
