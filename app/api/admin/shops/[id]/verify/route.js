import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const shopId = params.id;
    const { verified } = await request.json();

    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        verified: Boolean(verified),
      },
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('Error toggling shop verification status:', error);
    return NextResponse.json({ error: 'Failed to update shop status' }, { status: 500 });
  }
}
