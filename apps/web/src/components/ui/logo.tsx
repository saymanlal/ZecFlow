import Link from "next/link";
import { routes } from "@/lib/routes";
import { BrandMark } from "./brand-mark";

export function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <Link href={routes.home} aria-label="ZecFlow home" className="inline-flex items-center gap-2.5">
      <BrandMark height={30} priority={priority} />
      <span className="font-display text-[24px] leading-[26px] font-extrabold tracking-[-0.03em] text-ink">
        Zec<span className="text-lime">Flow</span>
      </span>
    </Link>
  );
}
