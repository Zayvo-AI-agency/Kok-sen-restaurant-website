import React, { useState } from 'react';
import { useNavigation, Link } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { OUTLETS, RESTAURANT_INFO } from '../data/restaurantData';
import { TOP_SIGNATURES } from '../data/menuData';
import { 
  Truck, 
  ShoppingBag, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Flame, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  ChevronRight,
  UtensilsCrossed,
  ExternalLink
} from 'lucide-react';

export function DeliveryPage() {
  const { navigate } = useNavigation();
  const { 
    orderItems, 
    totalItemCount, 
    totalOrderAmount, 
    handleUpdateQuantity, 
    handleRemoveItem, 
    handleClearOrder,
    handleAddToOrder,
    selectedOutlet,
    setSelectedOutlet,
    showToast
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [address, setAddress] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('ASAP (45–60 mins)');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Zone Estimator calculation
  const postalPrefix = postalCode.slice(0, 2);
  let estimatedZone = 'Zone 1 (0 – 5km)';
  let estimatedFee = '$8 – $10';
  let estimatedTime = '35 – 45 mins';

  if (postalCode.length >= 2) {
    const pNum = parseInt(postalPrefix, 10);
    if (!isNaN(pNum)) {
      if ([1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16].includes(pNum)) {
        estimatedZone = 'Zone 1 (Within 5km · Chinatown, Tanjong Pagar, Tiong Bahru)';
        estimatedFee = '$8.00';
        estimatedTime = '30 – 40 mins';
      } else if ([9, 10, 11, 12, 13, 21, 22, 23, 24, 25, 31, 32, 33, 34, 38, 39, 40].includes(pNum)) {
        estimatedZone = 'Zone 2 (5 – 12km · Orchard, Novena, Kallang, Queenstown)';
        estimatedFee = '$12.00';
        estimatedTime = '40 – 55 mins';
      } else {
        estimatedZone = 'Zone 3 (12 – 25km · Jurong, Woodlands, Tampines, Bedok)';
        estimatedFee = '$16.00 – $18.00';
        estimatedTime = '55 – 70 mins';
      }
    }
  }

  const handleCheckoutViaWhatsApp = () => {
    if (orderItems.length === 0) {
      showToast('Please add items to your order first');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim() && !postalCode.trim()) {
      showToast('Please enter your delivery address or postal code');
      return;
    }

    const lines: string[] = [
      `*Kok Sen Restaurant — ${deliveryType === 'delivery' ? 'Islandwide Delivery Order' : 'Self-Collection Takeaway'}*`,
      ``,
      `📍 *Outlet:* ${selectedOutlet.name}`,
      `⏰ *Preferred Time:* ${preferredTime}`,
    ];

    if (deliveryType === 'delivery') {
      lines.push(`🏠 *Delivery Address:* ${address.trim()}${postalCode ? ` (S${postalCode})` : ''}`);
      lines.push(`🚚 *Estimated Zone:* ${estimatedZone}`);
    } else {
      lines.push(`🛍️ *Collection Method:* Self-pickup at counter`);
    }

    lines.push(``);
    lines.push(`*Order Summary:*`);
    orderItems.forEach((oi, idx) => {
      const sizeStr = oi.size ? ` (${oi.size})` : '';
      lines.push(`${idx + 1}. ${oi.item.nameEn}${sizeStr} x${oi.quantity}`);
    });

    lines.push(``);
    lines.push(`*Total Items:* ${totalItemCount}`);
    if (deliveryType === 'delivery') {
      lines.push(`_Delivery fee (${estimatedFee}) to be confirmed by host based on exact postal code._`);
    }

    if (customerNotes.trim()) {
      lines.push(``);
      lines.push(`📝 *Customer Notes:* ${customerNotes.trim()}`);
    }

    lines.push(``);
    lines.push(`_Order sent via Kok Sen website. Please confirm kitchen order and payment instructions._`);

    const encoded = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/${selectedOutlet.phoneClean}?text=${encoded}`;

    showToast('Redirecting to WhatsApp to send order...');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-14 animate-in fade-in duration-300">
      {/* 1. Header */}
      <section className="flex flex-col gap-3 border-b border-surface-container-high/60 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
          <Truck className="w-4 h-4 text-primary" />
          <span className="uppercase tracking-widest font-label-caps">Islandwide Delivery &amp; Self-Takeaway</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
              Delivery &amp; Ordering <span className="font-normal italic text-secondary text-2xl sm:text-3xl ml-1 font-serif">外卖与自取</span>
            </h1>
            <p className="font-body-md text-xs sm:text-body-md text-tertiary max-w-2xl mt-1.5 leading-relaxed">
              Enjoy piping-hot Michelin Bib Gourmand Cantonese Zi Char at home. Every noodle gravy is packed separately to retain intense wok breath during transit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {OUTLETS.map((outlet) => {
              const isSelected = selectedOutlet.id === outlet.id;
              return (
                <button
                  key={outlet.id}
                  type="button"
                  onClick={() => setSelectedOutlet(outlet)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                      : 'bg-surface-container hover:bg-surface-container-high text-tertiary border border-surface-container-high'
                  }`}
                >
                  {outlet.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Thermal Quality & Packing Standards Banner */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/80 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/20 text-primary shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-on-surface text-sm block font-semibold">Separate Sauce Packaging</strong>
            <p className="text-xs text-tertiary mt-0.5 leading-relaxed">
              Hor fun noodles and rich prawn egg gravy are packed in split containers so noodles remain charred and springy without soaking soggy.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-secondary/20 text-secondary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-on-surface text-sm block font-semibold">Wok-Fresh Handover</strong>
            <p className="text-xs text-tertiary mt-0.5 leading-relaxed">
              Dishes leave our wok only once your driver arrives or 5 minutes prior to your collection time to minimize counter holding time.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-on-surface text-sm block font-semibold">Direct WhatsApp Confirmation</strong>
            <p className="text-xs text-tertiary mt-0.5 leading-relaxed">
              Your order is reviewed immediately by the outlet floor manager via WhatsApp, confirming exact preparation times and PayNow details.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout: Order Basket (Left) & Delivery Calculator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Current Cart / Table Order Items (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-high/80 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                <h2 className="font-headline-md text-lg font-bold text-on-surface">
                  Your Order Items ({totalItemCount})
                </h2>
              </div>

              {orderItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearOrder}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                >
                  Clear Order
                </button>
              )}
            </div>

            {orderItems.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-3">
                <ShoppingBag className="w-12 h-12 text-tertiary/40" />
                <h3 className="font-dish-title text-base font-bold text-on-surface">
                  Your order basket is currently empty
                </h3>
                <p className="text-xs text-tertiary max-w-sm">
                  Browse our complete 125-listing menu or choose from our top wok favourites below to build your delivery feast.
                </p>
                <Link
                  href="/menu"
                  className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Browse Full Menu</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-surface-container-high/60">
                {orderItems.map((item) => {
                  const unitP = item.unitPrice !== undefined ? item.unitPrice : item.item.price;
                  const itemTotal = unitP * item.quantity;
                  return (
                    <div key={`${item.item.id}-${item.size || 'std'}`} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-on-surface truncate">
                          {item.item.nameEn}
                          {item.size && <span className="text-secondary font-medium ml-1">({item.size})</span>}
                        </span>
                        <span className="text-xs text-tertiary">
                          {item.item.nameZh}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2 py-1 rounded-lg border border-surface-container-high">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-tertiary hover:text-white cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs px-1 text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-tertiary hover:text-white cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.item.id)}
                          className="text-tertiary hover:text-rose-400 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* Quick-Add Signature Suggestions */}
          <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Popular Quick-Add Dishes for Takeaway
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOP_SIGNATURES.slice(0, 4).map((sig) => (
                <div
                  key={sig.id}
                  className="p-2.5 rounded-xl bg-surface-container border border-surface-container-high flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs truncate text-on-surface">
                      {sig.nameEn}
                    </span>
                    <span className="text-[11px] text-tertiary truncate">
                      {sig.nameZh}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToOrder(sig, 1)}
                    className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-white transition-colors cursor-pointer"
                    title={`Add ${sig.nameEn}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fulfillment Details & WhatsApp Trigger (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container border border-surface-container-high/80 shadow-xl flex flex-col gap-5">
            <h2 className="font-headline-md text-lg font-bold text-on-surface border-b border-surface-container-high/60 pb-3">
              Delivery Details &amp; Handoff
            </h2>

            {/* Delivery vs Takeaway Switcher */}
            <div className="grid grid-cols-2 p-1 bg-surface-container-lowest rounded-xl border border-surface-container-high">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  deliveryType === 'delivery'
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'text-tertiary hover:text-on-surface'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Islandwide Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('takeaway')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  deliveryType === 'takeaway'
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'text-tertiary hover:text-on-surface'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Self-Collection</span>
              </button>
            </div>

            {/* Selected Outlet Info */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-xs text-tertiary space-y-1">
              <div className="flex items-center justify-between text-on-surface font-semibold">
                <span>Fulfilling Kitchen:</span>
                <span className="text-secondary">{selectedOutlet.name}</span>
              </div>
              <p>{selectedOutlet.address}</p>
              <p className="text-[11px] text-emerald-400">Mainline WhatsApp: +{selectedOutlet.phoneClean}</p>
            </div>

            {deliveryType === 'delivery' && (
              <>
                {/* Postal Code & Distance Calculator */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="del-postal" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Singapore Postal Code (6 digits)
                  </label>
                  <input
                    id="del-postal"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 089110 or 208539"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs focus:outline-none focus:border-secondary"
                  />
                  {postalCode.length >= 2 && (
                    <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-secondary/30 text-[11px] text-secondary space-y-0.5">
                      <p><strong>{estimatedZone}</strong></p>
                      <p className="text-tertiary">Estimated Delivery: {estimatedTime} · Courier Fee: ~{estimatedFee}</p>
                    </div>
                  )}
                </div>

                {/* Delivery Street Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="del-address" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Full Delivery Address (Unit / Building)
                  </label>
                  <input
                    id="del-address"
                    type="text"
                    placeholder="e.g. 12 Tanjong Pagar Road #08-02"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </>
            )}

            {/* Preferred Timing */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="del-time" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Preferred Timing
              </label>
              <select
                id="del-time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs focus:outline-none focus:border-secondary cursor-pointer"
              >
                <option value="ASAP (45–60 mins)">ASAP (Cook immediately upon WhatsApp confirmation)</option>
                <option value="Today 12:30 PM (Lunch)">Today 12:30 PM (Lunch)</option>
                <option value="Today 1:15 PM (Lunch)">Today 1:15 PM (Lunch)</option>
                <option value="Today 6:00 PM (Dinner)">Today 6:00 PM (Dinner)</option>
                <option value="Today 7:00 PM (Dinner)">Today 7:00 PM (Dinner)</option>
                <option value="Today 8:00 PM (Dinner)">Today 8:00 PM (Dinner)</option>
              </select>
            </div>

            {/* Special Notes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="del-notes" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Dietary / Packing Notes (Optional)
              </label>
              <input
                id="del-notes"
                type="text"
                placeholder="e.g. Less chili in kangkong, extra disposable cutlery..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            {/* WhatsApp Checkout Button */}
            <button
              type="button"
              onClick={handleCheckoutViaWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Order to WhatsApp Host</span>
            </button>

            <p className="text-[11px] text-tertiary text-center leading-relaxed">
              No prepayment is processed online. Our manager will reply directly on WhatsApp with your final bill, delivery driver arrangement, and PayNow QR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
