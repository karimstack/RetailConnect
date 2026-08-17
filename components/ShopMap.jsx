'use client';

import React, { useEffect, useRef } from 'react';

export default function ShopMap({ lat, lng, shopName, address }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS if not already present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      // Fix icon path issue in Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (leafletInstance.current) {
        leafletInstance.current.remove();
      }

      const map = L.map(mapRef.current).setView([lat, lng], 15);
      leafletInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>${shopName}</b><br/>${address}`).openPopup();
    });

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [lat, lng, shopName, address]);

  return (
    <div className="w-full h-full min-h-[220px] rounded-xl overflow-hidden shadow-inner border border-slate-200 relative">
      <div ref={mapRef} className="w-full h-full min-h-[220px]" />
    </div>
  );
}
