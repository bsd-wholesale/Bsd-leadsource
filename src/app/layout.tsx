import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lead Dashboard",
  description: "Lead management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="border-b bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Lead Dashboard</h1>
              <div className="flex gap-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/leads" className="text-gray-600 hover:text-gray-900">Leads</Link>
                <Link href="/generate" className="text-gray-600 hover:text-gray-900">Generate Leads</Link>
                <Link href="/actions" className="text-gray-600 hover:text-gray-900">Actions</Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
