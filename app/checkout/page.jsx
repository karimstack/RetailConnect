'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  Store,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    selectedCity,
    clearCart,
    cartTotalAmount,
    cartTotalItemsCount,
    setActiveRole,
    setActiveShopId,
  } = useApp();

  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Sunshine Heights, Hill Road, Bandra West');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (cart.items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Basket is Empty</h2>
        <p className="text-xs text-slate-500">Please add products from a local store to proceed with checkout.</p>
        <Link href="/" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm">
          Browse Nearby Stores
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Please fill out all delivery contact details.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        deliveryAddress,
        cityId: selectedCity?.id,
        shopId: cart.shopId,
        paymentMethod,
        items: cart.items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          pricePerUnit: i.price,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await res.json();
      setPlacedOrder(orderData);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed & Sent to Retailer
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Order #{placedOrder.orderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your order has been directly transmitted to <strong className="text-slate-800">{placedOrder.shop?.name}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Store Name:</span>
              <span className="font-bold text-slate-800">{placedOrder.shop?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-semibold text-slate-700">{placedOrder.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-semibold text-emerald-700">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
              <span>Total Amount:</span>
              <span className="text-emerald-600">₹{placedOrder.totalAmount}</span>
            </div>
          </div>

          {/* Test Action to simulate Retailer View */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Simulate Retailer Store Operations:</span>
            </div>
            <p className="text-xs text-emerald-700">
              Switch to <strong>{placedOrder.shop?.name}</strong> dashboard to accept, package, or mark this order delivered!
            </p>
            <button
              onClick={() => {
                setActiveRole('RETAILER');
                setActiveShopId(placedOrder.shopId);
                router.push('/retailer');
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Go to Retailer Dashboard to Process Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <Link href="/" className="inline-block text-xs font-bold text-slate-500 hover:text-slate-700">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            Direct Retailer Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ordering directly from local shop: <strong className="text-slate-800">{cart.shopName}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contact & Address */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Retailer Info Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Fulfilling Store
                </span>
                <h3 className="font-black text-slate-900 text-base">{cart.shopName}</h3>
                <p className="text-xs text-emerald-700">Direct fulfillment from local shop inventory</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] bg-white text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                100% Authentic Store Items
              </span>
            </div>
          </div>

          {/* Delivery Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. Customer Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complete Delivery Address
              </label>
              <textarea
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              2. Select Payment Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, sub: 'Pay cash to delivery boy' },
                { id: 'UPI Payment', label: 'Instant UPI', icon: ShieldCheck, sub: 'GPay / PhonePe / Paytm' },
                { id: 'Card Payment', label: 'Debit / Credit Card', icon: CreditCard, sub: 'Visa, Mastercard, RuPay' },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div className="text-xs font-bold">{pm.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{pm.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Order Summary ({cartTotalItemsCount} items)
            </h3>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                    />
                    <div>
                      <div className="font-bold text-slate-800 truncate max-w-[120px]">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{cartTotalAmount}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Store Delivery Fee</span>
                <span>FREE</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>Total Payable</span>
                <span className="text-emerald-600">₹{cartTotalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <span>Transmitting Order to Store...</span>
              ) : (
                <>
                  <span>Place Direct Store Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
