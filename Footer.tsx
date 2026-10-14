import React from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { RESTAURANT_INFO, OUTLETS } from '../data/restaurantData';
import { KokSenLogo } from './KokSenLogo';
import { Award, MapPin, Clock, MessageSquare, Phone, ChevronRight, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenReservation?: () => void;
}

export function Footer({ onOpenReservation }: FooterProps) {
  return (
    <footer 
      id="main-footer"
      className="mt-12 sm:mt-20 pb-32 sm:pb-28 lg:pb-12 pt-10 sm:pt-16 border-t border-surface-container-high/60 bg-surface-container-lowest text-on-surface w-full max-w-full overflow-hidden"
    >
      <div className="w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-10 sm:space-y-14 overflow-hidden">
        {/* Brand narrative row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Brand Intro (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <Link href="/" className="inline-block shrink-0">
              <KokSenLogo variant="full" />
            </Link>

            <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-md leading-relaxed mt-1">
              Authentic Cantonese zi char in historic Keong Saik, Chinatown. Big prawn hor fun, bubbling claypot tofu, prawn paste chicken, and roaring wok hei since 1968.
            </p>

            <div className="flex items-center gap-2 pt-1 text-secondary text-xs sm:text-body-sm font-semibold">
              <Award className="w-4 h-4 text-secondary shrink-0" />
              <span>Michelin Guide Singapore · Bib Gourmand Awarded (2016–2026)</span>
            </div>
          </div>

          {/* Connected Page Links & Hours (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Column 1: Explore Pages */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-wider">
                Explore Website
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-tertiary">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-white transition-colors">
                    125-Item Menu &amp; Spreads
                  </Link>
                </li>
                <li>
                  <Link href="/our-story" className="hover:text-white transition-colors">
                    Our Story &amp; Wok Hei Craft
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-white transition-colors">
                    Visual Archive &amp; Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/visit" className="hover:text-white transition-colors">
                    Visit Us &amp; MRT Directions
                  </Link>
                </li>
                <li>
                  <Link href="/reservations" className="hover:text-white transition-colors">
                    Table Reservations
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" className="hover:text-white transition-colors">
                    Islandwide Delivery &amp; Takeaway
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Hours */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-wider">
                Kitchen Hours
              </span>
              <div className="space-y-3 text-xs sm:text-sm text-tertiary">
                {/* 1) Keong Saik Flagship */}
                <div className="space-y-0.5">
                  <span className="block font-semibold text-on-surface text-xs">1) Keong Saik Flagship:</span>
                  <div className="text-[11px] leading-tight">
                    <strong className="text-rose-400 block font-medium">Monday: Closed</strong>
                    <span>Tue–Sun: 12:00pm–2:15pm · 5:00pm–9:15pm</span>
                  </div>
                </div>

                {/* 2) City Square Mall */}
                <div className="space-y-0.5 pt-1.5 border-t border-surface-container-high/60">
                  <span className="block font-semibold text-on-surface text-xs">2) City Square Mall:</span>
                  <div className="text-[11px] leading-tight space-y-0.5">
                    <strong className="text-emerald-400 block font-medium">Open Daily · Monday–Sunday</strong>
                    <span>Lunch: 11:30am–2:30pm</span>
                    <br />
                    <span>Dinner: 4:30pm–9:00pm</span>
                  </div>
                </div>

                <div className="text-secondary font-medium pt-0.5 text-[11px]">
                  Walk-ins welcomed at both outlets
                </div>
              </div>
            </div>

            {/* Column 3: Contact & Booking */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-wider">
                Direct WhatsApp Lines
              </span>
              <div className="space-y-2 text-xs text-tertiary">
                <div>
                  <span className="block font-semibold text-on-surface">1) Keong Saik Flagship:</span>
                  <a 
                    href="https://wa.me/6597272533" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>+65 9727 2533</span>
                  </a>
                  <span className="text-[11px] text-tertiary">4 Keong Saik Road, S089110</span>
                </div>

                <div className="pt-1 border-t border-surface-container-high/60">
                  <span className="block font-semibold text-on-surface">2) City Square Mall:</span>
                  <a 
                    href="https://wa.me/6596244244" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>+65 9624 4244</span>
                  </a>
                  <span className="text-[11px] text-tertiary">180 Kitchener Road, S208539</span>
                </div>

                <div className="pt-2">
                  <Link
                    href="/reservations"
                    className="text-secondary hover:underline font-semibold flex items-center gap-1 text-xs"
                  >
                    <span>Online Reservation Enquiry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-tertiary text-xs">
          <div>
            © 1968–2026 Kok Sen Restaurant (國成餐室). All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Keong Saik Road, Chinatown, Singapore</span>
            <span>·</span>
            <button 
              type="button" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-secondary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
