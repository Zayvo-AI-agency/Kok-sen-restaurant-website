import { useState } from 'react';
import { RESTAURANT_INFO, getOpeningStatus } from '../data/restaurantData';
import { 
  ArrowRight, 
  QrCode, 
  UtensilsCrossed, 
  Bike, 
  Calendar, 
  Sparkles, 
  Clock, 
  Ribbon
} from 'lucide-react';

const GOLDEN_DRAGON_CHICKEN_HERO_URL = 'https://ucarecdn.com/d985976a-5134-4f8b-bcfc-22a2055a0bfe/';

interface HeroSectionProps {
  onOpenReservation: () => void;
  onOpenConcierge?: () => void;
  onOpenScanTable?: () => void;
  onOpenDelivery?: () => void;
  onScrollToMenu?: () => void;
  currentTable?: number | null;
}

export function HeroSection({ 
  onOpenReservation, 
  onOpenConcierge,
  onOpenScanTable,
  onOpenDelivery,
  onScrollToMenu,
  currentTable
}: HeroSectionProps) {
  const status = getOpeningStatus();
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleScrollToMenu = () => {
    if (onScrollToMenu) {
      onScrollToMenu();
      return;
    }
    const el = document.getElementById('signatures') || document.getElementById('full-menu');
    if (el) {
      const headerEl = document.getElementById('main-header');
      const headerOffset = (headerEl?.offsetHeight || 90) + 10;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="w-full max-w-full flex flex-col gap-3 sm:gap-4 overflow-hidden">
      {/* 1. Top Kitchen Status Pill Bar - Authentic dark heritage styling */}
      <div className="w-full bg-surface-container text-on-surface rounded-xl sm:rounded-2xl py-2 px-3 sm:px-4 border border-surface-container-high/70 shadow-sm flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-secondary shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-on-surface truncate">
            {status.isOpen ? 'Kitchen Open · Closes 9:15 PM' : 'Kitchen Closed · Opens 11:30 AM'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-secondary'}`} />
          <span className="text-[10px] sm:text-[11px] font-bold text-tertiary uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      {/* 2. Hero Card with Full Edge-to-Edge Golden Dragon Chicken Photograph & Cinematic Scrim */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-surface-container-high/60 min-h-[440px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex flex-col justify-center p-5 sm:p-8 md:p-12 lg:p-14">
        {/* Full Edge-to-Edge Hero Photograph */}
        <img 
          src={GOLDEN_DRAGON_CHICKEN_HERO_URL} 
          alt="Kok Sen Golden Dragon Chicken (脆皮金龙鸡)"
          className="absolute inset-0 w-full h-full object-cover object-[65%_35%] sm:object-[68%_42%] md:object-[72%_50%] lg:object-[70%_48%]"
          fetchPriority="high"
          decoding="async"
          onError={() => setImageLoadError(true)}
        />

        {/* Desktop Directional Scrim: Smooth dark gradient behind text on the left, fading completely transparent toward the appetizing dish */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/95 via-black/80 via-42% via-black/30 via-65% to-transparent pointer-events-none" />

        {/* Mobile / Small Screen Scrim: Anchored gradient for readability, softly fading upward so the dish remains prominent */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black/95 via-black/80 via-55% via-black/35 via-80% to-transparent pointer-events-none" />

        {/* Ambient Top & Bottom Depth Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45 pointer-events-none" />

        {/* Error notification if exact image fails to load */}
        {imageLoadError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/95 text-center">
            <p className="text-sm font-semibold text-rose-400 mb-1">
              Hero photograph failed to load
            </p>
            <p className="text-xs text-neutral-400 font-mono break-all max-w-md">
              {GOLDEN_DRAGON_CHICKEN_HERO_URL}
            </p>
          </div>
        )}

        {/* Content over photo - Vertically centered with balanced spacing */}
        <div className="relative z-10 flex flex-col justify-center gap-2 sm:gap-3 md:gap-3.5 max-w-xl lg:max-w-2xl min-w-0">
          {/* Michelin Badge */}
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-primary text-white font-bold text-xs shadow-md">
            <Ribbon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Michelin Bib Gourmand 2016–2026</span>
          </div>

          {/* Bold Headline with Serif Heritage Display */}
          <h1 className="font-display-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mt-0.5 break-words">
            Heritage Zi Char Since 1968
          </h1>

          {/* Subtitle */}
          <p className="text-tertiary text-xs sm:text-sm md:text-base leading-relaxed max-w-lg md:max-w-xl break-words">
            Traditional Cantonese charcoal wok flavours on Keong Saik Road.
          </p>

          {/* CTA Buttons Row - Responsive wrapping on small screens */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
            {/* Primary Red: Order Dishes */}
            <button
              type="button"
              onClick={handleScrollToMenu}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-primary hover:bg-[#8C2214] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>Order Dishes</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {/* Glass Secondary: Scan Table */}
            <button
              type="button"
              onClick={onOpenScanTable}
              className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-surface-container-highest/80 hover:bg-surface-container-highest text-white border border-surface-container-high font-bold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-md shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>{currentTable ? `Table ${currentTable}` : 'Scan Table'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Four Quick Action Cards (Menu, Delivery, Bookings, Ask AI) - Cohesive Heritage Styling */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 w-full">
        {/* Card 1: Menu */}
        <button
          type="button"
          onClick={handleScrollToMenu}
          className="bg-surface-container hover:bg-surface-container-high rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border border-surface-container-high/70 shadow-md flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer active:scale-95 group min-w-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform border border-primary/30 shrink-0">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-bold text-[11px] sm:text-xs md:text-sm text-on-surface leading-tight truncate w-full text-center">Menu</span>
        </button>

        {/* Card 2: Delivery */}
        <button
          type="button"
          onClick={onOpenDelivery}
          className="bg-surface-container hover:bg-surface-container-high rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border border-surface-container-high/70 shadow-md flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer active:scale-95 group min-w-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-950/60 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-500/30 shrink-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-bold text-[11px] sm:text-xs md:text-sm text-on-surface leading-tight truncate w-full text-center">Delivery</span>
        </button>

        {/* Card 3: Bookings */}
        <button
          type="button"
          onClick={onOpenReservation}
          className="bg-surface-container hover:bg-surface-container-high rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border border-surface-container-high/70 shadow-md flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer active:scale-95 group min-w-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-secondary/20 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform border border-secondary/30 shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-bold text-[11px] sm:text-xs md:text-sm text-on-surface leading-tight truncate w-full text-center">Bookings</span>
        </button>

        {/* Card 4: Ask AI */}
        <button
          type="button"
          onClick={onOpenConcierge}
          className="bg-surface-container hover:bg-surface-container-high rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border border-surface-container-high/70 shadow-md flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer active:scale-95 group min-w-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-purple-950/60 text-purple-300 flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-500/30 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-bold text-[11px] sm:text-xs md:text-sm text-on-surface leading-tight truncate w-full text-center">Ask AI</span>
        </button>
      </div>

      {/* 4. Islandwide Delivery & Distance Zones Card */}
      <div 
        onClick={onOpenDelivery}
        className="w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container-high/80 shadow-md flex flex-col gap-2 cursor-pointer transition-all group active:scale-[0.99] min-w-0 overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-primary text-white font-extrabold text-[10px] tracking-wider uppercase shrink-0">
              ISLANDWIDE DELIVERY
            </span>
            <span className="text-secondary text-xs font-semibold truncate">
              {RESTAURANT_INFO.address}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-tertiary group-hover:text-on-surface group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        <h3 className="font-headline-md font-bold text-sm sm:text-base text-on-surface mt-0.5 break-words">
          Wok-Hei Takeaway &amp; Distance Zones
        </h3>

        {/* Clean responsive zone badges wrapping naturally */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-tertiary border border-surface-container-high font-medium">
            Zone 1 (0–5km): S$5
          </span>
          <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-tertiary border border-surface-container-high font-medium">
            Zone 2 (5–12km): S$9
          </span>
          <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-tertiary border border-surface-container-high font-medium">
            Zone 3 (12–25km): S$14
          </span>
          <span className="text-[11px] text-tertiary/70 italic">
            Free waivers available
          </span>
        </div>
      </div>
    </section>
  );
}
