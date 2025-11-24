import type { Metadata, Viewport } from "next";
import { didot, gotham } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rain or Rainier | Seattle Weather",
  description: "Is it raining, or is Rainier out? Find out instantly with beautiful, real-time Seattle weather.",
  keywords: ["Seattle weather", "Mount Rainier", "rain", "Pacific Northwest"],
  authors: [{ name: "Ryan" }],
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
