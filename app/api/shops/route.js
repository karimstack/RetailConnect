import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDistanceKm } from '@/lib/distance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');
    const userLat = parseFloat(searchParams.get('lat') || '0');
    const userLng = parseFloat(searchParams.get('lng') || '0');

    const where = {};
    if (cityId) {
      where.cityId = cityId;
    }

    const shops = await prisma.shop.findMany({
      where,
      include: {
        city: true,
        _count: {
          select: { inventories: true },
        },
      },
    });

    const shopsWithDistance = shops.map((shop) => {
      const dist = calculateDistanceKm(
        userLat || shop.lat,
        userLng || shop.lng,
        shop.lat,
        shop.lng
      );

      return {
        ...shop,
        distanceKm: dist,
      };
    });

    shopsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json(shopsWithDistance);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}
