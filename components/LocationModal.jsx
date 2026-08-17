'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, X, Check, Navigation } from 'lucide-react';

export default function LocationModal() {
  const {
    cities,
    selectedCity,
    switchCity,
    isLocationModalOpen,
    setIsLocationModalOpen,
    setUserCoords,
  } = useApp();

  if (!isLocationModalOpen) return null;

  const handleCitySelect = (city) => {
    switchCity(city);
    setIsLocationModalOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLocationModalOpen(false);
        },
        (err) => {
          alert('Could not retrieve exact location. Using city center.');
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Select Your Location</h3>
              <p className="text-xs text-slate-500">Discover shops and compare prices near you</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4">
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-98 mb-4 group"
          >
            <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            <span>Auto-Detect My Precise Location</span>
          </button>

          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select City
          </h4>
          <div className="space-y-2">
            {cities.map((city) => {
              const isSelected = selectedCity?.id === city.id;
              const pincodes = city.pincodes.split(',').map((p) => p.trim());
              return (
                <div
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-200 hover:scale-[1.02] active:scale-98 flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {city.name}, {city.state}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Pincodes: {pincodes.slice(0, 3).join(', ')}...
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
