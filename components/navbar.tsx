'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Layers, 
  Activity, 
  Database, 
  Lock, 
  Terminal,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Fleet Mission Control', href: '/', icon: Activity },
    { name: 'Agent Registry', href: '/registry', icon: Layers },
    { name: 'Workflow Telemetry', href: '/runs', icon: Terminal },
    { name: 'Memory Bank', href: '/memory', icon: Database },
    { name: 'Model Armor', href: '/security', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-card-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-600 via-cyan-500 to-emerald-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090e1a] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-white">FORTRESS<span className="text-cyan-400">FLEET</span></span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                  GEAP Ready
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">The Fortified Enterprise Fleet</p>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600/20 text-cyan-300 border border-primary-500/40 shadow-sm shadow-primary-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Status & Demo CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">FLEET ONLINE</span>
          </div>

          <Link
            href="/runs/demo-elena-vance"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-cyan-600 text-white text-xs font-semibold hover:from-primary-500 hover:to-cyan-500 shadow-md shadow-primary-600/25 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Launch Flagship Audit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
