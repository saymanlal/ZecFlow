import { required } from "../required";

export const netFlow = {
  notDeployed: "ZecFlow isn’t deployed on Zcash Testnet (TAZ) yet",
  wrongNetwork: required.wrongNetwork,
  manualSwitch:
    "Your wallet can’t switch automatically. Open it and choose Zcash Testnet (TAZ) (chain ID 888001).",
  rpcDown: "Zcash Testnet (TAZ) isn’t responding. Nothing was sent.",
  "rpcDown.readOnly":
    "Showing the last data we loaded. Onchain actions are paused here until the connection returns. Your funds stay in the ZecFlow contract.",
  linkUnavailable: "We can’t load this link right now.",
  offline: "You’re offline. ZecFlow will reconnect when your connection is back.",
  maintenance:
    "ZecFlow is being updated until about {endTime}. Your funds stay in the ZecFlow contract on Zcash Testnet (TAZ), and nothing you’ve earned changes during maintenance.",
} as const satisfies Record<string, string>;
