import React, { useState } from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { OUTLETS, RESTAURANT_INFO, PHOTO_ASSETS } from '../data/restaurantData';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Train, 
  Car, 
  AlertCircle, 
  ExternalLink,
  CalendarDays,
  Utensils
} from 'lucide-react';

export function VisitPage() {
  const { navigate } = useNavigation();
  const { setSelectedOutlet } = useApp();

  // Lazy map loading state (load only on click to preserve mobile performance)
  const [loadKeongSaikMap, setLoadKeongSaikMap] = useState<boolean>(false);
  const [loadCitySquareMap, setLoadCitySquareMap] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-10 sm:gap-14 animate-in fade-in duration-300">
      {/* 1. Header */}
      <section className="flex flex-col gap-3 border-b border-surface-container-high/60 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="uppercase tracking-widest font-label-caps">Locations, Hours &amp; Transit</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
              Visit Us <span className="font-normal italic text-secondary text-2xl sm:text-3xl ml-1 font-serif">分店与营业时间</span>
            </h1>
            <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl mt-1.5 leading-relaxed">
              Experience the roar of the wok in person at our iconic Keong Saik shophouse or our accessible City Square Mall outlet. Walk-ins are always welcomed; dinner reservations are recommended.
            </p>
          </div>

          <Link
            href="/reservations"
            className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shrink-0 transition-all hover:scale-105"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Make a Reservation Enquiry</span>
          </Link>
        </div>
      </section>

      {/* 2. Dual Outlet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Outlet 1: Keong Saik Flagship */}
        <div className="flex flex-col rounded-2xl bg-surface-container border border-surface-container-high/80 overflow-hidden shadow-xl">
          {/* Outlet Banner Image */}
          <div className="relative aspect-16/9 bg-surface-container-lowest overflow-hidden">
            <img
              src={PHOTO_ASSETS.storefront}
              alt="Kok Sen 4 Keong Saik Road Flagship Storefront"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
            
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold uppercase tracking-wider shadow-md">
              Flagship Shophouse
            </div>
            
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs font-medium text-secondary">Chinatown Historic District</span>
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold leading-tight">
                Keong Saik Flagship Outlet
              </h2>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Address</strong>
                  <span className="text-xs sm:text-sm text-tertiary">4 Keong Saik Road, Singapore 089110</span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Operating Hours</strong>
                  <div className="text-xs sm:text-sm text-tertiary space-y-0.5 mt-0.5">
                    <p><strong className="text-rose-400">Monday: Closed</strong> (Kitchen Rest)</p>
                    <p><strong>Tuesday – Sunday:</strong></p>
                    <p className="pl-2">Lunch: 12:00 PM – 2:15 PM (Last Order 2:00 PM)</p>
                    <p className="pl-2">Dinner: 5:00 PM – 9:15 PM (Last Order 8:45 PM)</p>
                    <p className="text-[11px] text-secondary font-medium pt-0.5">
                      Open until 10:30 PM on weekend peak for seated diners
                    </p>
                  </div>
                </div>
              </div>

              {/* Transit & MRT */}
              <div className="flex items-start gap-3">
                <Train className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Nearest MRT Stations</strong>
                  <div className="text-xs text-tertiary space-y-1 mt-0.5">
                    <p>• <strong>Outram Park MRT (EW16 / NE3 / TE17):</strong> 4-minute walk from Exit 4</p>
                    <p>• <strong>Maxwell MRT (TE18):</strong> 5-minute walk from Exit 2</p>
                    <p>• <strong>Chinatown MRT (NE4 / DT19):</strong> 6-minute walk from Exit H</p>
                  </div>
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Parking</strong>
                  <span className="text-xs text-tertiary">
                    Street parking lots along Keong Saik Road and Bukit Pasoh; multi-storey parking at Kreta Ayer Complex (5 min walk).
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Map Embed Trigger */}
            <div className="space-y-3 pt-4 border-t border-surface-container-high/60">
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/6597272533"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: 9727 2533</span>
                </a>
                <a
                  href="tel:6597272533"
                  className="py-3 px-4 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                  title="Call Restaurant Directly"
                >
                  <Phone className="w-4 h-4 text-secondary" />
                  <span>Call</span>
                </a>
              </div>

              {/* Google Map on demand */}
              <div>
                {!loadKeongSaikMap ? (
                  <button
                    type="button"
                    onClick={() => setLoadKeongSaikMap(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-highest/80 hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-surface-container-high cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-secondary" />
                    <span>Load Live Google Map for Keong Saik</span>
                  </button>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-surface-container-high aspect-16/9 bg-surface-container-lowest">
                    <iframe
                      title="Kok Sen Keong Saik Google Map"
                      src="https://maps.google.com/maps?q=Kok+Sen+Restaurant,+4+Keong+Saik+Road,+Singapore&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              <a
                href="https://share.google/jMYusWcExuUr1jP0p"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-secondary hover:underline flex items-center justify-center gap-1 pt-1"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Outlet 2: City Square Mall */}
        <div className="flex flex-col rounded-2xl bg-surface-container border border-surface-container-high/80 overflow-hidden shadow-xl">
          {/* Outlet Banner Image */}
          <div className="relative aspect-16/9 bg-surface-container-lowest overflow-hidden">
            <img
              src={PHOTO_ASSETS.panoramicHall}
              alt="Kok Sen City Square Mall Dining Hall"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
            
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-md">
              City Square Mall Outlet
            </div>
            
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs font-medium text-secondary">Kitchener Road · Farrer Park MRT</span>
              <h2 className="font-headline-md text-xl sm:text-2xl font-bold leading-tight">
                City Square Mall Outlet
              </h2>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Address</strong>
                  <span className="text-xs sm:text-sm text-tertiary">
                    City Square Mall, 180 Kitchener Road, Singapore 208539
                  </span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Operating Hours</strong>
                  <div className="text-xs sm:text-sm text-tertiary space-y-0.5 mt-0.5">
                    <p><strong className="text-emerald-400">Open Daily · Monday–Sunday</strong></p>
                    <p className="pl-2">Lunch: 11:30am–2:30pm</p>
                    <p className="pl-2">Dinner: 4:30pm–9:00pm</p>
                    <p className="text-[11px] text-secondary font-medium pt-0.5">
                      Fully air-conditioned dining room with round family banquet tables
                    </p>
                  </div>
                </div>
              </div>

              {/* Transit & MRT */}
              <div className="flex items-start gap-3">
                <Train className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Nearest MRT Stations</strong>
                  <div className="text-xs text-tertiary space-y-1 mt-0.5">
                    <p>• <strong>Farrer Park MRT (NE8):</strong> Direct sheltered underpass connection via Exit I</p>
                    <p>• <strong>Jalan Besar MRT (DT22):</strong> 8-minute walk from Exit B</p>
                  </div>
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-on-surface text-sm block font-semibold">Parking</strong>
                  <span className="text-xs text-tertiary">
                    City Square Mall basement carpark (ample lots, sheltered drop-off point, lift accessibility).
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Map Embed Trigger */}
            <div className="space-y-3 pt-4 border-t border-surface-container-high/60">
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/6596244244"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: 9624 4244</span>
                </a>
                <a
                  href="tel:6596244244"
                  className="py-3 px-4 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                  title="Call City Square Mall Outlet Directly"
                >
                  <Phone className="w-4 h-4 text-secondary" />
                  <span>Call</span>
                </a>
              </div>

              {/* Google Map on demand */}
              <div>
                {!loadCitySquareMap ? (
                  <button
                    type="button"
                    onClick={() => setLoadCitySquareMap(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-highest/80 hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-surface-container-high cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-secondary" />
                    <span>Load Live Google Map for City Square Mall</span>
                  </button>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-surface-container-high aspect-16/9 bg-surface-container-lowest">
                    <iframe
                      title="Kok Sen City Square Mall Google Map"
                      src="https://maps.google.com/maps?q=City+Square+Mall,+180+Kitchener+Road,+Singapore&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              <a
                href="https://maps.google.com/?q=City+Square+Mall+180+Kitchener+Road+Singapore"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-secondary hover:underline flex items-center justify-center gap-1 pt-1"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Essential Dining Guidelines */}
      <section className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-surface-container-high/80 flex flex-col gap-4">
        <h3 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-secondary" />
          <span>Helpful Tips for Dining at Kok Sen</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-tertiary">
          <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/60">
            <strong className="text-on-surface block font-semibold mb-1">Peak Dinner Timing &amp; Seating</strong>
            <p className="leading-relaxed">
              Dinner queues typically form around 5:15 PM and 6:45 PM. During peak weekend dinner hours, a standard 75-minute dining duration ensures all waiting families can be seated promptly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/60">
            <strong className="text-on-surface block font-semibold mb-1">Walk-Ins &amp; Queuing</strong>
            <p className="leading-relaxed">
              We always reserve tables for walk-in guests at both lunch and dinner. For smooth seating, lunch services (12:00 PM – 2:00 PM) generally offer quicker table turnaround.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/60">
            <strong className="text-on-surface block font-semibold mb-1">Corkage &amp; Beverages</strong>
            <p className="leading-relaxed">
              Corkage fee is $20 per bottle of wine. Strictly no outside beers allowed — we serve ice-cold Tsingtao and Tiger beer alongside homemade herbal barley and Chinese floral teas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
