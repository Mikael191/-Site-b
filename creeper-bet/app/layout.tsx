import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, Navbar, MobileNav } from "@/components/layout";
import { WalletProvider } from "@/context/wallet-context";
import { SessionProviderWrapper } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Creeper Bet - Cassino Online",
  description: "A melhor plataforma de cassino online simulado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-casino-black text-gray-100">
        <SessionProviderWrapper>
          <WalletProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 p-4 md:p-6 mt-16 mb-16 md:mb-0 overflow-x-hidden">
                  {children}
                </main>
              </div>
            </div>
            <MobileNav />
          </WalletProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
