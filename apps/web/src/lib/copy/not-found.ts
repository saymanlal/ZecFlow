import type { MessageWithActions } from "./types";

export const notFoundCopy = {
  route: {
    title: "Page not found",
    body: "The link may be mistyped, or the page may have moved.",
    actions: ["Explore campaigns", "Go home"],
  },
  campaign: {
    title: "This campaign doesn’t exist",
    body: "There’s no campaign #{id} on Zcash Testnet (TAZ). Check the link, or ask whoever shared it for a new one.",
    actions: ["Explore campaigns"],
  },
  referralCode: {
    title: "This link isn’t recognised",
    body: "The code “{code}” doesn’t match any ZecFlow link. Ask whoever shared it to copy it again.",
    actions: ["Explore campaigns"],
  },
  sale: {
    title: "We can’t find this sale",
    body: "There’s no sale #{id} on Zcash Testnet (TAZ). If you just bought it, it may still be syncing.",
    actions: ["Try again", "Explore campaigns"],
  },
  distributorMissing: {
    title: "No profile for {handle}",
    body: "There’s no ZecFlow profile with this handle. Check the spelling.",
    actions: ["Browse distributors"],
  },
  distributorPrivate: {
    title: "This profile is private",
    body: "Only its owner can see this record.",
    actions: ["Browse distributors"],
  },
  merchant: {
    title: "This merchant isn’t on ZecFlow",
    body: "Check the link, or browse live campaigns.",
    actions: ["Explore campaigns"],
  },
  product: {
    title: "This product doesn’t exist",
    body: "It may have been deleted while it was a draft.",
    actions: ["Back to products"],
  },
  link: {
    title: "This link doesn’t exist",
    body: "There’s no link #{id} on Zcash Testnet (TAZ).",
    actions: ["My links"],
  },
  opsCase: {
    title: "Case not found",
    body: "It may have been merged or closed.",
    actions: ["Back to queue"],
  },
} as const satisfies Record<string, MessageWithActions>;
