'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MapPin,
  Store,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  SlidersHorizontal,
  Map,
  ArrowUpDown,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDistance } from '@/lib/distance';
import ShopMap from '@/components/ShopMap';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const { selectedCity, userCoords, addToCart } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('price'); // 'price' | 'distance'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map popup state
  const [selectedMapShop, setSelectedMapShop] = useState(null);

  useEffect(() => {
    async function fetchSearchData() {
      if (!selectedCity) return;
      setLoading(true);
      try {
        // Fetch categories list
        const catRes = await fetch('/api/products');
        const catData = await catRes.json();
        setCategories(catData.categories || []);

        // Fetch search results
        const url = `/api/search?q=${encodeURIComponent(query)}&cityId=${
          selectedCity.id
        }&category=${encodeURIComponent(activeCategory)}&lat=${userCoords.lat}&lng=${
          userCoords.lng
        }`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchData();
  }, [query, activeCategory, selectedCity, userCoords]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Search className="w-6 h-6 text-emerald-600" />
              Store Price Comparison in {selectedCity?.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Comparing prices and stock across brick-and-mortar retailers near you
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search products or brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-2xl text-xs text-slate-800 focus:outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Categories Bar & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                activeCategory === ''
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                  activeCategory === cat.slug
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort By Toggle */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort shops by:</span>
            <button
              onClick={() => setSortBy('price')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-150 ${
                sortBy === 'price'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Lowest Price
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-150 ${
                sortBy === 'distance'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Nearest Store
            </button>
          </div>
        </div>
      </div>

      {/* Map Drawer Modal if store map clicked */}
      {selectedMapShop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedMapShop.shopName}</h3>
                <p className="text-xs text-slate-500">{selectedMapShop.shopAddress}</p>
              </div>
              <button
                onClick={() => setSelectedMapShop(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Close Map
              </button>
            </div>
            <div className="h-64 rounded-2xl overflow-hidden">
              <ShopMap
                lat={selectedMapShop.shopLat}
                lng={selectedMapShop.shopLng}
                shopName={selectedMapShop.shopName}
                address={selectedMapShop.shopAddress}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Searching local retail inventories...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No products found matching query</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for common terms like "Milk", "Atta", "Soft Drink", "Soap", or select a different category.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
            // Sort shops for this product based on user's preference
            const sortedShops = [...product.shops].sort((a, b) => {
              if (sortBy === 'price') return a.price - b.price;
              return a.distanceKm - b.distanceKm;
            });

            const lowestPrice = product.minPrice;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Product Header Row */}
                <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-slate-200 flex-shrink-0 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                          {product.brand}
                        </span>
                        <span className="text-xs text-slate-500">{product.unit}</span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 mt-0.5">{product.name}</h2>
                      <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                    </div>
                  </div>

                  {/* Summary badge */}
                  <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-3 text-right shrink-0 hover:border-emerald-300 transition-colors duration-200">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Price Range Nearby
                    </div>
                    <div className="text-base font-black text-emerald-700">
                      ₹{product.minPrice} - ₹{product.maxPrice}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      Across {product.availableShopCount} local shops
                    </div>
                  </div>
                </div>

                {/* Multi-Store Comparison Matrix */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Nearby Local Stores Carrying This Item:
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {sortedShops.map((shop) => {
                      const isCheapest = shop.price === lowestPrice;

                      return (
                        <div
                          key={shop.shopId}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md hover:translate-x-1 ${
                            isCheapest
                              ? 'border-emerald-500/60 bg-emerald-50/30 hover:bg-emerald-50/60'
                              : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/50'
                          }`}
                        >
                          {/* Store Details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors duration-200">
                                {shop.shopName}
                              </span>
                              
                              {/* Cheapest Tag */}
                              {isCheapest && (
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                                  <Sparkles className="w-3 h-3" />
                                  BEST PRICE NEARBY
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                {formatDistance(shop.distanceKm)}
                              </span>
                              <span>•</span>
                              <span className="line-clamp-1">{shop.shopAddress}</span>
                              <button
                                onClick={() => setSelectedMapShop(shop)}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1 transition-all duration-150 hover:scale-105"
                              >
                                <Map className="w-3 h-3" />
                                View Map
                              </button>
                            </div>
                          </div>

                          {/* Price, Stock & Add to Cart */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {/* Stock Indicator */}
                            <div className="text-left sm:text-right">
                              <div className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors duration-200">
                                ₹{shop.price}
                              </div>
                              {shop.isAvailable ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  In Stock ({shop.stockQuantity} left)
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Out of Stock
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              disabled={!shop.isAvailable}
                              onClick={() =>
                                addToCart(
                                  { id: shop.shopId, name: shop.shopName },
                                  product,
                                  shop.price
                                )
                              }
                              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                                shop.isAvailable
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add from Store</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading search view...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
