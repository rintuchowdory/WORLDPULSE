import { Globe, Radio } from 'lucide-react';

interface HeaderProps {
  liveCount: number;
}

export function Header({ liveCount }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#0a0e1a]" />
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-wider text-white">
              WORLD<span className="text-cyan-400">PULSE</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              Global Event Intelligence
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#explore" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Explore
          </a>
          <a href="#live" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Live
          </a>
          <a href="#analytics" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Analytics
          </a>
          <a href="#alerts" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Alerts
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">{liveCount} LIVE</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-gray-300">
            WP
          </div>
        </div>
      </div>
    </header>
  );
}
