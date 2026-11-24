export const privacyCopy = {
  title: "Public profile",
  body: "Choose which details and settled performance ZecFlow publishes. Your saved choices are shown in the visibility dialog.",
  change: "Change visibility and fields",
  preview: "Preview public profile",
  chainTitle: "Public on the chain anyway",
  chain:
    "Your addresses, the links they create, purchases, sales and claims are recorded on Zcash Testnet (TAZ). Anyone can read them with an explorer, whatever you choose here. ZecFlow never publishes buyers' personal details.",
  dataTitle: "Your data",
  export: "Export your data",
  exportBody:
    "A JSON file with your profile, settings, linked addresses, passkey labels, devices, notifications and indexed onchain references. ZecFlow never has your keys or recovery phrase, so they're not included.",
  delete: "Delete your account",
  deleteBody: "Removes your ZecFlow profile and settings. It can't remove anything from the chain.",
  exportTitle: "Export your data",
  deleteTitle: "Delete your ZecFlow account",
  prepare: "Prepare export",
  confirm: "Type delete my account to confirm",
  cancel: "Cancel",
  caution:
    "It can't remove anything onchain. Your links, sales, rewards and claims stay on Zcash Testnet (TAZ) and on the public explorer.",
  passkey:
    "Your original passkey stays in your password manager. Deleting this profile doesn't delete your address or its funds. Added passkeys stop working.",
  active:
    "End your active campaigns before deleting this account. Buyers and distributors rely on their pages.",
  demoDelete: "Demo accounts can't be deleted. Use Reset demo to start over.",
  reset: "Reset demo",
  download: "Download export",
  queued: "Your export is being prepared.",
  deleted: "Your ZecFlow account was deleted.",
  ready: "Export ready",
  sample: "SAMPLE DATA · demo mode",
  failure: "We couldn't complete this request. Nothing was removed.",
} as const;
