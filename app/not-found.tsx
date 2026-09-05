import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-fg mb-2">404 - Node Not Found</h2>
      <p className="text-sm text-fg-3 max-w-md mb-6">
        The agent node or resource you are attempting to audit does not exist or has expired within the Zero-Trust registry.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Mission Control
      </Link>
    </div>
  );
}
