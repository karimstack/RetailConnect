import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDistanceKm } from '@/lib/distance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const cityId = searchParams.get('cityId');
    const categorySlug = searchParams.get('category');
    const userLat = parseFloat(searchParams.get('lat') || '0');
    const userLng = parseFloat(searchParams.get('lng') || '0');

    // Build filter for products
    const productWhere = {};
    if (categorySlug) {
      productWhere.category = { slug: categorySlug };
    }
    if (query) {
      productWhere.OR = [
        { name: { contains: query } },
        { brand: { contains: query } },
        { description: { contains: query } },
        { sku: { contains: query } },
      ];
    }

    // Build filter for shops
    const shopWhere = {};
    if (cityId) {
      shopWhere.cityId = cityId;
    }

    // Find master products matching query
    const products = await prisma.masterProduct.findMany({
      where: productWhere,
      include: {
        category: true,
        inventories: {
          where: {
            shop: shopWhere,
          },
          include: {
            shop: true,
          },
        },
      },
    });

    // Transform results to format product comparison list
    const results = products
      .map((product) => {
        // Map shop offerings for this product
        const shopOfferings = product.inventories
          .map((inv) => {
            const distanceKm = calculateDistanceKm(
              userLat || inv.shop.lat,
              userLng || inv.shop.lng,
              inv.shop.lat,
              inv.shop.lng
            );

            return {
              inventoryId: inv.id,
              shopId: inv.shop.id,
              shopName: inv.shop.name,
              shopAddress: inv.shop.address,
              shopPincode: inv.shop.pincode,
              shopLat: inv.shop.lat,
              shopLng: inv.shop.lng,
              shopRating: inv.shop.rating,
              shopPhone: inv.shop.phone,
              shopOpeningHours: inv.shop.openingHours,
              price: inv.price,
              stockQuantity: inv.stockQuantity,
              isAvailable: inv.isAvailable && inv.stockQuantity > 0,
              distanceKm: distanceKm,
            };
          })
          .sort((a, b) => a.price - b.price); // Default sort by price ascending

        // Find min and max price across shops
        const availablePrices = shopOfferings.filter((s) => s.isAvailable).map((s) => s.price);
        const minPrice = availablePrices.length ? Math.min(...availablePrices) : null;
        const maxPrice = availablePrices.length ? Math.max(...availablePrices) : null;

        return {
          id: product.id,
          name: product.name,
          brand: product.brand,
          sku: product.sku,
          unit: product.unit,
          description: product.description,
          image: product.image,
          category: product.category,
          minPrice,
          maxPrice,
          availableShopCount: availablePrices.length,
          totalShopCount: shopOfferings.length,
          shops: shopOfferings,
        };
      })
      .filter((p) => p.totalShopCount > 0);

    return NextResponse.json({
      query,
      count: results.length,
      products: results,
    });
  } catch (error) {
    console.error('Error executing hyper-local search:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
