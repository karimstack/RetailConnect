'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  Store,
  ShieldAlert,
  ChevronDown,
  User,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    selectedCity,
    shopsList,
    activeRole,
    setActiveRole,
    activeShopId,
    setActiveShopId,
    cartTotalItemsCount,
    cartTotalAmount,
    setIsLocationModalOpen,
    setIsCartDrawerOpen,
  } = useApp();

  const [headerSearch, setHeaderSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const currentShop = shopsList.find((s) => s.id === activeShopId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-110 group-hover:shadow-emerald-500/30 transition-all duration-300">
                <Store className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-emerald-700 transition-colors duration-200">
                  Retail<span className="text-emerald-600">Connect</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase group-hover:text-slate-600 transition-colors duration-200">
                  Hyper-Local Retail
                </span>
              </div>
            </Link>

            {/* Location Selector Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/60 text-slate-700 transition-all duration-200 text-xs font-medium hover:shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:bounce" />
              <div className="text-left">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{selectedCity ? selectedCity.name : 'Select City'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar (Middle) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                placeholder="Search products (e.g. Milk, Atta, Coffee)..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-2xs focus:shadow-md"
              />
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 absolute left-3.5 top-2.5 transition-colors duration-200" />
            </form>
          </div>

          {/* Right Action Controls & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Global Role Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg cursor-pointer text-xs font-medium text-slate-700 border border-slate-200 transition-all duration-200 shadow-2xs hover:shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-bold">Role:</span>
                <span className="text-emerald-700 font-semibold">
                  {activeRole === 'CUSTOMER' && 'Buyer'}
                  {activeRole === 'RETAILER' && `Retailer (${currentShop?.name || 'Shop'})`}
                  {activeRole === 'ADMIN' && 'Admin'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 group-hover:rotate-180 transition-transform duration-300" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Switch App View Mode
                </div>
                
                {/* Buyer Mode */}
                <button
                  onClick={() => {
                    setActiveRole('CUSTOMER');
                    router.push('/');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-150 hover:translate-x-1 ${
                    activeRole === 'CUSTOMER'
                      ? 'bg-emerald-50 font-bold text-emerald-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buyer / Customer View</span>
                  </div>
                </button>

                {/* Retailer Mode */}
                <div className="pt-2 border-t border-slate-100 mt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Retailer Shop Dashboards
                  </div>
                  {shopsList.slice(0, 5).map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => {
                        setActiveRole('RETAILER');
                        setActiveShopId(shop.id);
                        router.push('/retailer');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate flex items-center gap-2 transition-all duration-150 hover:translate-x-1 ${
                        activeRole === 'RETAILER' && activeShopId === shop.id
                          ? 'bg-emerald-50 font-bold text-emerald-900'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{shop.name}</span>
                    </button>
                  ))}
                </div>

                {/* Admin Mode */}
                <div className="pt-2 border-t border-slate-100 mt-1">
                  <button
                    onClick={() => {
                      setActiveRole('ADMIN');
                      router.push('/admin');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-150 hover:translate-x-1 ${
                      activeRole === 'ADMIN'
                        ? 'bg-emerald-50 font-bold text-emerald-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                      <span>Platform Admin Panel</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links for Active Role */}
            {activeRole === 'RETAILER' && (
              <Link
                href="/retailer"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 hover:border-emerald-300 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}

            {activeRole === 'ADMIN' && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 hover:border-purple-300 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartTotalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {cartTotalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartTotalAmount > 0 ? `₹${cartTotalAmount}` : 'Basket'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
