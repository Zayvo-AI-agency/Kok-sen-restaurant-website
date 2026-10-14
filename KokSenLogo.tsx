interface KokSenLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'dark';
}

export function KokSenLogo({ className = 'h-10', variant = 'full' }: KokSenLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* Brand Calligraphy and Badge Emblem matching 4 Keong Saik Signboard */}
      <div className="flex items-center gap-0.5 sm:gap-1 font-bold tracking-tight shrink-0">
        {/* Character 國 */}
        <span 
          className="text-on-surface text-xl sm:text-3xl font-extrabold"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', 'STSong', serif" }}
        >
          國
        </span>

        {/* Center Vertically Stacked Red Badge Circles with Authentic "球記" (Kow Kee) */}
        <div className="flex flex-col items-center justify-center gap-0.5 mx-0.5 shrink-0">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#C82828] border border-[#FFD700]/30 flex items-center justify-center text-[8px] sm:text-[10px] text-white font-bold leading-none shadow-sm">
            球
          </div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#C82828] border border-[#FFD700]/30 flex items-center justify-center text-[8px] sm:text-[10px] text-white font-bold leading-none shadow-sm">
            記
          </div>
        </div>

        {/* Character 成 */}
        <span 
          className="text-on-surface text-xl sm:text-3xl font-extrabold"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', 'STSong', serif" }}
        >
          成
        </span>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col justify-center border-l border-surface-container-high pl-1.5 sm:pl-2.5 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-[#C82828] font-black tracking-wide sm:tracking-widest text-[9.5px] sm:text-xs uppercase leading-none font-sans whitespace-nowrap">
              KOK SEN RESTAURANT
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-secondary text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
              EST. 1968 · 4 KEONG SAIK
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-secondary/60 shrink-0" />
            <span className="hidden sm:inline text-emerald-400 text-[9px] uppercase tracking-wider font-bold whitespace-nowrap">
              BIB GOURMAND
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
