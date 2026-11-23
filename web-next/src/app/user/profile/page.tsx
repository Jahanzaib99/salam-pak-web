import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

const fields = [
  { label: "Full name", value: "Ali Khan", type: "text" },
  { label: "Email", value: "ali.khan@example.com", type: "email" },
  { label: "Phone", value: "+92 300 1234567", type: "tel" },
  { label: "Country", value: "Pakistan", type: "text" },
  { label: "City", value: "Islamabad", type: "text" },
];

export default function ProfilePage() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 lg:p-8">
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 font-display text-xl font-bold text-brand">
          AK
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Ali Khan</h2>
          <p className="text-sm text-ink-soft">Member since 2024</p>
        </div>
      </div>

      <form className="mt-6 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.label} className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {f.label}
            </span>
            <input
              defaultValue={f.value}
              type={f.type}
              className="w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white"
            />
          </label>
        ))}
        <div className="sm:col-span-2">
          <button
            type="button"
            className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
