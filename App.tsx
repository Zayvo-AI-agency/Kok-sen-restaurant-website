import React, { useState, useEffect } from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AppProvider, useApp } from './context/AppContext';

// Shared Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StickyBottomBar } from './components/StickyBottomBar';
import { FloatingConciergeLauncher } from './components/FloatingConciergeLauncher';

// Modals & Drawers
import { DishDetailModal } from './components/DishDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { TableOrderDrawer } from './components/TableOrderDrawer';
import { DiningConciergeModal } from './components/DiningConciergeModal';
import { TableScanModal } from './components/TableScanModal';
import { DeliveryZoneModal } from './components/DeliveryZoneModal';

// Connected Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { StoryPage } from './pages/StoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { VisitPage } from './pages/VisitPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { ArrowUp, CheckCircle } from 'lucide-react';

function AppContent() {
  const { currentPath, navigate } = useNavigation();
  const {
    orderItems,
    totalItemCount,
    handleAddToOrder,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearOrder,
    selectedDish,
    setSelectedDish,
    reservationOpen,
    setReservationOpen,
    orderDrawerOpen,
    setOrderDrawerOpen,
    conciergeOpen,
    setConciergeOpen,
    conciergeInitialPrompt,
    setConciergeInitialPrompt,
    handleOpenConcierge,
    scanTableOpen,
    setScanTableOpen,
    currentTable,
    setCurrentTable,
    deliveryOpen,
    setDeliveryOpen,
    toastMessage,
    showToast,
  } = useApp();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Multipage route matching
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/menu':
        return <MenuPage />;
      case '/our-story':
        return <StoryPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/visit':
        return <VisitPage />;
      case '/reservations':
        return <ReservationsPage />;
      case '/delivery':
        return <DeliveryPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-on-surface font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col justify-between">
      <div>
        {/* Global Multipage Sticky Header */}
        <Header
          onOpenReservation={() => setReservationOpen(true)}
          onOpenOrderDrawer={() => setOrderDrawerOpen(true)}
          onOpenConcierge={() => handleOpenConcierge()}
          orderCount={totalItemCount}
        />

        {/* Main Page Layout Container */}
        <main className="w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-3 sm:pt-6 pb-16 min-w-0">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Multipage Footer */}
      <Footer onOpenReservation={() => setReservationOpen(true)} />

      {/* Mobile Sticky Bottom Action Bar */}
      <StickyBottomBar
        onOpenReservation={() => setReservationOpen(true)}
        onOpenOrderDrawer={() => setOrderDrawerOpen(true)}
        onOpenConcierge={() => handleOpenConcierge()}
        orderCount={totalItemCount}
      />

      {/* Floating AI Concierge Launcher */}
      <FloatingConciergeLauncher onOpen={() => handleOpenConcierge()} />

      {/* Global Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToOrder={handleAddToOrder}
      />

      {/* Global Quick Reservation Modal */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
      />

      {/* Global Table Order & Bill Slide-Over Drawer */}
      <TableOrderDrawer
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearOrder={handleClearOrder}
      />

      {/* Global AI Dining Concierge Drawer / Modal */}
      <DiningConciergeModal
        isOpen={conciergeOpen}
        onClose={() => {
          setConciergeOpen(false);
          setConciergeInitialPrompt(undefined);
        }}
        onAddToOrder={handleAddToOrder}
        onOpenReservation={() => setReservationOpen(true)}
        initialPrompt={conciergeInitialPrompt}
      />

      {/* Global Table QR Scanner & Dine-in Selector */}
      <TableScanModal
        isOpen={scanTableOpen}
        onClose={() => setScanTableOpen(false)}
        onSelectTable={(tableNum) => {
          setCurrentTable(tableNum);
          showToast(`Connected to Table ${tableNum}!`);
        }}
        currentTable={currentTable}
      />

      {/* Global Islandwide Delivery & Distance Zones Modal */}
      <DeliveryZoneModal
        isOpen={deliveryOpen}
        onClose={() => setDeliveryOpen(false)}
        onOrderMenu={() => navigate('/menu')}
      />

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 sm:bottom-24 lg:bottom-10 right-3.5 sm:right-6 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high/90 hover:bg-primary text-secondary hover:text-white border border-surface-container-highest shadow-xl backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 animate-in fade-in"
          aria-label="Scroll back to top"
          title="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-surface-container-highest text-on-surface shadow-2xl border border-secondary/40 text-xs sm:text-body-sm font-semibold flex items-center gap-2 max-w-[92vw] truncate animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </NavigationProvider>
  );
}
