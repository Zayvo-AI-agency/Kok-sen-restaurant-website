import React, { useState } from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { KokSenLogo } from './KokSenLogo';
import { 
  UtensilsCrossed, 
  BookOpen, 
  Camera, 
  MapPin, 
  CalendarDays, 
  ShoppingBag, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onOpenReservation: () => void;
  onOpenOrderDrawer?: () => void;
  onOpenConcierge?: () => void;
  orderCount?: number;
}

// Exactly the requested 4 primary desktop labels: Menu · Our Story · Gallery · Locations
const DESKTOP_NAV_LINKS = [
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/our-story', label: 'Our Story', icon: BookOpen },
  { href: '/gallery', label: 'Gallery', icon: Camera },
  { href: '/visit', label: 'Locations', icon: MapPin },
];

export function Header({ onOpenReservation }: HeaderProps) {
  const { currentPath, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header 
      id="main-header"
      className="sticky top-0 w-full max-w-full z-40 bg-surface/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] border-b border-surface-container-high/40"
    >
      <div className="h-16 sm:h-20 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between gap-3 sm:gap-6 relative">
        {/* Brand Identity / Home Link */}
        <Link 
          href="/"
          className="flex items-center cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
          aria-label="Kok Sen Restaurant Homepage"
        >
          <KokSenLogo variant="full" />
        </Link>

        {/* Clean, Balanced Desktop Navigation (Menu · Our Story · Gallery · Locations) */}
        <nav 
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-1.5 2xl:gap-2 font-button-text"
        >
          {DESKTOP_NAV_LINKS.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-medium ${
                  isActive 
                    ? 'bg-primary/20 text-white font-bold border border-primary/40 shadow-xs' 
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-container/80'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Two Right-Side Actions: "Order Online" & "Reserve a Table" */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Action 1: Order Online (Direct Oddle ordering page in new tab) */}
          <a
            href="https://koksen.oddle.me/en_SG"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-primary/40 text-white bg-primary/20 hover:bg-primary hover:border-primary shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="Order online via Oddle"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-primary-container" />
            <span>Order Online</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* Action 2: Reserve a Table (Warm gold button opening reservation flow) */}
          <button
            type="button"
            onClick={onOpenReservation}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary font-button-text font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_16px_rgba(252,186,96,0.25)] hover:shadow-[0_6px_20px_rgba(252,186,96,0.35)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="Reserve a Table"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Reserve a Table</span>
          </button>

          {/* Mobile / Tablet Menu Toggle Button (Visible below XL to prevent cramming) */}
          <button
            type="button"
            className="xl:hidden p-2.5 rounded-xl text-on-surface hover:bg-surface-container border border-surface-container-high/60 cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px] shrink-0 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-secondary" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Collapsed Mobile/Tablet Drawer (Clean, unclipped, accessible) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest/98 backdrop-blur-2xl border-t border-surface-container-high px-4 py-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {DESKTOP_NAV_LINKS.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left py-2.5 px-3.5 rounded-xl font-button-text text-sm flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-white font-bold border border-primary/40'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-secondary" />}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions: Order Online & Reserve a Table */}
          <div className="pt-3 border-t border-surface-container-high/60 flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://koksen.oddle.me/en_SG"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border border-primary/50 text-white bg-primary/25 hover:bg-primary flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-primary-container" />
              <span>Order Online</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-secondary hover:bg-secondary-fixed text-on-secondary font-button-text font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
