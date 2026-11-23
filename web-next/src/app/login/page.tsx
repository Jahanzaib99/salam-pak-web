import type { Metadata } from "next";
import Image from "next/image";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your Salam Pakistan account.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-28">
      <Image
        src="/hero/hunza-6.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/55 to-ink/70" />
      <div className="relative z-10 w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  );
}
