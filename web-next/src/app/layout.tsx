import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import RehbarChat from "@/components/rehbar-chat";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Salam Pakistan — Official Travel Guide",
    template: "%s | Salam Pakistan",
  },
  description:
    "The official travel guide to Pakistan — discover where to go, what to do, plan your trip, and book your journey.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <SmoothScroll>
          <SiteHeader />
          {children}
          <SiteFooter />
          <RehbarChat />
        </SmoothScroll>
      </body>
    </html>
  );
}
