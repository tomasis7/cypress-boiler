import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const todos = await prisma.todo.findMany();
    console.log('Todos:', todos);
  } catch (error) {
    console.error('Error retrieving todos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
