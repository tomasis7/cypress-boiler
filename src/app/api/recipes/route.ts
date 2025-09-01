import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

export async function GET() {
  try {
    const recipes = await db.recipe.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, ingredients, instructions, authorId } = await request.json();
    
    if (!title || !ingredients || !instructions || !authorId) {
      return NextResponse.json({ 
        error: 'Title, ingredients, instructions, and authorId are required' 
      }, { status: 400 });
    }

    if (!Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return NextResponse.json({ 
        error: 'Ingredients and instructions must be arrays' 
      }, { status: 400 });
    }

    const recipe = await db.recipe.create({
      data: { 
        title, 
        ingredients, 
        instructions, 
        authorId 
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
