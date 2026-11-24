import type { ErrorCopy } from "./api";

const passkeyCancelledBody =
  "The passkey prompt was closed, timed out or blocked by the browser. Nothing was created or signed.";

export const passkeyErrors = {
  PRF_UNAVAILABLE: {
    title: "This passkey can’t hold a ZecFlow account",
    body: "Your passkey provider doesn’t support a feature ZecFlow needs. On desktop Chrome, save the passkey to Google Password Manager instead of this browser profile. Or use your phone, or a wallet.",
    recovery: ["Try again", "Use a wallet"],
    retryable: "afterFix",
  },
  PASSKEY_CANCELLED: {
    title: "Passkey request closed",
    body: passkeyCancelledBody,
    recovery: ["Try again", "Recover an account"],
    retryable: "yes",
    variants: {
      signIn: {
        body: `${passkeyCancelledBody} No ZecFlow passkey on this device? Create an account or recover one.`,
      },
    },
  },
  PASSKEY_NOT_ALLOWED: {
    title: "Passkeys aren’t allowed here",
    body: "This page can’t use a passkey for zecflowlive.vercel.app. Open https://zecflowlive.vercel.app directly, not inside another app’s browser, and try again.",
    recovery: ["Copy link", "Use a wallet"],
    retryable: "afterFix",
    variants: {
      localhost: {
        body: "Development accounts work only on localhost and are separate from zecflowlive.vercel.app accounts.",
      },
    },
  },
  PASSKEY_EXISTS: {
    title: "You already have a ZecFlow passkey here",
    body: "This device already holds a passkey for ZecFlow. Sign in with it instead.",
    recovery: ["Sign in with passkey"],
    retryable: "no",
  },
  PASSKEY_UNSUPPORTED: {
    title: "This browser can’t use passkeys",
    body: "Passkeys need a current browser on a device with a screen lock. You can sign in with a wallet instead.",
    recovery: ["Use a wallet"],
    retryable: "no",
  },
  CRYPTO_UNAVAILABLE: {
    title: "Secure connection required",
    body: "Passkeys work only over HTTPS. Open https://zecflowlive.vercel.app and try again.",
    recovery: ["Open ZecFlow securely"],
    retryable: "afterFix",
  },
  SESSION_ENDED: {
    title: "Quick actions ended",
    body: "Confirm with your passkey to continue. That one prompt turns quick actions back on for this session.",
    recovery: ["Continue with passkey"],
    retryable: "yes",
    variants: { askEveryTime: { body: "Confirm with your passkey to continue." } },
  },
  PASSKEY_FAILED: {
    title: "Your passkey didn’t respond",
    body: "Try again. If it keeps failing, recover your account with your recovery phrase or use a wallet.",
    recovery: ["Try again", "Recover an account"],
    retryable: "yes",
  },
} as const satisfies Record<string, ErrorCopy>;

export type PasskeyErrorCode = keyof typeof passkeyErrors;
