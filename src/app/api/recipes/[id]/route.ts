import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await db.recipe.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}