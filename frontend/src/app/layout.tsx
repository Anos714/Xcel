import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";
import AppChrome from "@/components/layout/AppChrome";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Xcel — AI X Automation",
    template: "%s | Xcel",
  },
  description:
    "Research, create, enhance, and schedule your X content with Xcel.",
  applicationName: "Xcel",
  generator: "Next.js",
  keywords: ["Xcel", "X automation", "Twitter automation", "AI content"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Xcel",
    title: "Xcel — AI X Automation",
    description:
      "Research, create, enhance, and schedule your X content with XOLO.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xcel — AI X Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xcel — AI X Automation",
    description:
      "Research, create, enhance, and schedule your X content with XOLO.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AppChrome>{children}</AppChrome>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
