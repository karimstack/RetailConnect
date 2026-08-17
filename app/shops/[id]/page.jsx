'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Clock,
  Phone,
  Star,
  ShieldCheck,
  Search,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { formatDistance } from '@/lib/distance';
import ShopMap from '@/components/ShopMap';
import Link from 'next/link';

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.id;

  const { userCoords, addToCart } = useApp();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    async function fetchShopDetails() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/shops/${shopId}?lat=${userCoords.lat}&lng=${userCoords.lng}`
        );
        const data = await res.json();
        setShop(data);
      } catch (err) {
        console.error('Failed to load shop details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShopDetails();
  }, [shopId, userCoords]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading store details and inventory...</p>
      </div>
    );
  }

  if (!shop || shop.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Store Not Found</h2>
        <p className="text-xs text-slate-500">The requested store profile does not exist.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
          Return Home
        </Link>
      </div>
    );
  }

  // Extract unique categories from this shop's inventory
  const categoriesSet = new Map();
  shop.inventories?.forEach((inv) => {
    if (inv.product?.category) {
      categoriesSet.set(inv.product.category.slug, inv.product.category.name);
    }
  });

  // Filter inventory items
  const filteredInventories = shop.inventories?.filter((inv) => {
    const matchesCategory =
      !activeCategory || inv.product?.category?.slug === activeCategory;
    const matchesQuery =
      !searchQuery ||
      inv.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.product?.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Nearby Stores</span>
      </Link>

      {/* Store Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        {/* Left Store Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-48 sm:h-56 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
            {shop.verified && (
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                Verified Retailer
              </span>
            )}
            <span className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {formatDistance(shop.distanceKm || 1.2)}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{shop.name}</h1>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{shop.rating}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{shop.address}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Store Hours</span>
                <span>{shop.openingHours}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Phone className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Contact</span>
                <span>{shop.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Map Widget */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Store Location Map
          </h3>
          <div className="flex-1 min-h-[220px] rounded-2xl overflow-hidden border border-slate-200">
            <ShopMap
              lat={shop.lat}
              lng={shop.lng}
              shopName={shop.name}
              address={shop.address}
            />
          </div>
        </div>
      </div>

      {/* Catalog Search & Category Filter */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              In-Store Live Inventory
            </h2>
            <p className="text-xs text-slate-500">
              Prices set directly by {shop.name}
            </p>
          </div>

          {/* Search bar inside store */}
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder={`Search items in ${shop.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl text-xs text-slate-800 focus:outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
              activeCategory === ''
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Products ({shop.inventories?.length || 0})
          </button>

          {Array.from(categoriesSet.entries()).map(([slug, name]) => (
            <button
              key={slug}
              onClick={() => setActiveCategory(slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                activeCategory === slug
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredInventories?.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No items match your filter</p>
          <p className="text-xs text-slate-400">Try clearing your search query or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredInventories?.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-4 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-3 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl border border-slate-100">
                <img
                  src={inv.product.image}
                  alt={inv.product.name}
                  className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {inv.product.brand}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 text-xs line-clamp-1 transition-colors duration-200">
                  {inv.product.name}
                </h3>
                <p className="text-[11px] text-slate-500">{inv.product.unit}</p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Store Price</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      ₹{inv.price}
                    </span>
                  </div>

                  <div>
                    {inv.isAvailable && inv.stockQuantity > 0 ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        In Stock ({inv.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                disabled={!inv.isAvailable || inv.stockQuantity <= 0}
                onClick={() => addToCart({ id: shop.id, name: shop.name }, inv.product, inv.price)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  inv.isAvailable && inv.stockQuantity > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
