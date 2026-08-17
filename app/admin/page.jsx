'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  Store,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  Sparkles,
  Save,
} from 'lucide-react';

export default function AdminPage() {
  const { shopsList, selectedCity } = useApp();

  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    sku: '',
    unit: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
    categoryId: '',
    defaultPrice: '99',
  });

  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      try {
        const sRes = await fetch('/api/shops');
        const sData = await sRes.json();
        setShops(Array.isArray(sData) ? sData : []);

        const cRes = await fetch('/api/products');
        const cData = await cRes.json();
        setCategories(cData.categories || []);
        if (cData.categories?.length > 0) {
          setProductForm((prev) => ({ ...prev, categoryId: cData.categories[0].id }));
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  // Toggle Store Verification
  const handleToggleVerification = async (shopId, currentVerified) => {
    try {
      const res = await fetch(`/api/admin/shops/${shopId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentVerified }),
      });

      if (res.ok) {
        setShops((prev) =>
          prev.map((s) => (s.id === shopId ? { ...s, verified: !currentVerified } : s))
        );
      }
    } catch (e) {
      console.error('Failed to toggle verification:', e);
    }
  };

  // Add Product to Master Catalog
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.brand || !productForm.sku || !productForm.unit || !productForm.categoryId) {
      alert('Please fill out all required product fields.');
      return;
    }

    setIsSubmittingProduct(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        alert(`Product "${productForm.name}" added to Master Catalog and pushed to all store inventories!`);
        setProductForm({
          name: '',
          brand: '',
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          unit: '',
          description: '',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
          categoryId: categories[0]?.id || '',
          defaultPrice: '99',
        });
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-purple-950 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between border border-purple-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 rounded-2xl text-white">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full">
              Platform Admin Console
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-1">
              RetailConnect Marketplace Admin
            </h1>
            <p className="text-xs text-purple-300">
              Retailer Onboarding Approval & Master Product Catalog Management
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Retailer Verification Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  Retailer Store Onboarding ({shops.length})
                </h2>
                <p className="text-xs text-slate-500">Approve or suspend local brick-and-mortar retail shops</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Store Name</th>
                    <th className="p-3">City & Address</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{shop.name}</td>
                      <td className="p-3 text-slate-600">{shop.city?.name} - {shop.address}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            shop.verified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {shop.verified ? 'Verified & Active' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleVerification(shop.id, shop.verified)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            shop.verified
                              ? 'bg-slate-100 hover:bg-rose-100 text-rose-700'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {shop.verified ? 'Revoke Verification' : 'Approve & Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Add Master Product Form */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-600" />
                Add Master Catalog Item
              </h2>
              <p className="text-xs text-slate-500">Pushes new product to all retail store inventory tables</p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Amul Salted Butter 100g"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="Amul"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Universal SKU / Barcode</label>
                  <input
                    type="text"
                    placeholder="SKU-AMUL-BUTTER-100"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Specification</label>
                  <input
                    type="text"
                    placeholder="100 g Pack"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Base Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.defaultPrice}
                    onChange={(e) => setProductForm({ ...productForm, defaultPrice: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProduct}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmittingProduct ? 'Adding Product...' : 'Publish to Catalog'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
