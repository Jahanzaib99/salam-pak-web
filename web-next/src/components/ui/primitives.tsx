import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/reveal";
import SmartImage from "@/components/ui/smart-image";

/* ---------- Section wrapper ---------- */
export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-6 py-16 lg:py-20 ${className}`}>
      {children}
    </section>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="mb-10 max-w-2xl">
        {kicker && (
          <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
            {kicker}
          </span>
        )}
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* ---------- Pill buttons ---------- */
export function PrimaryButton({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const cls =
    "group inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark";
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </>
  );
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function OutlineButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-full border-[1.6px] border-ink px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

/* ---------- Image tile card (destination / activity) ---------- */
export function TileCard({
  title,
  subtitle,
  image,
  href,
  tall = false,
}: {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-[20px] ${
        tall ? "aspect-[3/4]" : "aspect-[4/3]"
      }`}
    >
      <SmartImage
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 90vw, 33vw"
        className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {subtitle && (
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
            {subtitle}
          </span>
        )}
        <h3 className="mt-1 font-display text-xl font-bold text-white">
          {title}
        </h3>
      </div>
      <span className="absolute right-4 top-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

/* ---------- Feature card (icon + text) ---------- */
export function FeatureCard({
  icon: Icon,
  title,
  href,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  const className =
    "rounded-2xl border border-line bg-white p-6 transition hover:border-brand/30 hover:shadow-lg";
  const body = (
    <>
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{children}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group block ${className}`}>
        {body}
        <span className="mt-4 inline-flex items-center text-[13px] font-semibold text-brand opacity-80 transition group-hover:opacity-100">
          Book now →
        </span>
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}

/* ---------- Split section: text + image ---------- */
export function SplitSection({
  kicker,
  title,
  image,
  reverse = false,
  children,
}: {
  kicker?: string;
  title: string;
  image: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Section>
      <div
        className={`grid items-center gap-10 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal>
          <div>
            {kicker && (
              <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
                {kicker}
              </span>
            )}
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
              {title}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
              {children}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
            <Image src={image} alt={title} fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Fact / info list ---------- */
export function FactGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="bg-white p-6">
          <dt className="text-xs font-semibold uppercase tracking-wide text-brand">{it.label}</dt>
          <dd className="mt-1.5 font-display text-lg font-semibold text-ink">{it.value}</dd>
        </div>
      ))}
    </div>
  );
}

/* ---------- Full-bleed CTA banner ---------- */
export function CtaBanner({
  title,
  text,
  buttonLabel,
  href,
  image,
}: {
  title: string;
  text: string;
  buttonLabel: string;
  href: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden py-28 text-white">
      <Image src={image} alt="" fill sizes="100vw" className="absolute inset-0 z-0 object-cover" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">{text}</p>
          <div className="mt-8">
            <Link
              href={href}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-brand hover:text-white"
            >
              {buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
