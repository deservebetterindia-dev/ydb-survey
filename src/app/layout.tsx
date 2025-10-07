import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = "width=device-width, initial-scale=1";

export const metadata: Metadata = {
  title: "PCOS Survey - Share Your Story | You Deserve Better",
  description: "Join thousands of Indian women sharing their PCOS journey. Take our survey and get access to PCOS resources, health tips, and community support directly in your email.",
  keywords: "PCOS survey, PCOD India, women health survey, PCOS symptoms, PCOS treatment, Indian women PCOS, PCOS support community, PCOS resources, hormonal health, reproductive health",
  authors: [{ name: "You Deserve Better Team" }],
  openGraph: {
    title: "PCOS Survey - Share Your Story | You Deserve Better",
    description: "Join thousands of Indian women sharing their PCOS journey. Get PCOS resources and support.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "PCOS Survey - Share Your Story",
    description: "Join thousands of Indian women sharing their PCOS journey. Get PCOS resources and support.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
