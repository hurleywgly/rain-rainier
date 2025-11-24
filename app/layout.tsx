import type { Metadata, Viewport } from "next";
import { didot, gotham } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
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
        url: "/images/rainier-out.png",
        width: 1200,
        height: 630,
        alt: "Mount Rainier visible from Seattle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rain or Rainier | Seattle Weather",
    description: "Is it raining, or is Rainier out? Find out instantly with beautiful, real-time Seattle weather.",
    creator: "@rywigs",
    images: ["/images/rainier-out.png"],
  },
  icons: {
    apple: "/images/rainier-out.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${didot.variable} ${gotham.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
