import React from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { UtensilsCrossed, Home, MapPin, CalendarDays, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 sm:p-12 gap-6 max-w-xl mx-auto animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
        <UtensilsCrossed className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-secondary uppercase tracking-widest">
          404 · Page Not Found / 找不到页面
        </span>
        <h1 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-extrabold">
          This Plate Seems to Have Wandered Off
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-tertiary leading-relaxed">
          The page you are looking for might have been moved or does not exist. Let us guide you back to our steaming woks and heritage dining rooms.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/menu"
          className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Explore Menu</span>
        </Link>

        <Link
          href="/visit"
          className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-semibold border border-surface-container-high transition-all flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-secondary" />
          <span>Visit Us</span>
        </Link>
      </div>
    </div>
  );
}
