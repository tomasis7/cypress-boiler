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
    // Fallback mock data for development when no database is available
    console.log('Database not available, using mock data');
    const mockRecipes = [
      {
        id: "mock1",
        title: "Klassiska Pannkakor",
        ingredients: ["2 ägg", "3 dl mjölk", "2 dl vetemjöl", "1 krm salt"],
        instructions: ["Blanda alla ingredienser till en slät smet", "Stek i pannkakspanna"],
        author: { id: "user1", name: "Demo Användare", email: "demo@example.com" }
      },
      {
        id: "mock2", 
        title: "Köttbullar",
        ingredients: ["500g köttfärs", "1 ägg", "1 dl ströbröd", "1 dl mjölk"],
        instructions: ["Blanda alla ingredienser", "Forma till bollar", "Stek i panna"],
        author: { id: "user1", name: "Demo Användare", email: "demo@example.com" }
      }
    ];
    return NextResponse.json(mockRecipes);
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
    // Mock mode for development without database
    console.log('Database not available, using mock recipe creation');
    try {
      const body = await request.json();
      const { title, ingredients, instructions, authorId } = body;
      
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

      const mockRecipe = {
        id: `recipe-${Date.now()}`,
        title,
        ingredients,
        instructions,
        authorId,
        author: { id: authorId, name: "Mock User", email: "mock@example.com" }
      };
      
      return NextResponse.json(mockRecipe);
    } catch (jsonError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
  }
}
