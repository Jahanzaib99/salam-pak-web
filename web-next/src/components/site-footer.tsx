import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Headset, MapPinned } from "lucide-react";
import {
  footerCities,
  footerProvincialDepts,
  footerNav,
} from "@/lib/nav";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ptdc.pk",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/PTDC_official",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z",
  },
  {
    label: "X",
    href: "https://x.com/PTDCOfficial",
    path: "M18.9 2H22l-7.5 8.57L23 22h-6.9l-5.4-7.06L4.5 22H1.4l8.02-9.17L1 2h7.07l4.88 6.45L18.9 2zm-2.42 18h1.9L7.6 3.9H5.56L16.48 20z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@PTDC_Official",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z",
  },
];

const primaryCols = footerNav.filter(
  (c) =>
    c.title !== "Provincial/Regional Tourism Departments" &&
    c.title !== "About"
);
const aboutCol = footerNav.find((c) => c.title === "About");

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(165deg,#04101f_0%,#06132a_42%,#0a1f2e_100%)] text-white/65">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-leaf/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* Brand strip */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/brand/salam-pakistan-logo-light.png"
                alt="Salam Pakistan"
                width={160}
                height={54}
                unoptimized
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-[14px] leading-relaxed text-white/55">
              The official tourism portal of Pakistan Tourism Development
              Corporation (PTDC).
            </p>
            <div className="mt-5 flex items-center gap-5">
              <Image
                src="/brand/pakistan_gov_logo.png"
                alt="Government of Pakistan"
                width={40}
                height={44}
                className="h-11 w-auto object-contain brightness-0 invert opacity-90"
              />
              <Image
                src="/brand/ptdc.png"
                alt="PTDC"
                width={40}
                height={44}
                className="h-10 w-auto object-contain opacity-95"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="tel:1422"
              className="inline-flex items-center gap-2.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(15,122,107,0.8)] transition hover:bg-brand-dark"
            >
              <Headset className="h-4 w-4" />
              Helpline 1422
            </a>
            <Link
              href="/map/earth-3d"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-brand/40 hover:bg-white/10 hover:text-white"
            >
              <MapPinned className="h-4 w-4 text-brand" />
              Earth map
            </Link>
          </div>
        </div>

        {/* Primary link columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
          {primaryCols.map((col) => (
            <FooterColumn key={col.title} title={col.title} links={col.links} />
          ))}
          {aboutCol && (
            <FooterColumn title={aboutCol.title} links={aboutCol.links} />
          )}
        </div>

        {/* Provincial / regional band */}
        <div className="border-t border-white/10 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <h4 className="shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
              Provincial &amp; regional tourism
            </h4>
            <p className="text-[12.5px] text-white/40 sm:text-right">
              Official tourism departments across Pakistan
            </p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {footerProvincialDepts.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] text-white/70 transition hover:border-brand/35 hover:bg-brand/10 hover:text-white"
                >
                  {l.label}
                  <ExternalLink className="h-3 w-3 opacity-40 transition group-hover:opacity-80" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-6 text-[12.5px] text-white/45 md:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Pakistan Tourism Development
            Corporation. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {footerCities.slice(0, 3).map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="hidden text-white/40 transition hover:text-brand sm:inline"
              >
                {c.label}
              </Link>
            ))}
            <span className="mx-1 hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-brand/40 hover:bg-brand/15 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
        {title}
      </h4>
      <div className="mt-3 h-0.5 w-8 rounded-full bg-brand/70" aria-hidden />
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] text-white/60 transition-colors hover:text-brand"
              >
                {l.label}
              </a>
            ) : (
              <Link
                href={l.href}
                className="text-[13.5px] text-white/60 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
