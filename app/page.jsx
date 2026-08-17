'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MapPin,
  Store,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { formatDistance } from '@/lib/distance';

export default function HomePage() {
  const router = useRouter();
  const { selectedCity, userCoords, setIsLocationModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      if (!selectedCity) return;
      setLoading(true);
      try {
        // Fetch categories & top products
        const catRes = await fetch('/api/products');
        const catData = await catRes.json();
        setCategories(catData.categories || []);

        // Fetch nearby shops for selected city
        const shopRes = await fetch(
          `/api/shops?cityId=${selectedCity.id}&lat=${userCoords.lat}&lng=${userCoords.lng}`
        );
        const shopData = await shopRes.json();
        if (Array.isArray(shopData)) {
          setNearbyShops(shopData);
        }

        // Fetch search summary for popular products
        const searchRes = await fetch(
          `/api/search?cityId=${selectedCity.id}&lat=${userCoords.lat}&lng=${userCoords.lng}`
        );
        const searchData = await searchRes.json();
        if (searchData.products) {
          setTopProducts(searchData.products.slice(0, 8));
        }
      } catch (e) {
        console.error('Error loading homepage data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, [selectedCity, userCoords]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Hyper-Local Retail Price Discovery & Store Aggregator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Compare Prices Across Nearby Stores in{' '}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-emerald-400 underline underline-offset-4 decoration-emerald-400/50 hover:text-emerald-300 transition"
            >
              {selectedCity?.name || 'Your City'}
            </button>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            Find local groceries, beverages, and daily essentials from trusted neighborhood shops. See real-time prices, physical distance, and order directly.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-100 hover:shadow-emerald-500/10 transition-shadow duration-300"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full group">
              <Search className="w-5 h-5 text-emerald-600 shrink-0 group-focus-within:scale-110 transition-transform duration-200" />
              <input
                type="text"
                placeholder="Search products like 'Amul Milk', 'Atta', 'Soft Drink'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-600/30 shrink-0"
            >
              <span>Compare Prices</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Category Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Popular:</span>
            {['Dairy', 'Atta', 'Beverages', 'Snacks', 'Coffee'].map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-200 text-xs rounded-full border border-white/10 hover:border-emerald-400 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Categories Bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="p-4 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 hover:-translate-y-1.5 hover:shadow-md rounded-2xl transition-all duration-300 text-center group shadow-2xs cursor-pointer"
              >
                <div className="w-12 h-12 bg-emerald-100/70 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:scale-110 shadow-2xs">
                  <Store className="w-6 h-6 group-hover:rotate-6 transition-transform duration-300" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 block truncate transition-colors duration-200">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Nearby Local Shops Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                Verified Retail Stores in {selectedCity?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical shops near your location with live catalog access
              </p>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:scale-105 active:scale-95 flex items-center gap-1 transition-all duration-200"
            >
              <MapPin className="w-3.5 h-3.5" />
              Change City
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nearbyShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{formatDistance(shop.distanceKm || 1.2)}</span>
                  </div>

                  {shop.verified && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm group-hover:scale-105 transition-transform duration-200">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors duration-200">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{shop.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{shop.address}</p>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shop.openingHours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shop.phone}</span>
                    </div>
                  </div>

                  <Link
                    href={`/shops/${shop.id}`}
                    className="w-full mt-2 py-2 px-3 bg-slate-100 group-hover:bg-emerald-600 text-slate-800 group-hover:text-white font-bold rounded-xl text-xs text-center transition-all duration-200 flex items-center justify-center gap-1 group-hover:shadow-md"
                  >
                    <span>View Shop Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Price Comparison Spotlight */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Live Price Discovery in {selectedCity?.name}
              </h2>
              <p className="text-xs text-slate-500">
                Products available across local stores with instant price comparison
              </p>
            </div>
            <Link
              href="/search"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:scale-105 active:scale-95 flex items-center gap-1 transition-all duration-200"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-4 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-3 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {prod.brand}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 text-xs line-clamp-1 transition-colors duration-200">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{prod.unit}</p>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Starting from</span>
                      <span className="text-sm font-extrabold text-emerald-600">
                        ₹{prod.minPrice || '--'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        {prod.availableShopCount} local stores
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/search?q=${encodeURIComponent(prod.name)}`}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold rounded-xl text-xs text-center transition-all duration-200 flex items-center justify-center gap-1 hover:shadow-sm"
                >
                  <span>Compare Store Prices</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
