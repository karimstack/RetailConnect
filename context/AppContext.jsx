'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Cities list loaded from API
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [shopsList, setShopsList] = useState([]);

  // User simulated location (defaults to city center)
  const [userCoords, setUserCoords] = useState({ lat: 19.0760, lng: 72.8777 });

  // Role Switcher State (CUSTOMER, RETAILER, ADMIN)
  const [activeRole, setActiveRole] = useState('CUSTOMER');
  const [activeShopId, setActiveShopId] = useState(null); // When role is RETAILER

  // Cart State (Store-specific hyper-local cart)
  const [cart, setCart] = useState({
    shopId: null,
    shopName: '',
    items: [],
  });

  // UI Drawer & Modal States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Fetch Cities on load
  useEffect(() => {
    async function fetchCitiesAndShops() {
      try {
        const res = await fetch('/api/cities');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCities(data);
          const defaultCity = data[0]; // Mumbai
          setSelectedCity(defaultCity);
          setUserCoords({ lat: defaultCity.lat, lng: defaultCity.lng });

          // Fetch shops for default city
          const sRes = await fetch(`/api/shops?cityId=${defaultCity.id}`);
          const sData = await sRes.json();
          if (Array.isArray(sData)) {
            setShopsList(sData);
            if (sData.length > 0) {
              setActiveShopId(sData[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load initial cities:', err);
      }
    }
    fetchCitiesAndShops();
  }, []);

  // Update shops when selected city changes
  const switchCity = async (city) => {
    setSelectedCity(city);
    setUserCoords({ lat: city.lat, lng: city.lng });
    try {
      const res = await fetch(`/api/shops?cityId=${city.id}`);
      const sData = await res.json();
      if (Array.isArray(sData)) {
        setShopsList(sData);
        if (sData.length > 0) {
          setActiveShopId(sData[0].id);
        }
      }
    } catch (e) {
      console.error('Error switching city:', e);
    }
  };

  // Cart Helpers
  const addToCart = (shop, product, price) => {
    setCart((prevCart) => {
      // If adding from a different shop, confirm reset or overwrite
      if (prevCart.shopId && prevCart.shopId !== shop.id) {
        const confirmSwitch = window.confirm(
          `Your cart contains items from "${prevCart.shopName}". Would you like to clear your cart and add items from "${shop.name}" instead?`
        );
        if (!confirmSwitch) return prevCart;
        return {
          shopId: shop.id,
          shopName: shop.name,
          items: [{ product, price, quantity: 1 }],
        };
      }

      const existingIndex = prevCart.items.findIndex(
        (i) => i.product.id === product.id
      );

      let newItems = [...prevCart.items];
      if (existingIndex > -1) {
        newItems[existingIndex].quantity += 1;
      } else {
        newItems.push({ product, price, quantity: 1 });
      }

      return {
        shopId: shop.id,
        shopName: shop.name,
        items: newItems,
      };
    });
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) => {
      const updated = prev.items
        .map((item) => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean);

      return {
        ...prev,
        shopId: updated.length === 0 ? null : prev.shopId,
        shopName: updated.length === 0 ? '' : prev.shopName,
        items: updated,
      };
    });
  };

  const removeFromCart = (productId) => {
    updateCartQuantity(productId, -999);
  };

  const clearCart = () => {
    setCart({ shopId: null, shopName: '', items: [] });
  };

  const cartTotalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartTotalItemsCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        cities,
        selectedCity,
        switchCity,
        userCoords,
        setUserCoords,
        shopsList,
        activeRole,
        setActiveRole,
        activeShopId,
        setActiveShopId,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalAmount,
        cartTotalItemsCount,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
