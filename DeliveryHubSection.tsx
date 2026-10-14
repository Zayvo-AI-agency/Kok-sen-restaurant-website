import { useState, useMemo } from 'react';
import { RESTAURANT_INFO, PHOTO_ASSETS } from '../data/restaurantData';
import { 
  Bike, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Thermometer, 
  BarChart3, 
  CheckCircle2, 
  Info,
  Car,
  Footprints,
  Train
} from 'lucide-react';

interface DeliveryHubSectionProps {
  onScrollToMenu: () => void;
  onOpenOrderDrawer?: () => void;
  onOpenDeliveryModal?: () => void;
}

interface PostalZoneInfo {
  district: string;
  zone: 1 | 2 | 3;
  zoneName: string;
  distanceKm: number;
  deliveryFee: number;
  freeThreshold: number;
  eta: string;
  isPeakRush: boolean;
}

// 28 Singapore Postal Districts mapping from 2-digit prefix
const SINGAPORE_DISTRICTS: Record<number, { name: string; zone: 1 | 2 | 3; distance: number }> = {
  // Zone 1 (0-5km)
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

  // Zone 2 (5-12km)
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
  32: { name: 'Balestier / Jalan Besar', zone: 2, distance: 5.8 },
  33: { name: 'Kallang Bahru / Bendemeer', zone: 2, distance: 6.2 },
  34: { name: 'MacPherson / Circuit Rd', zone: 2, distance: 7.5 },
  35: { name: 'Potong Pasir / Sennett', zone: 2, distance: 7.9 },
  36: { name: 'Aljunied / Macpherson East', zone: 2, distance: 7.6 },
  37: { name: 'Paya Lebar / Upper Paya Lebar', zone: 2, distance: 8.2 },
  38: { name: 'Kallang / Stadium', zone: 2, distance: 6.4 },
  39: { name: 'Paya Lebar / Geylang', zone: 2, distance: 8.1 },
  40: { name: 'Eunos / Kaki Bukit', zone: 2, distance: 8.6 },
  41: { name: 'Kembangan / Lengkong', zone: 2, distance: 9.2 },
  42: { name: 'Joo Chiat / Telok Kurau', zone: 2, distance: 8.9 },
  43: { name: 'Tanjong Katong / Meyer Rd', zone: 2, distance: 7.8 },
  44: { name: 'Marine Parade / East Coast', zone: 2, distance: 8.7 },
  45: { name: 'Siglap / Frankel', zone: 2, distance: 10.4 },
  57: { name: 'Bishan / Marymount', zone: 2, distance: 9.5 },

  // Zone 3 (12-25km)
  19: { name: 'Hougang / Punggol (South)', zone: 3, distance: 13.8 },
  24: { name: 'Lim Chu Kang / Tengah', zone: 3, distance: 19.5 },
  25: { name: 'Kranji / Woodgrove', zone: 3, distance: 21.0 },
  26: { name: 'Mandai / Upper Thomson', zone: 3, distance: 15.2 },
  27: { name: 'Yishun / Sembawang', zone: 3, distance: 18.4 },
  28: { name: 'Seletar / Yio Chu Kang', zone: 3, distance: 16.7 },
  46: { name: 'Bedok / Bayshore', zone: 3, distance: 12.8 },
  47: { name: 'Bedok Reservoir / Kaki Bukit', zone: 3, distance: 13.2 },
  48: { name: 'Upper East Coast / Eastwood', zone: 3, distance: 14.1 },
  49: { name: 'Loyang / Changi South', zone: 3, distance: 16.2 },
  50: { name: 'Changi Village / Flora Rd', zone: 3, distance: 18.5 },
  51: { name: 'Pasir Ris / Loyang', zone: 3, distance: 17.6 },
  52: { name: 'Tampines Central / East', zone: 3, distance: 14.9 },
  53: { name: 'Hougang / Defu / Lorong Ah Soo', zone: 3, distance: 13.1 },
  54: { name: 'Sengkang / Buangkok', zone: 3, distance: 15.7 },
  55: { name: 'Serangoon Gardens / Kovan', zone: 3, distance: 12.4 },
  56: { name: 'Ang Mo Kio Central', zone: 3, distance: 12.3 },
  58: { name: 'Upper Bukit Timah / Hillview', zone: 3, distance: 13.5 },
  59: { name: 'Dairy Farm / Chestnut', zone: 3, distance: 14.2 },
  60: { name: 'Jurong East / West', zone: 3, distance: 14.1 },
  61: { name: 'Jurong West / Boon Lay', zone: 3, distance: 16.8 },
  62: { name: 'Jurong Port / Pioneer Sector', zone: 3, distance: 18.9 },
  63: { name: 'Tuas Industrial Ring', zone: 3, distance: 23.5 },
  64: { name: 'Boon Lay / Pioneer / Tuas', zone: 3, distance: 22.4 },
  65: { name: 'Bukit Batok / Bukit Gombak', zone: 3, distance: 13.9 },
  66: { name: 'Choa Chu Kang / Yew Tee', zone: 3, distance: 16.8 },
  67: { name: 'Teck Whye / Bukit Panjang', zone: 3, distance: 15.6 },
  68: { name: 'Choa Chu Kang Central', zone: 3, distance: 17.2 },
  69: { name: 'Tengah Garden District', zone: 3, distance: 18.1 },
  70: { name: 'Lim Chu Kang Agri-Park', zone: 3, distance: 24.0 },
  71: { name: 'Kranji Countryside', zone: 3, distance: 23.2 },
  72: { name: 'Sungei Kadut / Mandai Estate', zone: 3, distance: 20.8 },
  73: { name: 'Woodlands / Marsiling', zone: 3, distance: 22.8 },
  75: { name: 'Yishun North / Chong Pang', zone: 3, distance: 19.2 },
  76: { name: 'Yishun Ring / Khatib', zone: 3, distance: 18.1 },
  77: { name: 'Sembawang / Canberra', zone: 3, distance: 20.4 },
  78: { name: 'Springleaf / Mandai Lake', zone: 3, distance: 17.8 },
  79: { name: 'Seletar Aerospace Park', zone: 3, distance: 17.1 },
  80: { name: 'Sengkang West / Jalan Kayu', zone: 3, distance: 16.3 },
  82: { name: 'Punggol Waterway / Northshore', zone: 3, distance: 17.9 },
};

// Popular preset postal shortcuts for quick tapping
const POPULAR_POSTAL_PRESETS = [
  { label: 'Tanjong Pagar', code: '089110', dist: 'Zone 1 · 0.2km' },
  { label: 'Marina Bay', code: '018981', dist: 'Zone 1 · 2.1km' },
  { label: 'Orchard Rd', code: '238839', dist: 'Zone 1 · 2.9km' },
  { label: 'Novena', code: '307683', dist: 'Zone 2 · 6.1km' },
  { label: 'East Coast', code: '460012', dist: 'Zone 3 · 12.8km' },
  { label: 'Jurong East', code: '609607', dist: 'Zone 3 · 14.1km' },
  { label: 'Tampines', code: '529532', dist: 'Zone 3 · 14.9km' },
  { label: 'Woodlands', code: '738099', dist: 'Zone 3 · 22.8km' }
];

export function DeliveryHubSection({ onScrollToMenu, onOpenOrderDrawer, onOpenDeliveryModal }: DeliveryHubSectionProps) {
  const [postalInput, setPostalInput] = useState('089110');
  const [activeZoneTab, setActiveZoneTab] = useState<1 | 2 | 3>(1);
  const [activeMapTab, setActiveMapTab] = useState<'map' | 'zones' | 'transit'>('map');

  // Calculate delivery routing details dynamically based on postal code
  const routeCalculation = useMemo<PostalZoneInfo>(() => {
    const trimmed = postalInput.trim().replace(/\D/g, '');
    if (trimmed.length >= 2) {
      const prefix = parseInt(trimmed.slice(0, 2), 10);
      const match = SINGAPORE_DISTRICTS[prefix];

      if (match) {
        return {
          district: match.name,
          zone: match.zone,
          zoneName: match.zone === 1 ? 'Zone 1 (Core Heritage & CBD)' : match.zone === 2 ? 'Zone 2 (Central Metro Ring)' : 'Zone 3 (Greater Islandwide Reach)',
          distanceKm: match.distance,
          deliveryFee: match.zone === 1 ? 5 : match.zone === 2 ? 9 : 14,
          freeThreshold: match.zone === 1 ? 80 : match.zone === 2 ? 120 : 160,
          eta: match.zone === 1 ? '25–35 mins' : match.zone === 2 ? '35–45 mins' : '45–60 mins',
          isPeakRush: match.zone > 1
        };
      }

      // Algorithmic fallback based on Singapore sector ranges
      const isZone1 = prefix <= 10 || prefix === 16 || prefix === 17 || prefix === 23;
      const isZone2 = (prefix >= 11 && prefix <= 45) || prefix === 57;
      const calcZone: 1 | 2 | 3 = isZone1 ? 1 : isZone2 ? 2 : 3;
      const calcDist = calcZone === 1 ? 3.5 : calcZone === 2 ? 8.5 : 16.5;

      return {
        district: `Singapore Postal Sector ${prefix.toString().padStart(2, '0')}`,
        zone: calcZone,
        zoneName: calcZone === 1 ? 'Zone 1 (Core Heritage & CBD)' : calcZone === 2 ? 'Zone 2 (Central Metro Ring)' : 'Zone 3 (Greater Islandwide Reach)',
        distanceKm: calcDist,
        deliveryFee: calcZone === 1 ? 5 : calcZone === 2 ? 9 : 14,
        freeThreshold: calcZone === 1 ? 80 : calcZone === 2 ? 120 : 160,
        eta: calcZone === 1 ? '25–35 mins' : calcZone === 2 ? '35–45 mins' : '45–60 mins',
        isPeakRush: calcZone > 1
      };
    }

    // Default estimate for 4 Keong Saik Road (Chinatown)
    return {
      district: 'Keong Saik / Chinatown Core (Walking Distance)',
      zone: 1,
      zoneName: 'Zone 1 (Core Heritage & CBD)',
      distanceKm: 0.2,
      deliveryFee: 5,
      freeThreshold: 80,
      eta: '20–30 mins',
      isPeakRush: false
    };
  }, [postalInput]);

  // WhatsApp order text generation with calculated routing data
  const whatsAppDispatchUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Hello Kok Sen Restaurant!\n\n` +
      `🛵 ISLANDWIDE DELIVERY INQUIRY:\n` +
      `• Destination Postal: ${postalInput || '089110'}\n` +
      `• Area: ${routeCalculation.district}\n` +
      `• Estimated Distance: ~${routeCalculation.distanceKm} km (${routeCalculation.zoneName})\n` +
      `• Delivery Fee: S$${routeCalculation.deliveryFee.toFixed(2)} (Waiver over S$${routeCalculation.freeThreshold})\n` +
      `• ETA: ${routeCalculation.eta}\n\n` +
      `Please let me know today's available wok dispatch slots. Thank you!`
    );
    return `https://wa.me/${RESTAURANT_INFO.reservationPhoneClean}?text=${text}`;
  }, [postalInput, routeCalculation]);

  return (
    <section 
      id="delivery-hub" 
      className="mt-8 sm:mt-space-3xl w-full max-w-full overflow-hidden flex flex-col gap-4 sm:gap-6"
    >
      {/* 1. Header with Badge & Narrative */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-md border-b border-surface-container-high/60 pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
              Islandwide Logistics &amp; Thermal Wok-Hei Dispatch
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/15 text-primary border border-primary/25">
              <Bike className="w-3 h-3 shrink-0" />
              Singapore Islandwide
            </span>
          </div>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5 tracking-tight">
            Order Delivery &amp; Location Hub
          </h2>
          <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl mt-1 leading-relaxed">
            Fired to order at <strong className="text-secondary font-semibold">4 Keong Saik Road (089110)</strong> and dispatched across Singapore in double-sealed thermal packs that seal in piping-hot charcoal wok hei.
          </p>
        </div>

        {/* Live Dispatch Throughput Metric */}
        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-surface-container border border-surface-container-high/70 self-start md:self-end shrink-0 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-on-surface">Live Wok Dispatch</span>
            </div>
            <p className="text-[11px] text-tertiary mt-0.5">
              Avg. Kitchen Fire: <span className="text-secondary font-semibold">14 mins</span> · 7 slots left
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
        {/* Left Column: Interactive Google Maps Embed & Location Context (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Map View Toggle Bar */}
          <div className="flex items-center justify-between bg-surface-container rounded-xl p-1 border border-surface-container-high/60 gap-1 overflow-x-auto no-scrollbar max-w-full">
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveMapTab('map')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMapTab === 'map'
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-tertiary hover:text-on-surface'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Google Maps View</span>
                <span className="sm:hidden">Map</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMapTab('zones')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMapTab === 'zones'
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-tertiary hover:text-on-surface'
                }`}
              >
                <Bike className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Coverage Zones</span>
                <span className="sm:hidden">Zones</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMapTab('transit')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMapTab === 'transit'
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-tertiary hover:text-on-surface'
                }`}
              >
                <Train className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Transit &amp; MRT</span>
                <span className="sm:hidden">Transit</span>
              </button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onOpenDeliveryModal && (
                <button
                  type="button"
                  onClick={onOpenDeliveryModal}
                  className="text-[11px] text-tertiary hover:text-on-surface flex items-center gap-1 font-semibold px-2 py-1 rounded hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Open Delivery Calculator Modal"
                >
                  <span className="hidden md:inline">Quick Modal</span>
                </button>
              )}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kok+Sen+Restaurant+4+Keong+Saik+Road+Singapore+089110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-secondary hover:text-secondary-fixed flex items-center gap-1 font-semibold px-2 py-1 rounded hover:underline shrink-0"
                title="Open full interactive map in Google Maps"
              >
                <span className="hidden sm:inline">Full Screen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Interactive Map Container */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-surface-container-high/80 bg-surface-container-lowest shadow-xl">
            {activeMapTab === 'map' && (
              <iframe
                title="Kok Sen Restaurant 4 Keong Saik Road on Google Maps"
                src="https://maps.google.com/maps?q=Kok+Sen+Restaurant,+4+Keong+Saik+Rd,+Singapore+089110&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter brightness-90 contrast-105"
                loading="lazy"
                allowFullScreen
              />
            )}

            {activeMapTab === 'zones' && (
              <div className="w-full h-full bg-[#171513] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                {/* SVG Visual Radar of Singapore Delivery Coverage */}
                <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                  <div className="w-96 h-96 rounded-full border border-primary/40 animate-ping [animation-duration:4s]" />
                  <div className="absolute w-80 h-80 rounded-full border border-secondary/30" />
                  <div className="absolute w-52 h-52 rounded-full border border-emerald-400/30" />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-secondary font-bold">
                      Kok Sen Shophouse Radar
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Singapore Islandwide Wok Radius
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold">
                    98.4% Reachable
                  </span>
                </div>

                {/* 3 Zone Cards in Radar View */}
                <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                  <div 
                    onClick={() => setActiveZoneTab(1)}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                      activeZoneTab === 1 
                        ? 'bg-primary/20 border-primary text-white shadow-md' 
                        : 'bg-surface-container border-surface-container-high/60 text-tertiary'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="font-bold text-xs text-white">Zone 1</span>
                    </div>
                    <p className="text-[11px] text-emerald-300 font-semibold mt-1">0–5 km</p>
                    <p className="text-[10px] text-tertiary mt-0.5">S$5 · 25–35m</p>
                  </div>

                  <div 
                    onClick={() => setActiveZoneTab(2)}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                      activeZoneTab === 2 
                        ? 'bg-secondary/20 border-secondary text-white shadow-md' 
                        : 'bg-surface-container border-surface-container-high/60 text-tertiary'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="font-bold text-xs text-white">Zone 2</span>
                    </div>
                    <p className="text-[11px] text-secondary font-semibold mt-1">5–12 km</p>
                    <p className="text-[10px] text-tertiary mt-0.5">S$9 · 35–45m</p>
                  </div>

                  <div 
                    onClick={() => setActiveZoneTab(3)}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                      activeZoneTab === 3 
                        ? 'bg-purple-900/40 border-purple-500 text-white shadow-md' 
                        : 'bg-surface-container border-surface-container-high/60 text-tertiary'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span className="font-bold text-xs text-white">Zone 3</span>
                    </div>
                    <p className="text-[11px] text-purple-300 font-semibold mt-1">12–25 km</p>
                    <p className="text-[10px] text-tertiary mt-0.5">S$14 · 45–60m</p>
                  </div>
                </div>

                <div className="relative z-10 pt-2 text-[11px] text-tertiary flex items-center justify-between">
                  <span>Dispatch Origin: <strong>4 Keong Saik Road (089110)</strong></span>
                  <span className="text-secondary font-medium">Insulated thermal boxes</span>
                </div>
              </div>
            )}

            {activeMapTab === 'transit' && (
              <div className="w-full h-full bg-[#181614] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <Train className="w-4 h-4 text-secondary" />
                    <span>How to Reach Kok Sen Shophouse</span>
                  </h4>
                  <p className="text-xs text-tertiary mt-0.5">
                    Located along the vibrant historic Keong Saik dining belt, easily reachable via 3 MRT lines:
                  </p>

                  <div className="mt-3 space-y-2">
                    {RESTAURANT_INFO.mrtStations.map((mrt, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-container border border-surface-container-high/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-on-surface">{mrt.name}</span>
                        </div>
                        <span className="text-secondary font-mono text-[11px] font-semibold">{mrt.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-container-high/50 flex items-center justify-between text-[11px] text-tertiary">
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-secondary" />
                    <span>Parking: Pinnacle@Duxton &amp; Keong Saik coupon lots</span>
                  </span>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Kok+Sen+Restaurant+4+Keong+Saik+Road+Singapore+089110"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Get Directions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Floating Location Overlay Chip */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-container-high text-xs text-on-surface flex items-center gap-2 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-bold">Kok Sen Restaurant</span>
              <span className="text-tertiary">· 4 Keong Saik Rd</span>
            </div>
          </div>

          {/* Direct Google Maps Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Kok+Sen+Restaurant+4+Keong+Saik+Road+Singapore+089110"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container-high/80 text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
            >
              <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">View in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-tertiary shrink-0" />
            </a>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Kok+Sen+Restaurant+4+Keong+Saik+Road+Singapore+089110"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container-high/80 text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
            >
              <Navigation className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Get Driving / Transit ETA</span>
              <ExternalLink className="w-3 h-3 text-tertiary shrink-0" />
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Distance Calculator & Data Analysis Console (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Card: Postal Route Estimator */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-surface-container-high/80 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm sm:text-base text-on-surface">
                  Delivery Route Calculator
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-bold">
                Live Engine
              </span>
            </div>

            {/* Postal Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="delivery-postal-input" className="text-xs text-tertiary flex items-center justify-between font-medium">
                <span>Enter 6-digit Singapore Postal Code:</span>
                <span className="text-secondary text-[11px]">Instant Radius Match</span>
              </label>
              <div className="relative">
                <input
                  id="delivery-postal-input"
                  type="text"
                  maxLength={6}
                  value={postalInput}
                  onChange={(e) => setPostalInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 089110 or 238839"
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl py-2.5 pl-3.5 pr-20 text-sm font-mono font-bold text-white focus:outline-none focus:border-secondary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setPostalInput('089110')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-surface-container text-[11px] text-tertiary hover:text-white font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Popular District Shortcuts */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-tertiary font-medium">Quick Pick District:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-0.5">
                {POPULAR_POSTAL_PRESETS.map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => setPostalInput(preset.code)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      postalInput === preset.code
                        ? 'bg-secondary text-on-secondary border-secondary font-bold shadow-xs'
                        : 'bg-surface-container-lowest text-tertiary border-surface-container-high/80 hover:border-secondary hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Calculation Result Card */}
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-high flex flex-col gap-2.5 mt-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold">
                    Destination Matched
                  </span>
                  <h4 className="font-bold text-sm text-white mt-0.5 leading-snug">
                    {routeCalculation.district}
                  </h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                  routeCalculation.zone === 1 
                    ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30' 
                    : routeCalculation.zone === 2 
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30' 
                    : 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                }`}>
                  Zone {routeCalculation.zone} (~{routeCalculation.distanceKm} km)
                </span>
              </div>

              {/* 3 Metric Pills: Fee, ETA, Waiver */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-container-high/50 text-center">
                <div className="p-1.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  <span className="text-[10px] text-tertiary block font-medium">Delivery Fee</span>
                  <span className="text-sm font-bold text-primary font-price-tag">
                    S${routeCalculation.deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  <span className="text-[10px] text-tertiary block font-medium">Transit ETA</span>
                  <span className="text-xs font-bold text-secondary font-mono">
                    {routeCalculation.eta}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  <span className="text-[10px] text-tertiary block font-medium">Free Over</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    S${routeCalculation.freeThreshold}
                  </span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Dispatch & Menu Browsing */}
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={whatsAppDispatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp Fast Order</span>
                </a>

                <button
                  type="button"
                  onClick={onScrollToMenu}
                  className="py-2.5 px-3 rounded-xl bg-primary hover:bg-[#8C2214] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <span>Pick Dishes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card: Live Logistics Data Analysis Console */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-surface-container-high/80 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm sm:text-base text-on-surface">
                  Delivery Data &amp; Thermal Analytics
                </h3>
              </div>
              <span className="text-[10px] text-tertiary font-semibold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-primary" />
                <span>68°C+ Lock</span>
              </span>
            </div>

            {/* Metric 1: Thermal Wok-Hei Retention Curve */}
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-primary" />
                  <span>Wok-Hei Core Heat Retention</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">82°C at 25 mins</span>
              </div>
              {/* Visual heat gauge bar */}
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                <div className="w-[45%] h-full bg-primary" title="Zone 1: 82-90°C" />
                <div className="w-[35%] h-full bg-secondary" title="Zone 2: 74-82°C" />
                <div className="w-[20%] h-full bg-amber-600" title="Zone 3: 68-74°C" />
              </div>
              <div className="flex justify-between text-[10px] text-tertiary font-mono pt-0.5">
                <span>Wok Out: 100°C</span>
                <span>Z1: 82°C</span>
                <span>Z2: 74°C</span>
                <span>Z3: 68°C+</span>
              </div>
            </div>

            {/* Metric 2: Top Delivery Dishes Volume Breakdown */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
                Top Delivery Volume by Dish:
              </span>
              <div className="space-y-1.5">
                {[
                  { name: 'Big Prawn Hor Fun (大虾河粉)', share: 38, tag: 'H1' },
                  { name: 'Claypot Yong Tau Foo (砂煲酿豆腐)', share: 26, tag: 'C1' },
                  { name: 'Har Cheong Gai Chicken (虾酱鸡)', share: 19, tag: 'C4' },
                  { name: 'Bittergourd Pork Ribs (苦瓜排骨)', share: 11, tag: 'P2' }
                ].map((item) => (
                  <div key={item.name} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-on-surface font-medium truncate">{item.name}</span>
                      <span className="font-mono text-secondary font-bold">{item.share}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${item.share * 2.2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee note */}
            <div className="pt-2 border-t border-surface-container-high/60 flex items-center gap-2 text-[11px] text-tertiary">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Double-sealed food grade containers with leakproof soup lids guarantee zero spillage.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
