import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      deliveryAddress,
      cityId,
      shopId,
      paymentMethod,
      items, // array of { productId, quantity, pricePerUnit }
    } = body;

    if (!items || !items.length || !shopId || !cityId || !customerName || !customerPhone || !deliveryAddress) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

    // Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // Create Order with Items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          deliveryAddress,
          cityId,
          shopId,
          totalAmount,
          paymentMethod: paymentMethod || 'Cash on Delivery',
          status: 'PENDING',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              pricePerUnit: item.pricePerUnit,
              totalPrice: item.quantity * item.pricePerUnit,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          shop: true,
          city: true,
        },
      });

      // Update shop stock counts
      for (const item of items) {
        const inv = await tx.shopInventory.findUnique({
          where: { shopId_productId: { shopId, productId: item.productId } },
        });

        if (inv) {
          const newQty = Math.max(0, inv.stockQuantity - item.quantity);
          await tx.shopInventory.update({
            where: { id: inv.id },
            data: {
              stockQuantity: newQty,
              isAvailable: newQty > 0,
            },
          });
        }
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const customerPhone = searchParams.get('customerPhone');

    const where = {};
    if (shopId) where.shopId = shopId;
    if (customerPhone) where.customerPhone = customerPhone;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shop: true,
        city: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
