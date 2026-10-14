import React from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO, OUTLETS, GALLERY_IMAGES } from '../data/restaurantData';
import { TOP_SIGNATURES } from '../data/menuData';
import { CLIENT_MENU_PHOTOS } from '../data/clientMenuPhotos';
import { resolveDishPhoto } from '../utils/dishPhotoResolver';
import { 
  Flame, 
  Award, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  UtensilsCrossed, 
  Camera, 
  CalendarDays, 
  MessageSquare,
  QrCode,
  Truck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { ReviewsSection } from '../components/ReviewsSection';
import { FaqSection } from '../components/FaqSection';

export function HomePage() {
  const { navigate } = useNavigation();
  const { 
    handleAddToOrder, 
    setSelectedDish, 
    handleOpenConcierge, 
    setReservationOpen,
    setScanTableOpen,
    setDeliveryOpen,
    orderedItemIds,
    currentTable
  } = useApp();

  // Curated preview images from verified gallery
  const previewGallery = GALLERY_IMAGES.slice(0, 6);
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});
  const [imageSources, setImageSources] = React.useState<Record<string, string>>({});

  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 animate-in fade-in duration-300">
      {/* 1. Refined Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-container border border-surface-container-high/80 p-6 sm:p-10 md:p-12 lg:p-16 shadow-2xl min-h-[460px] sm:min-h-[500px] md:min-h-[520px] flex items-center">
        {/* Natural food photograph on the right: No grayscale, reduced dark overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={CLIENT_MENU_PHOTOS.H1}
            alt="Kok Sen Signature Big Prawns Hor Fun"
            className="w-full h-full object-cover object-[78%_center] sm:object-[72%_center] md:object-[68%_center] lg:object-[65%_center] brightness-[0.92] contrast-[1.05]"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Directional Gradient Scrim: Deep dark backdrop on the left for crisp text readability, fading softly to reveal the vibrant golden-red food on the right */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/85 via-50% md:via-48% to-black/25 md:to-transparent" />
        {/* Subtle radial depth to ensure header transition is smooth */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/50" />

        <div className="relative z-20 max-w-xl lg:max-w-2xl flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* Consolidated, Restrained Michelin Hero Badge */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-secondary/35 text-secondary backdrop-blur-md shadow-sm">
              <Award className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Michelin Bib Gourmand Awarded (2016–2026)</span>
            </span>
          </div>

          {/* Refined Headline: Responsive, balanced composition keeping "Keong Saik" together */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display-hero text-2xl sm:text-4xl md:text-5xl lg:text-5xl text-white font-extrabold tracking-tight leading-[1.15]">
              The Roar of the Wok.{' '}
              <br className="hidden sm:inline" />
              <span className="text-secondary italic font-normal">Cantonese Heritage</span> at&nbsp;Keong&nbsp;Saik.
            </h1>
            {/* Shortened, focused description (2-3 readable lines on desktop) */}
            <p className="font-body-lg text-xs sm:text-sm md:text-base text-white/85 leading-relaxed max-w-xl mt-1">
              Discover our signature Big Prawns Hor Fun, claypot tofu and prawn paste chicken. Explore the menu and find your next favourite.
            </p>
          </div>

          {/* Action Hierarchy: View Menu (Primary Red) · Reserve a Table (Secondary Gold) · Order Online (Official Oddle) · Visit & Hours */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5 pt-2 sm:pt-3">
            {/* Primary Action: View Menu */}
            <Link
              href="/menu"
              className="h-11 sm:h-12 px-6 rounded-xl bg-primary hover:bg-[#A82B1B] text-white font-button-text font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 shrink-0" />
              <span>View Menu</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>

            {/* Secondary Action: Reserve a Table */}
            <button
              type="button"
              onClick={() => setReservationOpen(true)}
              className="h-11 sm:h-12 px-6 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary font-button-text font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-secondary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>Reserve a Table</span>
            </button>

            {/* Main Order Online Action */}
            <a
              href="https://koksen.oddle.me/en_SG"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 sm:h-12 px-5 rounded-xl bg-surface-container-high/90 hover:bg-surface-bright text-white border border-primary/50 hover:border-primary font-button-text font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              title="Order online via Oddle"
            >
              <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
              <span>Order Online</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </a>

            {/* Subtle Tertiary Action: Visit & Hours text link */}
            <Link
              href="/visit"
              className="h-10 sm:h-12 px-3 sm:px-4 text-white/80 hover:text-secondary font-button-text font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-secondary shrink-0" />
              <span>Visit &amp; Hours</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Compact Two-Column Outlet Overview (Keong Saik & City Square Mall) */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider font-label-caps">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Our Two Singapore Outlets</span>
          </div>
          <Link 
            href="/visit"
            className="text-xs text-tertiary hover:text-white transition-colors flex items-center gap-1 font-semibold"
          >
            <span>Directions &amp; MRT</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Outlet 1: Keong Saik Flagship */}
          <div className="rounded-2xl bg-surface-container border border-surface-container-high/80 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-md hover:border-secondary/30 transition-colors">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-on-surface">
                  1) Keong Saik Flagship
                </span>
                <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full border border-secondary/30">
                  Est. 1968
                </span>
              </div>

              <div className="text-xs text-tertiary space-y-1">
                <p className="text-on-surface/90 font-medium">4 Keong Saik Road, Singapore 089110</p>
                <p className="text-[11px] text-tertiary">Chinatown / 4 min from Outram Park MRT (Exit 4)</p>
                <div className="pt-1 text-[11px] text-on-surface-variant flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>Tue–Sun: 12:00pm–2:15pm · 5:00pm–9:15pm (Mon Closed)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-container-high/60 flex items-center gap-2">
              <a
                href="https://wa.me/6597272533"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="WhatsApp Keong Saik reservation host"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: 9727 2533</span>
              </a>
              <Link
                href="/visit"
                className="py-2 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors"
              >
                Map
              </Link>
            </div>
          </div>

          {/* Outlet 2: City Square Mall */}
          <div className="rounded-2xl bg-surface-container border border-surface-container-high/80 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-md hover:border-secondary/30 transition-colors">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-on-surface">
                  2) City Square Mall
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Air-Conditioned
                </span>
              </div>

              <div className="text-xs text-tertiary space-y-1">
                <p className="text-on-surface/90 font-medium">180 Kitchener Road, #02-K1/K2, Singapore 208539</p>
                <p className="text-[11px] text-tertiary">Kitchener Road / Direct Link from Farrer Park MRT (Exit I)</p>
                <div className="pt-1 text-[11px] text-on-surface-variant flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>Open Daily · Monday–Sunday</span>
                  </div>
                  <div className="pl-5 text-tertiary">
                    Lunch: 11:30am–2:30pm · Dinner: 4:30pm–9:00pm
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-container-high/60 flex items-center gap-2">
              <a
                href="https://wa.me/6596244244"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="WhatsApp City Square Mall reservation host"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: 9624 4244</span>
              </a>
              <Link
                href="/visit"
                className="py-2 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors"
              >
                Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Selection of Signature Dishes */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-container-high/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <Flame className="w-4 h-4 text-primary" />
              <span className="uppercase tracking-wider font-label-caps">The Icons of Keong Saik</span>
            </div>
            <h2 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface mt-1">
              Top Wok Favourites
            </h2>
            <p className="text-xs sm:text-body-sm text-tertiary mt-1">
              Every table starts here. The dishes that earned Kok Sen consecutive Michelin Bib Gourmand honors (2016–2026).
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-white transition-colors group shrink-0"
          >
            <span>Explore Our Full Menu (125 Listings)</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Signature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TOP_SIGNATURES.slice(0, 4).map((dish) => {
            const dishKey = dish.source_item_id || dish.id;
            const isOrdered = orderedItemIds.includes(dish.id);
            const photoRes = resolveDishPhoto(dish);
            const currentSrc = imageSources[dishKey] || photoRes.imageUrl || dish.imageUrl || photoRes.photo_source_url || dish.photo_source_url;
            const hasValidImage = Boolean(photoRes.hasOriginalPhoto && currentSrc && !imageErrors[dishKey] && !photoRes.isConflict);

            return (
              <div
                key={dishKey}
                className="group relative flex flex-col rounded-2xl bg-surface-container border border-surface-container-high/80 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-2xl"
              >
                {/* Food Image */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-surface-container-lowest cursor-pointer"
                  onClick={() => setSelectedDish(dish)}
                >
                  {hasValidImage ? (
                    <img
                      src={currentSrc}
                      alt={dish.nameEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={() => {
                        const fallbackUrl = photoRes.photo_source_url || dish.photo_source_url || dish.source_url;
                        if (fallbackUrl && currentSrc !== fallbackUrl) {
                          setImageSources((prev) => ({ ...prev, [dishKey]: fallbackUrl }));
                        } else {
                          setImageErrors((prev) => ({ ...prev, [dishKey]: true }));
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-tertiary p-4 text-center select-none">
                      <UtensilsCrossed className="w-8 h-8 text-secondary/40 mb-2" />
                      <span className="font-bold text-sm text-on-surface">{dish.itemCode || dish.code}</span>
                      <span className="text-xs text-tertiary">Photo unavailable</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[11px] font-bold text-secondary border border-secondary/30">
                    {dish.itemCode || dish.code}
                  </div>

                  {dish.isSignature && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider">
                      Signature
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 
                      onClick={() => setSelectedDish(dish)}
                      className="font-dish-title text-base sm:text-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug"
                    >
                      {dish.nameEn}
                    </h3>
                    {dish.nameZh && (
                      <span className="text-xs font-semibold text-tertiary">
                        {dish.nameZh}
                      </span>
                    )}
                    <p className="text-xs text-tertiary line-clamp-2 leading-relaxed mt-1">
                      {dish.description}
                    </p>

                    {dish.orderingNotes && dish.orderingNotes.length > 0 && (
                      <div className="mt-2 p-2 rounded-lg bg-secondary/10 border border-secondary/20 text-[11px] text-secondary">
                        <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Online Order Notice:</span>
                        {dish.orderingNotes.map((note, idx) => (
                          <span key={idx} className="block leading-tight mt-0.5">• {note}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-surface-container-high/60">
                    <button
                      type="button"
                      onClick={() => setSelectedDish(dish)}
                      className="w-full py-2 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      Sizes &amp; Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Heritage Teaser: 50+ Years at 4 Keong Saik */}
      <section className="rounded-2xl sm:rounded-3xl bg-surface-container-low border border-surface-container-high/80 p-6 sm:p-10 lg:p-12 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest">
              <span>Third-Generation Custodians</span>
              <span className="text-tertiary">·</span>
              <span>1968 to Present</span>
            </div>
            <h2 className="font-headline-xl text-2xl sm:text-4xl text-on-surface font-extrabold leading-tight">
              A Living Shophouse Institution: <br />
              <span className="text-secondary italic font-normal">Kok Sen Restaurant (國成餐室)</span>
            </h2>
            <p className="font-body-md text-sm sm:text-base text-tertiary leading-relaxed">
              Before Keong Saik became one of Singapore’s most fashionable dining streets, Kok Sen was already here. Founded in 1968 as 國成球記菜社, the kitchen remains renowned for the intense heat of its woks and the richness of its house-made stocks.
            </p>
            <p className="font-body-md text-sm sm:text-base text-tertiary leading-relaxed">
              We continue the time-honored technique: cracking river prawns, caramelizing black beans, and braising homemade beancurd puffs stuffed with squid and fish paste in bubbling earthen pots.
            </p>
            <div className="pt-2">
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface border border-surface-container-high text-sm font-semibold transition-all hover:scale-[1.02]"
              >
                <span>Read Full Heritage &amp; Wok Hei Story</span>
                <ChevronRight className="w-4 h-4 text-secondary" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative rounded-xl overflow-hidden aspect-4/5 border border-surface-container-high shadow-lg">
              <img
                src="https://ucarecdn.com/c8bbfc23-e348-411b-bfd5-fd7b8dba4363/"
                alt="Kok Sen Claypot Yong Tau Foo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md text-[10px] text-tertiary font-medium text-center">
                Claypot Craft
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-4/5 border border-surface-container-high shadow-lg mt-6">
              <img
                src="https://ucarecdn.com/d5709a32-eb33-4e52-8579-0f611d0dd94a/"
                alt="Kok Sen Har Cheong Gai"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md text-[10px] text-tertiary font-medium text-center">
                Har Cheong Gai
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Outlet Previews: Keong Saik Flagship & City Square Mall */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-container-high/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="uppercase tracking-wider font-label-caps">Locations &amp; Hours</span>
            </div>
            <h2 className="font-headline-xl text-2xl sm:text-3xl text-on-surface mt-1">
              Two Historic Outlets in Singapore
            </h2>
            <p className="text-xs sm:text-body-sm text-tertiary mt-1">
              Both kitchen teams uphold the same wok temperatures, homemade recipes, and Michelin standards.
            </p>
          </div>

          <Link
            href="/visit"
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-white transition-colors group shrink-0"
          >
            <span>Detailed Directions &amp; Transit</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OUTLETS.map((outlet) => (
            <div
              key={outlet.id}
              className="p-6 sm:p-7 rounded-2xl bg-surface-container border border-surface-container-high/80 flex flex-col justify-between gap-5 shadow-lg relative overflow-hidden"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    outlet.isFlagship
                      ? 'bg-secondary/20 text-secondary border border-secondary/30'
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}>
                    {outlet.isFlagship ? 'Flagship Shophouse' : 'City Square Mall'}
                  </span>
                  <span className="text-xs text-tertiary font-medium">Walk-ins Welcome</span>
                </div>

                <div>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    {outlet.name}
                  </h3>
                  <p className="text-xs font-medium text-tertiary mt-0.5">
                    {outlet.nameZh} · {outlet.district}
                  </p>
                </div>

                <div className="space-y-2 text-xs sm:text-body-sm text-tertiary pt-2 border-t border-surface-container-high/60">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>{outlet.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      {outlet.id === 'city-square-mall' ? (
                        <>
                          <strong className="text-emerald-400 font-semibold block">Open Daily · Monday–Sunday</strong>
                          <span>Lunch: 11:30am–2:30pm</span>
                          <br />
                          <span>Dinner: 4:30pm–9:00pm</span>
                        </>
                      ) : (
                        <>
                          <span>Lunch: 12:00pm – 2:15pm (LO 2:00pm)</span>
                          <br />
                          <span>Dinner: 5:00pm – 9:15pm (LO 8:45pm)</span>
                          <br />
                          <strong className="text-rose-400 font-semibold">Closed on Mondays</strong>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-surface-container-high/60">
                <a
                  href={outlet.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Reservation</span>
                </a>
                <Link
                  href="/visit"
                  className="py-2.5 px-4 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs transition-colors flex items-center justify-center"
                >
                  Map &amp; Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Visual Archive Preview */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-container-high/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <Camera className="w-4 h-4 text-primary" />
              <span className="uppercase tracking-wider font-label-caps">Visual Archive</span>
            </div>
            <h2 className="font-headline-xl text-2xl sm:text-3xl text-on-surface mt-1">
              Evenings at Kok Sen
            </h2>
            <p className="text-xs sm:text-body-sm text-tertiary mt-1">
              Atmosphere, bubbling claypots, and verified diner photography from our archives.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-white transition-colors group shrink-0"
          >
            <span>Explore All Photos &amp; Lightbox</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {previewGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/gallery')}
              className="group relative rounded-xl overflow-hidden aspect-square bg-surface-container cursor-pointer border border-surface-container-high/60 shadow-md"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                <span className="text-[11px] text-white font-medium truncate">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Reviews & Michelin Accolades */}
      <ReviewsSection />

      {/* 7. FAQs */}
      <FaqSection />

      {/* 8. Call to Action Banner */}
      <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary-container via-[#8d1c1c] to-surface-container-highest p-8 sm:p-12 text-center text-white flex flex-col items-center gap-4 shadow-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Ready for an Authentic Zi Char Feast?
        </span>
        <h2 className="font-headline-xl text-2xl sm:text-4xl font-extrabold max-w-xl leading-tight">
          Reserve Your Table or Pack Wok-Charred Takeaway Tonight.
        </h2>
        <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
          Walk-ins are welcomed, but dinner tables fill rapidly. Message our hosts on WhatsApp or explore our complete 125-item menu now.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/reservations"
            className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            Reserve Table via WhatsApp
          </Link>
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 backdrop-blur-md transition-all"
          >
            Browse Full Menu
          </Link>
          <Link
            href="/delivery"
            className="px-6 py-3 rounded-xl bg-black/30 hover:bg-black/50 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all"
          >
            Delivery &amp; Takeaway Guide
          </Link>
        </div>
      </section>
    </div>
  );
}
