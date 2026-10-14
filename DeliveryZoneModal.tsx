import { useState, useMemo } from 'react';
import { Bike, MapPin, X, CheckCircle, Clock, ShieldCheck, ArrowRight, ExternalLink, Navigation, Thermometer, Flame, BarChart3 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface DeliveryZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderMenu: () => void;
}

const SINGAPORE_DISTRICTS: Record<number, { name: string; zone: 1 | 2 | 3; distance: number }> = {
  1: { name: 'Raffles Place / Marina Bay', zone: 1, distance: 2.1 },
  2: { name: 'Anson / Tanjong Pagar', zone: 1, distance: 1.2 },
  3: { name: 'Queenstown / Tiong Bahru (East)', zone: 1, distance: 2.5 },
  4: { name: 'Telok Blangah / Harbourfront', zone: 1, distance: 3.8 },
  5: { name: 'Pasir Panjang / Clementi (South)', zone: 1, distance: 4.9 },
  6: { name: 'City Hall / Clarke Quay', zone: 1, distance: 1.8 },
  7: { name: 'Bugis / Beach Road', zone: 1, distance: 3.1 },
  8: { name: 'Chinatown / Keong Saik (Core)', zone: 1, distance: 0.2 },
  9: { name: 'Orchard / Somerset', zone: 1, distance: 2.9 },
  10: { name: 'Tanglin / Holland / Bukit Timah (South)', zone: 1, distance: 4.6 },
  16: { name: 'Tiong Bahru / Redhill', zone: 1, distance: 2.3 },
  17: { name: 'Clarke Quay / Riverside', zone: 1, distance: 1.9 },
  23: { name: 'River Valley / Cairnhill', zone: 1, distance: 2.7 },
  11: { name: 'Newton / Novena', zone: 2, distance: 5.6 },
  12: { name: 'Balestier / Toa Payoh', zone: 2, distance: 7.2 },
  13: { name: 'Macpherson / Braddell', zone: 2, distance: 8.4 },
  14: { name: 'Geylang / Eunos', zone: 2, distance: 7.9 },
  15: { name: 'Katong / Joo Chiat / Marine Parade', zone: 2, distance: 8.8 },
  18: { name: 'Tampines (West)', zone: 2, distance: 11.5 },
  20: { name: 'Ang Mo Kio (South) / Bishan', zone: 2, distance: 9.3 },
  21: { name: 'Upper Bukit Timah / Clementi', zone: 2, distance: 10.2 },
  22: { name: 'Jurong East (Gateway)', zone: 2, distance: 11.8 },
  30: { name: 'Novena / Thomson (South)', zone: 2, distance: 6.1 },
  31: { name: 'Toa Payoh Central', zone: 2, distance: 7.8 },
  38: { name: 'Kallang / Stadium', zone: 2, distance: 6.4 },
  39: { name: 'Paya Lebar / Geylang', zone: 2, distance: 8.1 },
  57: { name: 'Bishan / Marymount', zone: 2, distance: 9.5 },
  19: { name: 'Hougang / Punggol (South)', zone: 3, distance: 13.8 },
  24: { name: 'Lim Chu Kang / Tengah', zone: 3, distance: 19.5 },
  25: { name: 'Kranji / Woodgrove', zone: 3, distance: 21.0 },
  26: { name: 'Mandai / Upper Thomson', zone: 3, distance: 15.2 },
  27: { name: 'Yishun / Sembawang', zone: 3, distance: 18.4 },
  28: { name: 'Seletar / Yio Chu Kang', zone: 3, distance: 16.7 },
  46: { name: 'Bedok / Siglap', zone: 3, distance: 12.8 },
  51: { name: 'Pasir Ris / Loyang', zone: 3, distance: 17.6 },
  52: { name: 'Tampines Central / East', zone: 3, distance: 14.9 },
  56: { name: 'Ang Mo Kio Central', zone: 3, distance: 12.3 },
  60: { name: 'Jurong East / West', zone: 3, distance: 14.1 },
  64: { name: 'Boon Lay / Pioneer / Tuas', zone: 3, distance: 22.4 },
  73: { name: 'Woodlands / Marsiling', zone: 3, distance: 22.8 },
  82: { name: 'Punggol Waterway / Northshore', zone: 3, distance: 17.9 },
};

const POPULAR_PRESETS = [
  { label: 'Tanjong Pagar', code: '089110' },
  { label: 'Marina Bay', code: '018981' },
  { label: 'Orchard', code: '238839' },
  { label: 'Novena', code: '307683' },
  { label: 'East Coast', code: '460012' },
  { label: 'Jurong', code: '609607' }
];

export function DeliveryZoneModal({ isOpen, onClose, onOrderMenu }: DeliveryZoneModalProps) {
  const [postalCode, setPostalCode] = useState('089110');
  const [showMapEmbed, setShowMapEmbed] = useState(false);

  const calculatedInfo = useMemo(() => {
    const trimmed = postalCode.trim().replace(/\D/g, '');
    if (trimmed.length >= 2) {
      const prefix = parseInt(trimmed.slice(0, 2), 10);
      const match = SINGAPORE_DISTRICTS[prefix];
      if (match) {
        return {
          district: match.name,
          zone: match.zone,
          distance: match.distance,
          fee: match.zone === 1 ? 'S$5.00' : match.zone === 2 ? 'S$9.00' : 'S$14.00',
          freeThreshold: match.zone === 1 ? 80 : match.zone === 2 ? 120 : 160,
          eta: match.zone === 1 ? '25–35 mins' : match.zone === 2 ? '35–45 mins' : '45–60 mins'
        };
      }

      // Algorithmic fallback based on Singapore sector ranges
      const isZone1 = prefix <= 10 || prefix === 16 || prefix === 17 || prefix === 23;
      const isZone2 = (prefix >= 11 && prefix <= 45) || prefix === 57;
      const calcZone: 1 | 2 | 3 = isZone1 ? 1 : isZone2 ? 2 : 3;
      const calcDist = calcZone === 1 ? 3.5 : calcZone === 2 ? 8.5 : 16.5;

      return {
        district: `Singapore Sector ${prefix.toString().padStart(2, '0')}`,
        zone: calcZone,
        distance: calcDist,
        fee: calcZone === 1 ? 'S$5.00' : calcZone === 2 ? 'S$9.00' : 'S$14.00',
        freeThreshold: calcZone === 1 ? 80 : calcZone === 2 ? 120 : 160,
        eta: calcZone === 1 ? '25–35 mins' : calcZone === 2 ? '35–45 mins' : '45–60 mins'
      };
    }
    return {
      district: 'Keong Saik / Chinatown Core',
      zone: 1,
      distance: 0.2,
      fee: 'S$5.00',
      freeThreshold: 80,
      eta: '20–30 mins'
    };
  }, [postalCode]);

  if (!isOpen) return null;

  const getWhatsAppDeliveryLink = () => {
    const text = encodeURIComponent(
      `Hello Kok Sen Restaurant!\n\n` +
      `🛵 ISLANDWIDE DELIVERY REQUEST:\n` +
      `• Destination: ${calculatedInfo.district} (Postal: ${postalCode})\n` +
      `• Distance: ~${calculatedInfo.distance} km (Zone ${calculatedInfo.zone})\n` +
      `• Delivery Fee: ${calculatedInfo.fee} (Free over S$${calculatedInfo.freeThreshold})\n` +
      `• Estimated Time: ${calculatedInfo.eta}\n` +
      `Please let me know today's available wok dispatch slots. Thank you!`
    );
    return `https://wa.me/${RESTAURANT_INFO.reservationPhoneClean}?text=${text}`;
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-surface-container text-on-surface rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-surface-container-high p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/15 px-2 py-0.5 rounded-full border border-primary/25">
                  Islandwide Delivery
                </span>
                <span className="text-secondary text-xs font-semibold hidden sm:inline">
                  Google Maps &amp; Logistics Hub
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white mt-0.5">Wok-Hei to Your Doorstep</h3>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-surface-container-highest text-tertiary hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Origin Notice & Google Maps Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">Origin: <strong className="text-white">4 Keong Saik Road (089110)</strong></span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowMapEmbed(!showMapEmbed)}
              className="text-secondary hover:text-secondary-fixed font-bold text-xs flex items-center gap-1 cursor-pointer underline"
            >
              <span>{showMapEmbed ? 'Hide Map' : 'Show Google Map'}</span>
            </button>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Kok+Sen+Restaurant+4+Keong+Saik+Road+Singapore+089110"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary hover:text-white"
              title="Open in Google Maps"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Optional Embedded Google Map Preview */}
        {showMapEmbed && (
          <div className="w-full aspect-video rounded-xl overflow-hidden border border-surface-container-high/80 bg-black animate-in fade-in duration-200">
            <iframe
              title="Kok Sen Restaurant on Google Maps"
              src="https://maps.google.com/maps?q=Kok+Sen+Restaurant,+4+Keong+Saik+Rd,+Singapore+089110&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter brightness-90 contrast-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Postal Code Fee Calculator */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-high/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-tertiary">
              Live Postal Route &amp; Fee Calculator:
            </label>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              Instant Radius Match
            </span>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              maxLength={6}
              placeholder="e.g. 089110 or 238839"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-3.5 py-2 rounded-xl bg-surface-container border border-surface-container-high text-white font-mono text-sm focus:outline-none focus:border-secondary"
            />
            <button 
              type="button" 
              onClick={() => setPostalCode('089110')}
              className="px-3 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-0.5">
            {POPULAR_PRESETS.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setPostalCode(p.code)}
                className={`shrink-0 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  postalCode === p.code
                    ? 'bg-secondary text-on-secondary border-secondary font-bold'
                    : 'bg-surface-container text-tertiary border-surface-container-high/80 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Live Result Box */}
          <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-secondary uppercase font-bold">Destination Area</span>
                <h4 className="font-bold text-sm text-white">{calculatedInfo.district}</h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-xs font-bold shrink-0">
                Zone {calculatedInfo.zone} · ~{calculatedInfo.distance} km
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-container-high/40 text-center">
              <div className="p-1 rounded bg-surface-container-lowest">
                <span className="text-[10px] text-tertiary block font-medium">Delivery Fee</span>
                <span className="text-sm font-bold text-primary font-price-tag">{calculatedInfo.fee}</span>
              </div>
              <div className="p-1 rounded bg-surface-container-lowest">
                <span className="text-[10px] text-tertiary block font-medium">Transit ETA</span>
                <span className="text-xs font-bold text-secondary font-mono">{calculatedInfo.eta}</span>
              </div>
              <div className="p-1 rounded bg-surface-container-lowest">
                <span className="text-[10px] text-tertiary block font-medium">Free Over</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">S${calculatedInfo.freeThreshold}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Analysis Snapshot: Thermal Heat Retention & Kitchen Load */}
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/70 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-secondary" />
              <span>Logistics &amp; Thermal Data Analysis</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">82°C Core Heat Lock</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/40 flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-tertiary block">Avg Wok Prep:</span>
                <span className="font-bold text-white">14 mins to flame</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-surface-container border border-surface-container-high/40 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <span className="text-tertiary block">Insulation:</span>
                <span className="font-bold text-white">Double-wall thermal foil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOrderMenu();
            }}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-[#8C2214] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Browse Menu &amp; Add Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getWhatsAppDeliveryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md text-center"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp Fast Order</span>
          </a>
        </div>
      </div>
    </div>
  );
}
