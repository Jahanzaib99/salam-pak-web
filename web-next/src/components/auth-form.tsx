"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md rounded-[24px] border border-line bg-white p-8 shadow-[0_24px_70px_-32px_rgba(6,19,42,0.45)]">
      <div className="mb-6 flex rounded-full bg-cloud p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
              mode === m ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h1 className="font-display text-2xl font-bold text-ink">
        {isLogin ? "Welcome back" : "Join Salam Pakistan"}
      </h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        {isLogin
          ? "Sign in to manage your bookings and trips."
          : "Create an account to save trips and book faster."}
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {!isLogin && (
          <Field icon={User} label="Full name" type="text" placeholder="Your name" />
        )}
        <Field icon={Mail} label="Email" type="email" placeholder="you@example.com" />
        <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />
        {!isLogin && (
          <Field icon={Lock} label="Confirm password" type="password" placeholder="••••••••" />
        )}

        {isLogin && (
          <div className="flex justify-end">
            <Link href="#" className="text-xs font-semibold text-brand hover:underline">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-soft">
        By continuing you agree to the Salam Pakistan Terms & Privacy Policy.
      </p>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  type,
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <span className="flex items-center gap-3 rounded-xl border border-line bg-cloud px-4 py-3 transition-colors focus-within:border-brand focus-within:bg-white">
        <Icon className="h-4 w-4 flex-none text-ink-soft" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
        />
      </span>
    </label>
  );
}
