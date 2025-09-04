import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await db.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.log("Database not available, using mock recipe data");
    const mockRecipes = {
      mock1: {
        id: "mock1",
        title: "Klassiska Pannkakor",
        ingredients: ["2 ägg", "3 dl mjölk", "2 dl vetemjöl", "1 krm salt"],
        instructions: [
          "Blanda alla ingredienser till en slät smet",
          "Stek i pannkakspanna",
        ],
        author: {
          id: "user1",
          name: "Demo Användare",
          email: "demo@example.com",
        },
      },
      mock2: {
        id: "mock2",
        title: "Köttbullar",
        ingredients: ["500g köttfärs", "1 ägg", "1 dl ströbröd", "1 dl mjölk"],
        instructions: [
          "Blanda alla ingredienser",
          "Forma till bollar",
          "Stek i panna",
        ],
        author: {
          id: "user1",
          name: "Demo Användare",
          email: "demo@example.com",
        },
      },
    };

    const { id } = await params;
    const recipe = mockRecipes[id as keyof typeof mockRecipes];
    if (recipe) {
      return NextResponse.json(recipe);
    } else {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
  }
}
