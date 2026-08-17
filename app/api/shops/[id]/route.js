import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDistanceKm } from '@/lib/distance';

export async function GET(request, { params }) {
  try {
    const shopId = params.id;
    const { searchParams } = new URL(request.url);
    const userLat = parseFloat(searchParams.get('lat') || '0');
    const userLng = parseFloat(searchParams.get('lng') || '0');

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        city: true,
        inventories: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const distanceKm = calculateDistanceKm(
      userLat || shop.lat,
      userLng || shop.lng,
      shop.lat,
      shop.lng
    );

    return NextResponse.json({
      ...shop,
      distanceKm,
    });
  } catch (error) {
    console.error('Error fetching shop details:', error);
    return NextResponse.json({ error: 'Failed to fetch shop details' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const shopId = params.id;
    const body = await request.json();

    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        openingHours: body.openingHours,
        lat: body.lat ? parseFloat(body.lat) : undefined,
        lng: body.lng ? parseFloat(body.lng) : undefined,
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('Error updating shop profile:', error);
    return NextResponse.json({ error: 'Failed to update shop' }, { status: 500 });
  }
}
