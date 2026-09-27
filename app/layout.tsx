import type { Metadata, Viewport } from "next";
import { didot, gotham } from "./fonts";
import "./globals.css";
import { PostHogProvider } from "./providers/posthog-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://rain-or-rainier.netlify.app"),
  title: "Rain or Rainier | Seattle Weather",
  description: "Is it raining, or is Rainier out? Find out instantly with beautiful, real-time Seattle weather.",
  keywords: ["Seattle weather", "Mount Rainier", "rain", "Pacific Northwest", "Seattle", "weather"],
  authors: [{ name: "Ryan", url: "https://x.com/rywigs" }],
  openGraph: {
    title: "Rain or Rainier | Seattle Weather",
    description: "Is it raining, or is Rainier out? Find out instantly with beautiful, real-time Seattle weather.",
    url: "https://rain-or-rainier.netlify.app/",
    siteName: "Rain or Rainier",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1680,
        height: 945,
        alt: "Rain or Rainier - Seattle weather showing four states: Rainier Out, Dry, Raining, and Snowing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rain or Rainier | Seattle Weather",
    description: "Is it raining, or is Rainier out? Find out instantly with beautiful, real-time Seattle weather.",
    creator: "@rywigs",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1c222b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${didot.variable} ${gotham.variable}`}>
      <body className="antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
