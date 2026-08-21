import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "FortressFleet — The Fortified Enterprise Fleet",
  description: "Enterprise-grade autonomous multi-agent platform for discovery, orchestration, zero-trust governance, and observability in corporate supply chains. Powered by Google Gemini & GEAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full border-t border-card-border/60 glass-panel py-6 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">FORTRESS<span className="text-cyan-400">FLEET</span></span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-[11px] text-slate-400">Gemini Enterprise Agent Platform (GEAP)</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GCP Cloud Run (Scale-to-Zero)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">Gemini 2.5 Flash</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">Gemma 2 Guardrails</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
