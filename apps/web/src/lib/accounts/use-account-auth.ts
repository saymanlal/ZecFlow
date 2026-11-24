"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useConfig, useConnection, useConnectors } from "wagmi";
import { connect, getConnection, signMessage, switchChain } from "wagmi/actions";
import { useZecFlowClient } from "@/lib/client/provider";
import { useSessionStore } from "@/lib/stores/session";
import { activeChain } from "@/lib/wagmi";
import { endPasskeySession, unlockPasskey } from "./passkey";
import { emailLoginAvailable, openEmailConnection, openWalletConnection } from "./reown";
import { passkeyAvailability, passkeyFailure } from "./passkey-guidance";
import { signInAccount } from "./sign-in";

export type AuthOutcome = { isNewAccount: boolean };

type Connector = ReturnType<typeof useConnectors>[number];

export const normalizeWeb3Error = (failure: unknown, fallback: string): string => {
  if (!(failure instanceof Error)) return fallback;
  const msg = failure.message || "";
  const lower = msg.toLowerCase();
  if (
    lower.includes("user rejected") ||
    lower.includes("user denied") ||
    lower.includes("rejected the request") ||
    lower.includes("4001")
  ) {
    return "Request cancelled in your wallet. Approve the prompt to continue.";
  }
  if (lower.includes("provider not found") || lower.includes("no injected provider")) {
    return "No browser wallet detected. Install a Web3 wallet or sign in with a passkey.";
  }
  if (lower.includes("already pending") || lower.includes("-32002")) {
    return "A wallet prompt is already open. Check your wallet extension to continue.";
  }
  if (lower.includes("chain") && (lower.includes("unrecognized") || lower.includes("4902"))) {
    return `Please add or switch to ${activeChain.name} (Chain ID ${activeChain.id}) in your wallet.`;
  }
  if (lower.includes("disconnected")) {
    return "Your wallet disconnected during sign-in. Reconnect and try again.";
  }
  return msg || fallback;
};

const subscribeHydration = () => () => {};

export const useAccountAuth = ({
  expectedAddress,
  onSignedIn,
}: {
  expectedAddress?: string | undefined;
  onSignedIn: (outcome: AuthOutcome) => void;
}) => {
  const client = useZecFlowClient();
  const config = useConfig();
  const connectors = useConnectors();
  const connection = useConnection();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const passkeySupport = useSyncExternalStore(
    subscribeHydration,
    passkeyAvailability,
    () => "checking",
  );
  const [busy, setBusy] = useState<"passkey" | "create" | "wallet" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const emailAttempt = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      emailAttempt.current?.abort();
      emailAttempt.current = null;
    },
    [],
  );

  const matchesExpected = (address: string) =>
    !expectedAddress || address.toLowerCase() === expectedAddress.toLowerCase();

  const ensureActiveChain = async (chainId: number | undefined, connector?: Connector) => {
    if (chainId === activeChain.id) return;
    try {
      await switchChain(config, connector ? { chainId: activeChain.id, connector } : { chainId: activeChain.id });
    } catch (switchErr) {
      throw new Error(
        normalizeWeb3Error(
          switchErr,
          `Switch your wallet network to ${activeChain.name} (${activeChain.id}) to continue.`,
        ),
      );
    }
  };

  const passkey = async (create: boolean) => {
    if (!client || busy) return;
    if (passkeySupport !== "available") {
      setError(passkeySupport);
      return;
    }
    setBusy(create ? "create" : "passkey");
    setError(null);
    try {
      const { account, credential } = await unlockPasskey(create, client);
      if (!matchesExpected(account.address)) {
        throw new Error("Choose the passkey for your original account to continue.");
      }
      const result = await signInAccount(client, account.address, "passkey", (message) =>
        account.signMessage({ message }),
      );
      if (create) {
        await client.call("account.addPasskey", {
          ...credential,
          transports: credential.transports,
          kind: "original",
          label: "Original passkey",
        });
      }
      endPasskeySession();
      onSignedIn({ isNewAccount: result.verified.isNewAccount });
    } catch (failure) {
      endPasskeySession();
      useSessionStore.getState().setStatus("anonymous");
      setError(passkeyFailure(failure));
    } finally {
      setBusy(null);
    }
  };

  const wallet = async (connector?: Connector) => {
    if (!client || busy) return;
    setBusy("wallet");
    setError(null);
    try {
      const existing = getConnection(config);
      const connected = connector
        ? existing.status === "connected" && existing.connector?.id === connector.id
          ? existing
          : await connect(config, { connector })
        : existing;
      const address = "accounts" in connected ? connected.accounts[0] : connected.address;
      if (!address) throw new Error("Choose a wallet first.");
      if (!matchesExpected(address)) throw new Error("Connect your original account to continue.");
      await ensureActiveChain(connected.chainId);
      const result = await signInAccount(client, address, "wallet", (message) =>
        signMessage(config, { account: address, message }),
      );
      onSignedIn({ isNewAccount: result.verified.isNewAccount });
    } catch (failure) {
      useSessionStore.getState().setStatus("anonymous");
      setError(normalizeWeb3Error(failure, "Wallet sign-in didn’t finish. Try again."));
    } finally {
      setBusy(null);
    }
  };

  const email = async () => {
    if (!client || busy || emailAttempt.current) return;
    const attempt = new AbortController();
    emailAttempt.current = attempt;
    setBusy("email");
    setError(null);
    try {
      const address = await openEmailConnection(attempt.signal);
      if (!address || attempt.signal.aborted) return;
      if (!matchesExpected(address)) {
        throw new Error("Use the email, passkey or wallet for your original account to continue.");
      }
      const connected = getConnection(config);
      if (
        connected.status !== "connected" ||
        connected.address.toLowerCase() !== address.toLowerCase()
      ) {
        throw new Error("Your connected account changed. Please sign in again.");
      }
      await ensureActiveChain(connected.chainId, connected.connector);
      const result = await signInAccount(client, address, "wallet", (message) =>
        signMessage(config, { account: address, connector: connected.connector, message }),
      );
      if (emailAttempt.current === attempt) {
        onSignedIn({ isNewAccount: result.verified.isNewAccount });
      }
    } catch (failure) {
      if (!attempt.signal.aborted) {
        useSessionStore.getState().setStatus("anonymous");
        setError(normalizeWeb3Error(failure, "Email sign-in didn’t finish. Please try again."));
      }
    } finally {
      emailAttempt.current = null;
      setBusy(null);
    }
  };

  const walletConnect = () => {
    setError(null);
    openWalletConnection().catch((failure: unknown) => {
      setError(normalizeWeb3Error(failure, "WalletConnect couldn’t be opened."));
    });
  };

  return {
    busy,
    error,
    passkey,
    email,
    emailAvailable: emailLoginAvailable,
    passkeySupport,
    wallet,
    walletConnect,
    connected: hydrated && connection.status === "connected",
    browserWallets: (hydrated ? connectors : [])
      .filter((connector) => connector.type !== "walletConnect" && connector.type !== "AUTH")
      .filter(
        (connector, index, all) => all.findIndex((item) => item.id === connector.id) === index,
      )
      .map((connector) => ({
        connector,
        name: connector.id === "injected" ? "Browser wallet" : connector.name,
        icon: connector.icon,
      })),
  };
};
