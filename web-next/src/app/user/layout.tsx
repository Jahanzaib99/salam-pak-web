import AccountNav from "@/components/account-nav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-cloud">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-36">
        <div className="mb-8">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-brand">
            My account
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
            Welcome back, traveller
          </h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <AccountNav />
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
