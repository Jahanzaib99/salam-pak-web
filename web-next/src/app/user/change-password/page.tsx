import type { Metadata } from "next";

export const metadata: Metadata = { title: "Change Password" };

const fields = [
  { label: "Current password" },
  { label: "New password" },
  { label: "Confirm new password" },
];

export default function ChangePasswordPage() {
  return (
    <div className="max-w-lg rounded-2xl border border-line bg-white p-6 lg:p-8">
      <h2 className="font-display text-xl font-semibold text-ink">Change password</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Choose a strong password you don&apos;t use anywhere else.
      </p>
      <form className="mt-6 space-y-4">
        {fields.map((f) => (
          <label key={f.label} className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {f.label}
            </span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand focus:bg-white"
            />
          </label>
        ))}
        <button
          type="button"
          className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
