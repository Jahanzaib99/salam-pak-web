"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Headset,
  User,
} from "lucide-react";
import { mainNav } from "@/lib/nav";

/** Primary links in the bar — E-Visa sits as its own action to reduce clutter. */
const navLinks = mainNav.filter((item) => item.label !== "Apply E-Visa");

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  const lightTopPage = pathname.startsWith("/user");
  const solid = scrolled || mobileOpen || lightTopPage;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Slim utility bar */}
      <div
        className={[
          "hidden border-b transition-colors lg:block",
          solid
            ? "border-white/10 bg-ink text-white/75"
            : "border-white/10 bg-black/25 text-white/85 backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5 text-[12px] xl:px-6">
          <div className="flex items-center gap-3">
            <a
              href="tel:1422"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <Headset className="h-3.5 w-3.5 shrink-0" />
              Helpline <b className="font-semibold text-white">1422</b>
            </a>
            <span className="hidden text-white/30 sm:inline">|</span>
            <span className="hidden sm:inline">
              Islamabad <b className="font-semibold text-white">24°C</b>
            </span>
            <span className="hidden text-white/30 md:inline">|</span>
            <span className="hidden md:inline">
              1 USD = <b className="font-semibold text-white">278 PKR</b>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("rehbar:open"))
              }
              className="hover:text-white"
            >
              Ask Rehbar
            </button>
            <Link href="/about" className="hover:text-white">
              Traveller support
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <User className="h-3.5 w-3.5" /> Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={[
          "transition-colors duration-300",
          solid ? "border-b border-line bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-5 xl:gap-6 xl:px-6">
          {/* Brand: official Salam Pakistan mark from brand PDF */}
          <Link
            href="/"
            aria-label="Salam Pakistan home"
            className="flex shrink-0 items-center"
          >
            <Image
              src={
                solid
                  ? "/brand/salam-pakistan-logo.png"
                  : "/brand/salam-pakistan-logo-light.png"
              }
              alt="Salam Pakistan"
              width={160}
              height={54}
              priority
              unoptimized
              className="h-10 w-auto object-contain sm:h-11"
            />
          </Link>

          {/* Desktop links — centered remaining space */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={[
                        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold tracking-tight transition-colors xl:px-3 xl:text-sm",
                        solid
                          ? active
                            ? "bg-cloud text-brand"
                            : "text-ink/80 hover:bg-cloud hover:text-ink"
                          : active
                            ? "bg-white/15 text-white"
                            : "text-white/90 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown className="h-3 w-3 opacity-70" />
                      )}
                    </Link>

                    {item.children && (
                      <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <div className="rounded-2xl border border-line bg-white p-1.5 shadow-xl">
                          {item.children.map((c) =>
                            c.external ? (
                              <a
                                key={c.label}
                                href={c.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-xl px-3.5 py-2 text-sm text-ink transition-colors hover:bg-cloud hover:text-brand"
                              >
                                {c.label}
                              </a>
                            ) : (
                              <Link
                                key={c.label}
                                href={c.href}
                                className="block rounded-xl px-3.5 py-2 text-sm text-ink transition-colors hover:bg-cloud hover:text-brand"
                              >
                                {c.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="ml-auto hidden items-center gap-2 lg:flex xl:gap-3">
            <Link
              href="/planning/visa"
              className={[
                "inline-flex items-center rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors xl:text-sm",
                solid
                  ? "border border-line text-ink hover:border-brand hover:text-brand"
                  : "border border-white/40 text-white hover:bg-white/10",
              ].join(" ")}
            >
              E-Visa
            </Link>
            <Link
              href="/where-to-go"
              className="group inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark xl:px-5 xl:text-sm"
            >
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={[
              "ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              solid ? "text-ink" : "text-white",
            ].join(" ")}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden">
          <div className="mb-4 border-b border-line pb-4">
            <Image
              src="/brand/salam-pakistan-logo.png"
              alt="Salam Pakistan"
              width={140}
              height={48}
              unoptimized
              className="h-10 w-auto object-contain"
            />
          </div>
          <nav className="flex flex-col">
            {mainNav.map((item) => (
              <div key={item.label} className="border-b border-line/70 py-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="flex-1 py-2.5 text-[15px] font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label="Toggle submenu"
                      onClick={() =>
                        setOpenGroup((g) =>
                          g === item.label ? null : item.label
                        )
                      }
                      className="p-2 text-ink-soft"
                    >
                      <ChevronDown
                        className={[
                          "h-4 w-4 transition-transform",
                          openGroup === item.label ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>
                  )}
                </div>
                {item.children && openGroup === item.label && (
                  <div className="flex flex-col pb-2 pl-3">
                    {item.children.map((c) =>
                      c.external ? (
                        <a
                          key={c.label}
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 text-sm text-ink-soft"
                        >
                          {c.label}
                        </a>
                      ) : (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="py-2 text-sm text-ink-soft"
                        >
                          {c.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/where-to-go"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Explore destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
