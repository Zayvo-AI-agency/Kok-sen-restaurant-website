import { Sparkles, UtensilsCrossed, ShieldAlert, Clock, ArrowRight, MessageSquareHeart } from 'lucide-react';

interface ConciergeSpotlightSectionProps {
  onOpenConcierge: (initialPrompt?: string) => void;
}

export function ConciergeSpotlightSection({ onOpenConcierge }: ConciergeSpotlightSectionProps) {
  return (
    <section className="mt-6 sm:mt-10 w-full max-w-full min-w-0">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container via-surface-container-high/40 to-surface-container-lowest border border-primary/30 p-4 sm:p-6 md:p-8 shadow-xl">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          {/* Left Text */}
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Kok Sen AI Dining Assistant
              </span>
              <span className="text-[11px] sm:text-xs text-secondary hidden sm:inline font-medium">
                • 125 Authentic Menu Listings Grounding
              </span>
            </div>

            <h3 className="font-headline-lg text-xl sm:text-2xl md:text-headline-lg text-on-surface">
              Need personalized advice for your table?
            </h3>

            <p className="font-body-md text-xs sm:text-sm md:text-base text-tertiary leading-relaxed">
              Our AI Dining Concierge acts as your personal Keong Saik dining host. Ask about wok hei signatures, dietary and crustacean allergy safeguards, custom 4-to-8 person table spreads, or peak hour walk-in strategies.
            </p>

            {/* Quick Interactive Prompt Chips - horizontally scrollable on mobile */}
            <div className="w-full max-w-full min-w-0 flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar touch-scroll py-1">
              <button
                type="button"
                onClick={() => onOpenConcierge('What are the top must-order dishes for a first-time visitor?')}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high/80 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Must-Order Wok Plates</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenConcierge('I have a shellfish allergy and need vegetarian options. What can we order?')}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high/80 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span>Allergy &amp; Veg</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenConcierge('What is the best feast pairing for a family of 4?')}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high/80 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>4-Person Feast</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenConcierge('Can we walk in for dinner tonight or is a reservation needed?')}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high/80 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Clock className="w-3.5 h-3.5 text-tertiary shrink-0" />
                <span>Walk-ins &amp; Hours</span>
              </button>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenConcierge()}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareHeart className="w-4 h-4 shrink-0" />
              <span>Chat with Dining Concierge</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
