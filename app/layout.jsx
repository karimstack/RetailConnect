import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import LocationModal from '@/components/LocationModal';
import CartDrawer from '@/components/CartDrawer';

export const metadata = {
  title: 'RetailConnect - Hyper-Local Retail Marketplace & Price Comparison',
  description:
    'Discover nearby brick-and-mortar stores, compare prices across local shops, and order directly from local retailers in your city.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            
            {/* Global Footer */}
            <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
              <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
                <p className="text-slate-300 font-semibold">
                  RetailConnect Hyper-Local Retail Aggregator & Price Discovery Platform
                </p>
                <p className="text-slate-500">
                  Empowering local brick-and-mortar shopkeepers while providing instant price transparency and direct delivery for local consumers.
                </p>
              </div>
            </footer>

            {/* Global Modals & Drawers */}
            <LocationModal />
            <CartDrawer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
