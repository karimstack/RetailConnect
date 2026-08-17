import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, brand, sku, unit, description, image, categoryId, defaultPrice } = body;

    if (!name || !brand || !sku || !unit || !categoryId || !image) {
      return NextResponse.json({ error: 'Missing required product parameters' }, { status: 400 });
    }

    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.masterProduct.create({
        data: {
          name,
          brand,
          sku,
          unit,
          description: description || '',
          image,
          categoryId,
        },
        include: {
          category: true,
        },
      });

      // Populate inventory for all shops with default price
      const shops = await tx.shop.findMany();
      for (const shop of shops) {
        await tx.shopInventory.create({
          data: {
            shopId: shop.id,
            productId: createdProduct.id,
            price: parseFloat(defaultPrice || 100),
            stockQuantity: 15,
            isAvailable: true,
          },
        });
      }

      return createdProduct;
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error adding master product:', error);
    return NextResponse.json({ error: 'Failed to add product to catalog' }, { status: 500 });
  }
}
