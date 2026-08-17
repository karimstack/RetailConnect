const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with expanded cities including Nanded & Pune...');

  // Clean existing records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.shopInventory.deleteMany();
  await prisma.masterProduct.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.city.deleteMany();

  // 1. Create Cities
  const mumbai = await prisma.city.create({
    data: {
      name: 'Mumbai',
      state: 'Maharashtra',
      lat: 19.0760,
      lng: 72.8777,
      pincodes: '400050, 400053, 400001, 400058, 400076',
    },
  });

  const bangalore = await prisma.city.create({
    data: {
      name: 'Bangalore',
      state: 'Karnataka',
      lat: 12.9716,
      lng: 77.5946,
      pincodes: '560038, 560034, 560001, 560066, 560078',
    },
  });

  const nanded = await prisma.city.create({
    data: {
      name: 'Nanded',
      state: 'Maharashtra',
      lat: 19.1383,
      lng: 77.3210,
      pincodes: '431601, 431602, 431604, 431605',
    },
  });

  const pune = await prisma.city.create({
    data: {
      name: 'Pune',
      state: 'Maharashtra',
      lat: 18.5204,
      lng: 73.8567,
      pincodes: '411001, 411004, 411014, 411038',
    },
  });

  // 2. Create Categories
  const categoriesData = [
    { name: 'Dairy & Bakery', slug: 'dairy-bakery', icon: 'Milk' },
    { name: 'Beverages', slug: 'beverages', icon: 'Coffee' },
    { name: 'Snacks & Munchies', slug: 'snacks-munchies', icon: 'Cookie' },
    { name: 'Staples & Atta', slug: 'staples-atta', icon: 'Wheat' },
    { name: 'Personal Care', slug: 'personal-care', icon: 'Sparkles' },
    { name: 'Household Essentials', slug: 'household', icon: 'Home' },
  ];

  const categoriesMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = created.id;
  }

  // 3. Create Shops in Mumbai
  const mumbaiShopsData = [
    {
      name: 'FreshMart Supermarket',
      slug: 'freshmart-bandra',
      address: 'Hill Road, Bandra West, Mumbai',
      cityId: mumbai.id,
      pincode: '400050',
      lat: 19.0596,
      lng: 72.8295,
      phone: '+91 98200 11223',
      openingHours: '07:30 AM - 10:30 PM',
      rating: 4.7,
      verified: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Apollo General Store',
      slug: 'apollo-andheri',
      address: 'SV Road, Andheri West, Mumbai',
      cityId: mumbai.id,
      pincode: '400053',
      lat: 19.1136,
      lng: 72.8697,
      phone: '+91 98201 22334',
      openingHours: '08:00 AM - 10:00 PM',
      rating: 4.5,
      verified: true,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Shree Krishna Traders',
      slug: 'krishna-powai',
      address: 'Hiranandani Gardens, Powai, Mumbai',
      cityId: mumbai.id,
      pincode: '400076',
      lat: 19.1176,
      lng: 72.9060,
      phone: '+91 98202 33445',
      openingHours: '08:00 AM - 09:30 PM',
      rating: 4.8,
      verified: true,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Metro Corner Store',
      slug: 'metro-dadar',
      address: 'Dadar TT Circle, Dadar, Mumbai',
      cityId: mumbai.id,
      pincode: '400014',
      lat: 19.0178,
      lng: 72.8478,
      phone: '+91 98203 44556',
      openingHours: '07:00 AM - 11:00 PM',
      rating: 4.3,
      verified: true,
      image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Laxmi Provisions',
      slug: 'laxmi-juhu',
      address: 'Juhu Tara Road, Juhu, Mumbai',
      cityId: mumbai.id,
      pincode: '400049',
      lat: 19.1075,
      lng: 72.8263,
      phone: '+91 98204 55667',
      openingHours: '08:30 AM - 10:00 PM',
      rating: 4.6,
      verified: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // 4. Create Shops in Bangalore
  const bangaloreShopsData = [
    {
      name: 'GreenLeaf Groceries',
      slug: 'greenleaf-indiranagar',
      address: '100 Feet Road, Indiranagar, Bangalore',
      cityId: bangalore.id,
      pincode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      phone: '+91 99800 11223',
      openingHours: '07:30 AM - 10:30 PM',
      rating: 4.9,
      verified: true,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Koramangala Daily Store',
      slug: 'koramangala-daily',
      address: '5th Block, Koramangala, Bangalore',
      cityId: bangalore.id,
      pincode: '560034',
      lat: 12.9352,
      lng: 77.6245,
      phone: '+91 99801 22334',
      openingHours: '08:00 AM - 10:00 PM',
      rating: 4.6,
      verified: true,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Whitefield Super Mart',
      slug: 'whitefield-supermart',
      address: 'ITPL Main Road, Whitefield, Bangalore',
      cityId: bangalore.id,
      pincode: '560066',
      lat: 12.9698,
      lng: 77.7499,
      phone: '+91 99802 33445',
      openingHours: '08:00 AM - 11:00 PM',
      rating: 4.4,
      verified: true,
      image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'HSR Layout Organics',
      slug: 'hsr-organics',
      address: '27th Main Road, HSR Layout, Bangalore',
      cityId: bangalore.id,
      pincode: '560102',
      lat: 12.9121,
      lng: 77.6446,
      phone: '+91 99803 44556',
      openingHours: '07:00 AM - 09:30 PM',
      rating: 4.8,
      verified: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'MG Road Retailers',
      slug: 'mg-road-retailers',
      address: 'MG Road Metro Station, Bangalore',
      cityId: bangalore.id,
      pincode: '560001',
      lat: 12.9756,
      lng: 77.6097,
      phone: '+91 99804 55667',
      openingHours: '08:00 AM - 10:00 PM',
      rating: 4.5,
      verified: true,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // 5. Create Shops in Nanded, Maharashtra
  const nandedShopsData = [
    {
      name: 'Gurukrupa Super Shoppe',
      slug: 'gurukrupa-nanded',
      address: 'Vazirabad Main Market, Nanded',
      cityId: nanded.id,
      pincode: '431601',
      lat: 19.1550,
      lng: 77.3180,
      phone: '+91 94221 88123',
      openingHours: '08:00 AM - 10:00 PM',
      rating: 4.8,
      verified: true,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Nanded Kirana & Provisions',
      slug: 'nanded-kirana-station',
      address: 'Guru Gobind Singh Ji Road, Nanded',
      cityId: nanded.id,
      pincode: '431602',
      lat: 19.1480,
      lng: 77.3110,
      phone: '+91 94221 88234',
      openingHours: '07:30 AM - 10:00 PM',
      rating: 4.6,
      verified: true,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Mahavir Departmental Store',
      slug: 'mahavir-nanded',
      address: 'Station Road, Nanded',
      cityId: nanded.id,
      pincode: '431601',
      lat: 19.1600,
      lng: 77.3150,
      phone: '+91 94221 88345',
      openingHours: '08:30 AM - 09:30 PM',
      rating: 4.5,
      verified: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Balaji Super Market',
      slug: 'balaji-taroda-nanded',
      address: 'Taroda Naka Square, Nanded',
      cityId: nanded.id,
      pincode: '431605',
      lat: 19.1720,
      lng: 77.3250,
      phone: '+91 94221 88456',
      openingHours: '08:00 AM - 10:30 PM',
      rating: 4.7,
      verified: true,
      image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Shri Laxmi Traders',
      slug: 'laxmi-mondha-nanded',
      address: 'Old Mondha Market, Nanded',
      cityId: nanded.id,
      pincode: '431604',
      lat: 19.1410,
      lng: 77.3090,
      phone: '+91 94221 88567',
      openingHours: '07:00 AM - 09:00 PM',
      rating: 4.4,
      verified: true,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // 6. Create Shops in Pune, Maharashtra
  const puneShopsData = [
    {
      name: 'Deccan Traders & Groceries',
      slug: 'deccan-traders-pune',
      address: 'Deccan Gymkhana, FC Road, Pune',
      cityId: pune.id,
      pincode: '411004',
      lat: 18.5180,
      lng: 73.8430,
      phone: '+91 98230 44112',
      openingHours: '08:00 AM - 10:30 PM',
      rating: 4.8,
      verified: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Viman Nagar FreshMart',
      slug: 'viman-nagar-freshmart',
      address: 'Phoenix Marketcity Road, Viman Nagar, Pune',
      cityId: pune.id,
      pincode: '411014',
      lat: 18.5679,
      lng: 73.9143,
      phone: '+91 98230 44223',
      openingHours: '07:30 AM - 11:00 PM',
      rating: 4.7,
      verified: true,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kothrud Super Bazaar',
      slug: 'kothrud-bazaar-pune',
      address: 'Karve Road, Kothrud, Pune',
      cityId: pune.id,
      pincode: '411038',
      lat: 18.5074,
      lng: 73.8077,
      phone: '+91 98230 44334',
      openingHours: '08:00 AM - 10:00 PM',
      rating: 4.6,
      verified: true,
      image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'FC Road Corner Store',
      slug: 'fc-road-corner',
      address: 'Fergusson College Road, Shivajinagar, Pune',
      cityId: pune.id,
      pincode: '411004',
      lat: 18.5240,
      lng: 73.8410,
      phone: '+91 98230 44445',
      openingHours: '08:00 AM - 10:30 PM',
      rating: 4.5,
      verified: true,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hadapsar Daily Provisions',
      slug: 'hadapsar-provisions',
      address: 'Magarpatta Road, Hadapsar, Pune',
      cityId: pune.id,
      pincode: '411028',
      lat: 18.5089,
      lng: 73.9259,
      phone: '+91 98230 44556',
      openingHours: '07:30 AM - 10:00 PM',
      rating: 4.4,
      verified: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const shops = [];
  const allShopsData = [...mumbaiShopsData, ...bangaloreShopsData, ...nandedShopsData, ...puneShopsData];
  
  for (const s of allShopsData) {
    const shop = await prisma.shop.create({ data: s });
    shops.push(shop);

    // Create user owner for each shop
    await prisma.user.create({
      data: {
        name: `Owner - ${shop.name}`,
        email: `owner.${shop.slug}@retailconnect.com`,
        role: 'RETAILER',
        shopId: shop.id,
      },
    });
  }

  // Create platform admin user
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@retailconnect.com',
      role: 'ADMIN',
    },
  });

  // Create default customer user
  await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.customer@example.com',
      role: 'CUSTOMER',
    },
  });

  // 7. Create Master Products (including Maharashtra regional favorites)
  const productsData = [
    {
      name: 'Amul Taaza Toned Fresh Milk',
      brand: 'Amul',
      sku: 'SKU-AMUL-MILK-500',
      unit: '500 ml',
      description: 'Pasteurised Toned Milk, rich in calcium and essential vitamins.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['dairy-bakery'],
      basePrice: 29,
    },
    {
      name: 'Gokul Selection Pure Cow Milk',
      brand: 'Gokul',
      sku: 'SKU-GOKUL-MILK-500',
      unit: '500 ml Pouch',
      description: 'Fresh and pure cow milk processed by Kolhapur Zilla Sahakari Dudh Sangh.',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['dairy-bakery'],
      basePrice: 28,
    },
    {
      name: 'Chitale Bandhu Authentic Bakarwadi',
      brand: 'Chitale Bandhu',
      sku: 'SKU-CHITALE-BAKARWADI-250',
      unit: '250 g Pack',
      description: 'Famous spicy and tangy Maharashtrian fried savory snack.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['snacks-munchies'],
      basePrice: 95,
    },
    {
      name: 'Aashirvaad Shuddh Chakki Atta',
      brand: 'Aashirvaad',
      sku: 'SKU-AASH-ATTA-5KG',
      unit: '5 kg',
      description: '100% pure whole wheat flour milled to perfection.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['staples-atta'],
      basePrice: 245,
    },
    {
      name: 'Fortune Sunlite Sunflower Oil',
      brand: 'Fortune',
      sku: 'SKU-FORT-OIL-1L',
      unit: '1 L Pouch',
      description: 'Refined sunflower oil, healthy and easy on heart digestives.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['staples-atta'],
      basePrice: 140,
    },
    {
      name: 'Tata Salt Vacuum Evaporated',
      brand: 'Tata',
      sku: 'SKU-TATA-SALT-1KG',
      unit: '1 kg',
      description: 'Iodized salt that ensures purity and wholesome nutrition.',
      image: 'https://images.unsplash.com/photo-1518110165405-188339c1f618?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['staples-atta'],
      basePrice: 28,
    },
    {
      name: 'Britannia Good Day Butter Cookies',
      brand: 'Britannia',
      sku: 'SKU-BRIT-GOODDAY-200',
      unit: '200 g',
      description: 'Rich buttery crunchy biscuits, perfect teatime partner.',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['snacks-munchies'],
      basePrice: 40,
    },
    {
      name: 'Pravin Authentic Mango Pickle',
      brand: 'Pravin',
      sku: 'SKU-PRAVIN-PICKLE-500',
      unit: '500 g Glass Jar',
      description: 'Traditional Maharashtrian spiced raw mango pickle.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['staples-atta'],
      basePrice: 120,
    },
    {
      name: 'Coca-Cola Soft Drink Bottle',
      brand: 'Coca-Cola',
      sku: 'SKU-COCA-COLA-750',
      unit: '750 ml Bottle',
      description: 'Refreshing carbonated soft drink served ice cold.',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['beverages'],
      basePrice: 45,
    },
    {
      name: 'Red Bull Energy Drink Can',
      brand: 'Red Bull',
      sku: 'SKU-REDBULL-250',
      unit: '250 ml Can',
      description: 'Vitalizes body and mind with taurine & B-group vitamins.',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['beverages'],
      basePrice: 125,
    },
    {
      name: 'Maggi 2-Minute Masala Noodles',
      brand: 'Maggi',
      sku: 'SKU-MAGGI-4PACK',
      unit: '280 g (Pack of 4)',
      description: 'Iconic instant noodles with authentic Indian spices blend.',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['snacks-munchies'],
      basePrice: 56,
    },
    {
      name: 'Suhana Garam Masala Blend',
      brand: 'Suhana',
      sku: 'SKU-SUHANA-MASALA-100',
      unit: '100 g Pack',
      description: 'Rich aromatic Maharashtrian spice mix for authentic curry flavor.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['staples-atta'],
      basePrice: 65,
    },
    {
      name: 'Lays Classic Salted Potato Chips',
      brand: 'Lays',
      sku: 'SKU-LAYS-SALTED-50',
      unit: '50 g',
      description: 'Crispy fried potato chips lightly seasoned with natural salt.',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['snacks-munchies'],
      basePrice: 20,
    },
    {
      name: 'Cadbury Dairy Milk Silk Chocolate',
      brand: 'Cadbury',
      sku: 'SKU-CADBURY-SILK-150',
      unit: '150 g',
      description: 'Smooth, creamy milk chocolate melting instantly on palate.',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['snacks-munchies'],
      basePrice: 175,
    },
    {
      name: 'Tropicana 100% Orange Juice',
      brand: 'Tropicana',
      sku: 'SKU-TROP-ORANGE-1L',
      unit: '1 L Tetra Pak',
      description: 'Squeezed pure orange juice with no added sugar or preservatives.',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['beverages'],
      basePrice: 135,
    },
    {
      name: 'Nescafe Classic Instant Coffee',
      brand: 'Nescafe',
      sku: 'SKU-NESCAFE-100G',
      unit: '100 g Glass Jar',
      description: '100% pure coffee beans dark roasted for intense aroma.',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['beverages'],
      basePrice: 340,
    },
    {
      name: 'Brooke Bond Red Label Tea',
      brand: 'Red Label',
      sku: 'SKU-TEA-REDLABEL-500',
      unit: '500 g Pack',
      description: 'High quality black tea leaves providing rich color and flavor.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['beverages'],
      basePrice: 260,
    },
    {
      name: 'Dove Cream Beauty Soap',
      brand: 'Dove',
      sku: 'SKU-DOVE-SOAP-3Pack',
      unit: '125 g x 3 Pack',
      description: '1/4 moisturizing cream for soft, smooth, healthy skin.',
      image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['personal-care'],
      basePrice: 195,
    },
    {
      name: 'Colgate Strong Teeth Toothpaste',
      brand: 'Colgate',
      sku: 'SKU-COLGATE-200G',
      unit: '200 g Tube',
      description: 'Calcium Boost formula for strong white teeth and fresh breath.',
      image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['personal-care'],
      basePrice: 110,
    },
    {
      name: 'Dettol Antiseptic Disinfectant Liquid',
      brand: 'Dettol',
      sku: 'SKU-DETTOL-500ML',
      unit: '500 ml Bottle',
      description: 'First aid, medical & personal hygiene antiseptic protection.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['personal-care'],
      basePrice: 215,
    },
    {
      name: 'Surf Excel Easy Wash Detergent',
      brand: 'Surf Excel',
      sku: 'SKU-SURFEXCEL-1KG',
      unit: '1 kg Pouch',
      description: 'Removes tough stains like oil, curry and mud easily.',
      image: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['household'],
      basePrice: 145,
    },
    {
      name: 'Vim Dishwash Gel Lemon',
      brand: 'Vim',
      sku: 'SKU-VIM-GEL-500ML',
      unit: '500 ml Bottle',
      description: 'Lemon power grease cleaner leaving zero residue on utensils.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['household'],
      basePrice: 120,
    },
    {
      name: 'Amul Butter Salted',
      brand: 'Amul',
      sku: 'SKU-AMUL-BUTTER-500',
      unit: '500 g Pack',
      description: 'Utterly butterly delicious pasteurised salted butter.',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80',
      categoryId: categoriesMap['dairy-bakery'],
      basePrice: 275,
    },
  ];

  const createdProducts = [];
  for (const prodData of productsData) {
    const { basePrice, ...data } = prodData;
    const p = await prisma.masterProduct.create({ data });
    createdProducts.push({ product: p, basePrice });
  }

  // 8. Create Shop Inventory Matrices with Price Variations & Stock Levels
  for (const shop of shops) {
    for (const { product, basePrice } of createdProducts) {
      // Introduce slight price variance per shop (-8% to +10%)
      const hash = (shop.id.charCodeAt(shop.id.length - 1) + product.id.charCodeAt(product.id.length - 1)) % 5;
      const priceVariation = (hash - 2) * 2; // -4, -2, 0, +2, +4 rupees
      const shopPrice = Math.max(10, Math.round(basePrice + priceVariation));

      // Stock variation
      const stock = (hash === 0) ? 0 : (hash * 8 + 5); // Some out of stock, some low stock, some high stock
      const isAvailable = stock > 0;

      await prisma.shopInventory.create({
        data: {
          shopId: shop.id,
          productId: product.id,
          price: shopPrice,
          stockQuantity: stock,
          isAvailable: isAvailable,
        },
      });
    }
  }

  console.log('Database seeded successfully!');
  console.log(`Created 4 Cities (Mumbai, Bangalore, Nanded, Pune), ${shops.length} Shops, ${createdProducts.length} Master Products, and ${shops.length * createdProducts.length} Inventory items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
