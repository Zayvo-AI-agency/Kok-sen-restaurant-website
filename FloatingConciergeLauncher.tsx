import { Sparkles, MessageSquareHeart } from 'lucide-react';

interface FloatingConciergeLauncherProps {
  onOpen: () => void;
}

export function FloatingConciergeLauncher({ onOpen }: FloatingConciergeLauncherProps) {
  return (
    <div className="hidden lg:flex fixed bottom-8 right-6 lg:right-10 z-40 items-center gap-2">
      {/* Concierge Trigger Button */}
      <button
        type="button"
        onClick={onOpen}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-surface-container-highest/95 backdrop-blur-md text-on-surface border border-primary/40 shadow-xl hover:shadow-2xl hover:border-primary hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open Kok Sen AI Dining Concierge"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>

        <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-on-primary animate-pulse" />
        </div>

        <div className="flex flex-col text-left">
          <span className="font-dish-title text-xs font-bold leading-none text-on-surface group-hover:text-primary transition-colors">
            Ask AI Concierge
          </span>
          <span className="text-[10px] text-tertiary leading-tight mt-0.5">
            Dishes, pairings &amp; tips
          </span>
        </div>
      </button>
    </div>
  );
}
