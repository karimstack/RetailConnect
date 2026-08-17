import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const shopId = params.id;

    const inventories = await prisma.shopInventory.findMany({
      where: { shopId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(inventories);
  } catch (error) {
    console.error('Error fetching shop inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const shopId = params.id;
    const body = await request.json();
    const { productId, price, stockQuantity, isAvailable } = body;

    if (!productId) {
      return NextResponse.json({ error: 'ProductId is required' }, { status: 400 });
    }

    const updatedInventory = await prisma.shopInventory.upsert({
      where: {
        shopId_productId: {
          shopId,
          productId,
        },
      },
      update: {
        price: price !== undefined ? parseFloat(price) : undefined,
        stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity) : undefined,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
      },
      create: {
        shopId,
        productId,
        price: parseFloat(price || 0),
        stockQuantity: parseInt(stockQuantity || 0),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.error('Error updating shop inventory item:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
