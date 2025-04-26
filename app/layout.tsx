import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SpotifyProvider } from "@/components/spotify-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Dashboard",
  description: "Advanced Spotify Dashboard with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SpotifyProvider>
              <div className="relative flex h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-transparent">
                  <Header />
                  <div>{children}</div>
                </main>
                <MobileNav />
              </div>
            </SpotifyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}