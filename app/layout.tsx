import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import ThemeProvider from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "FortressFleet — Enterprise Agent Platform",
  description: "Enterprise autonomous multi-agent platform for discovery, orchestration, zero-trust governance, and observability. Powered by Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-page text-fg selection:bg-accent/20">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          <footer className="w-full border-t border-edge/[0.08] py-5 text-xs text-fg-4">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fg-2">FortressFleet</span>
                <span className="text-edge/[0.2]">·</span>
                <span className="text-fg-4">Enterprise Agent Platform</span>
              </div>

              <div className="flex items-center gap-3 text-fg-4">
                <span>Gemini 3.8 Flash</span>
                <span className="text-edge/[0.2]">·</span>
                <span>Cloud Run</span>
                <span className="text-edge/[0.2]">·</span>
                <span>Gemma 4 Guardrails</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
