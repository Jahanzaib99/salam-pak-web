import Image from "next/image";
import Link from "next/link";
import { Headset } from "lucide-react";
import { footerNav } from "@/lib/nav";

const socials = [
  {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z",
  },
  {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z",
  },
  {
    label: "X",
    path: "M18.9 2H22l-7.5 8.57L23 22h-6.9l-5.4-7.06L4.5 22H1.4l8.02-9.17L1 2h7.07l4.88 6.45L18.9 2zm-2.42 18h1.9L7.6 3.9H5.56L16.48 20z",
  },
  {
    label: "YouTube",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z",
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/brand/salam-pakistan-logo-light.png"
                alt="Salam Pakistan"
                width={150}
                height={50}
                unoptimized
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              The official tourism portal of Pakistan Tourism Development
              Corporation (PTDC).
            </p>
            <div className="mt-5 flex items-center gap-4">
              <Image
                src="/brand/pakistan_gov_logo.png"
                alt="Government of Pakistan"
                width={40}
                height={44}
                className="h-11 w-auto object-contain brightness-0 invert"
              />
              <Image
                src="/brand/ptdc.png"
                alt="PTDC"
                width={40}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </div>
            <a
              href="tel:1422"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white"
            >
              <Headset className="h-4 w-4 text-brand" /> Helpline: 1422
            </a>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} Pakistan Tourism Development Corporation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="hover:text-brand">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
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
