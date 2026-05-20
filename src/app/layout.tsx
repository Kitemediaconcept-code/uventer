// Triggering rebuild for footer and new pages
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Uventer | Premium Event Booking",
  description: "Experience the best events with our minimalist booking platform.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans relative">
        {/* Global Subtle Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-30" />

        <Navbar />
        <main className="flex-grow pt-20 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
