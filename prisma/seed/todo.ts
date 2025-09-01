import { User, Recipe } from "@/generated/prisma";
import { db } from "../db";

export async function seedTodos() {
  // Clear existing data
  await db.recipe.deleteMany();
  await db.user.deleteMany();

  // Create test user
  const testUser = await db.user.create({
    data: {
      id: "68adb30b0c2c50f13d0a64e1",
      email: "test@example.com",
      name: "Test User"
    }
  });

  // Create sample recipes
  const mockedRecipes = [
    {
      id: "68adb30b0c2c50f13d0a64e9",
      title: "Klassiska Pannkakor",
      ingredients: ["2 ägg", "3 dl mjölk", "2 dl vetemjöl", "1 krm salt"],
      instructions: ["Blanda alla ingredienser till en slät smet", "Stek i pannkakspanna"],
      authorId: testUser.id
    },
    {
      id: "68adb30b0c2c50f13d0a64ea", 
      title: "Köttbullar",
      ingredients: ["500g köttfärs", "1 ägg", "1 dl ströbröd", "1 dl mjölk"],
      instructions: ["Blanda alla ingredienser", "Forma till bollar", "Stek i panna"],
      authorId: testUser.id
    }
  ];

  for (const recipe of mockedRecipes) {
    await db.recipe.create({
      data: recipe
    });
  }
}
