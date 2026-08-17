import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const orderId = params.id;
    const { status } = await request.json();

    const validStatuses = ['PENDING', 'ACCEPTED', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: { product: true },
        },
        shop: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
