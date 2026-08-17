import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const query = searchParams.get('q');

    const where = {};
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { brand: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const products = await prisma.masterProduct.findMany({
      where,
      include: {
        category: true,
      },
    });

    const categories = await prisma.category.findMany();

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
