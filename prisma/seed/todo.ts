import { Todo } from "@/generated/prisma";
import { db } from "../db";

export async function seedTodos() {
  const mockedTodos: Todo[] = [
    {
      id: "68adb30b0c2c50f13d0a64e9",
      text: "Feed the cat",
    },
    {
      id: "68adb30b0c2c50f13d0a64ea",
      text: "Ignore the dog",
    },
    {
      id: "68adb30b0c2c50f13d0a64eb",
      text: "Walk all the cats",
    },
  ];

  for (const { id, ...todo } of mockedTodos) {
    await db.todo.upsert({
      where: { id },
      update: todo,
      create: { id, ...todo },
    });
  }
}
