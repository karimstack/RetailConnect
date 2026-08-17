'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Store,
  Package,
  Boxes,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Search,
  Save,
  Plus,
  Minus,
  MapPin,
  Phone,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function RetailerDashboard() {
  const { shopsList, activeShopId, setActiveShopId } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'profile'
  const [shopDetails, setShopDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Inputs
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [inventorySearch, setInventorySearch] = useState('');

  // Editable Profile state
  const [profileForm, setProfileForm] = useState({
    name: '',
    address: '',
    phone: '',
    openingHours: '',
  });

  const currentShop = shopsList.find((s) => s.id === activeShopId) || shopsList[0];

  useEffect(() => {
    if (!currentShop) return;
    loadDashboardData(currentShop.id);
  }, [currentShop?.id]);

  async function loadDashboardData(shopId) {
    setLoading(true);
    try {
      // 1. Fetch shop profile & catalog
      const shopRes = await fetch(`/api/shops/${shopId}`);
      const sData = await shopRes.json();
      setShopDetails(sData);
      setProfileForm({
        name: sData.name || '',
        address: sData.address || '',
        phone: sData.phone || '',
        openingHours: sData.openingHours || '',
      });

      // 2. Fetch orders for this shop
      const ordersRes = await fetch(`/api/orders?shopId=${shopId}`);
      const oData = await ordersRes.json();
      setOrders(Array.isArray(oData) ? oData : []);

      // 3. Fetch inventory items
      const invRes = await fetch(`/api/shops/${shopId}/inventory`);
      const iData = await invRes.json();
      setInventories(Array.isArray(iData) ? iData : []);
    } catch (err) {
      console.error('Error loading retailer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Update Inventory Price / Stock Handler
  const handleUpdateInventory = async (productId, newPrice, newStock, isAvailable) => {
    try {
      const res = await fetch(`/api/shops/${currentShop.id}/inventory`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          price: newPrice,
          stockQuantity: newStock,
          isAvailable,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setInventories((prev) =>
          prev.map((inv) => (inv.productId === productId ? updated : inv))
        );
      }
    } catch (err) {
      console.error('Failed to update inventory item:', err);
    }
  };

  // Update Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/shops/${currentShop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (res.ok) {
        alert('Shop profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update shop profile:', err);
    }
  };

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'ALL' ? true : o.status === orderStatusFilter
  );

  const filteredInventories = inventories.filter(
    (inv) =>
      !inventorySearch ||
      inv.product?.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      inv.product?.brand.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Shop Selector */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Retailer Store Console
              </span>
              {shopDetails?.verified && (
                <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Shop
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1">
              {currentShop?.name || 'Retailer Dashboard'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{shopDetails?.address}</p>
          </div>
        </div>

        {/* Demo Shop Switcher Dropdown */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-3 rounded-2xl text-xs space-y-1">
          <label className="block text-[10px] uppercase font-bold text-slate-400">
            Switch Retail Shop Dashboard:
          </label>
          <select
            value={currentShop?.id}
            onChange={(e) => setActiveShopId(e.target.value)}
            className="bg-slate-900 text-emerald-400 font-bold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none w-full"
          >
            {shopsList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city?.name || 'Local'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders Pipeline ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Inventory & Prices ({inventories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Profile</span>
        </button>
      </div>

      {/* TAB 1: ORDERS PIPELINE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['ALL', 'PENDING', 'ACCEPTED', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                  orderStatusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">Loading incoming orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No orders found</p>
              <p className="text-xs text-slate-400">Orders placed by customers will show up here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">#{ord.orderNumber}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            ord.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'ACCEPTED'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Customer: <strong className="text-slate-800">{ord.customerName}</strong> ({ord.customerPhone})
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-lg font-black text-emerald-600">₹{ord.totalAmount}</div>
                      <div className="text-[10px] text-slate-400">{ord.paymentMethod}</div>
                    </div>
                  </div>

                  {/* Delivery Address & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                      <div className="font-bold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Location
                      </div>
                      <div className="text-slate-600">{ord.deliveryAddress}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                      <div className="font-bold text-slate-700">Order Items ({ord.items?.length})</div>
                      <div className="space-y-1 text-slate-600 max-h-24 overflow-y-auto pr-1">
                        {ord.items?.map((it) => (
                          <div key={it.id} className="flex justify-between">
                            <span>
                              {it.product?.name} x {it.quantity}
                            </span>
                            <span className="font-bold">₹{it.totalPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Pipeline Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
                      Update Order Status:
                    </span>

                    {ord.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'ACCEPTED')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        Accept Order
                      </button>
                    )}

                    {ord.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'READY')}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        Mark Ready for Dispatch
                      </button>
                    )}

                    {ord.status === 'READY' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'OUT_FOR_DELIVERY')}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        Send Out for Delivery
                      </button>
                    )}

                    {ord.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {ord.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'CANCELLED')}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & LOCAL PRICE MANAGER */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Shop Inventory & Price Manager</h3>
              <p className="text-xs text-slate-500">Set custom local prices and manage stock quantities</p>
            </div>

            <div className="w-full sm:w-72 relative">
              <input
                type="text"
                placeholder="Search catalog items..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Your Price (₹)</th>
                    <th className="p-4">Stock Count</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventories.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={inv.product?.image}
                            alt={inv.product?.name}
                            className="w-10 h-10 object-cover rounded-xl border border-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{inv.product?.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {inv.product?.brand} • {inv.product?.unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {inv.product?.category?.name}
                      </td>

                      {/* Price Input */}
                      <td className="p-4">
                        <input
                          type="number"
                          value={inv.price}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setInventories((prev) =>
                              prev.map((i) => (i.id === inv.id ? { ...i, price: val } : i))
                            );
                          }}
                          className="w-20 px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </td>

                      {/* Stock Count Controls */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const newStock = Math.max(0, inv.stockQuantity - 1);
                              setInventories((prev) =>
                                prev.map((i) => (i.id === inv.id ? { ...i, stockQuantity: newStock } : i))
                              );
                            }}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{inv.stockQuantity}</span>
                          <button
                            onClick={() => {
                              const newStock = inv.stockQuantity + 1;
                              setInventories((prev) =>
                                prev.map((i) => (i.id === inv.id ? { ...i, stockQuantity: newStock } : i))
                              );
                            }}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Availability Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setInventories((prev) =>
                              prev.map((i) => (i.id === inv.id ? { ...i, isAvailable: !i.isAvailable } : i))
                            );
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inv.isAvailable && inv.stockQuantity > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inv.isAvailable && inv.stockQuantity > 0 ? 'In Stock' : 'Disabled'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() =>
                            handleUpdateInventory(
                              inv.productId,
                              inv.price,
                              inv.stockQuantity,
                              inv.isAvailable
                            )
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHOP PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Edit Shop Profile</h3>
            <p className="text-xs text-slate-500">Update your store details and business hours</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shop Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
              <textarea
                rows={3}
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={profileForm.openingHours}
                  onChange={(e) => setProfileForm({ ...profileForm, openingHours: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
