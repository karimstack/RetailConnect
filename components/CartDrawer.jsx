'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Store } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotalAmount,
    cartTotalItemsCount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Your Basket</h2>
                {cart.shopName ? (
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Store className="w-3.5 h-3.5" />
                    <span>{cart.shopName}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Items from your chosen local shop</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Your basket is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Search products or browse nearby stores to compare prices and add items.
                </p>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.product.id} className="py-4 flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-slate-500">{item.product.unit}</p>
                    <div className="text-xs font-bold text-emerald-600 mt-1">
                      ₹{item.price}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">per item</span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded bg-white hover:bg-slate-200 hover:scale-110 active:scale-90 flex items-center justify-center text-slate-600 shadow-2xs transition-all duration-150"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-700 hover:scale-110 active:scale-90 flex items-center justify-center text-white shadow-2xs transition-all duration-150"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartTotalItemsCount} items)</span>
                  <span className="font-semibold text-slate-800">₹{cartTotalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Local Store Delivery</span>
                  <span className="font-semibold">FREE / ₹20</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">₹{cartTotalAmount}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
