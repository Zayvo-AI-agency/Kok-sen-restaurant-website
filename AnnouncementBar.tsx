import { RESTAURANT_INFO } from '../data/restaurantData';

export function AnnouncementBar() {
  return (
    <aside 
      id="announcement-bar"
      className="hidden sm:block w-full max-w-full overflow-hidden bg-surface-container-lowest text-on-surface-variant py-1.5 sm:py-2 border-b border-surface-container-high/40"
    >
      <div className="w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between text-center overflow-hidden">
        <div className="flex-1 min-w-0 font-label-caps text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-secondary flex items-center justify-center gap-2 px-1">
          <span className="material-symbols-outlined text-secondary text-[14px] sm:text-[16px] shrink-0">military_tech</span>
          <span>Michelin Bib Gourmand Heritage · Fired to Order on Keong Saik Road</span>
          <span className="text-tertiary">|</span>
          <a className="hover:underline text-on-surface font-semibold" href={`tel:${RESTAURANT_INFO.phoneClean}`}>
            Call: 9727 2533
          </a>
        </div>
        <div className="hidden lg:flex items-center gap-space-xs font-label-caps text-label-caps text-tertiary-fixed-dim">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>Keong Saik Rd · Lunch &amp; Dinner</span>
        </div>
      </div>
    </aside>
  );
}
