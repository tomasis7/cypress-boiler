import { defineConfig } from "cypress";
import { db } from "./prisma/db";
import { seedTodos } from "./prisma/seed/todo";
import { MongoMemoryReplSet } from "mongodb-memory-server";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      //1. skapa in memory databas (replica set prisma gn'ller annars)
      const db = await MongoMemoryReplSet().create( { replSet: { count: 1}})
      const dbUri = db.getUri("cypress-test");
      //2. nextjs starta srv pa annat port som ansluter till 1.
      //3. vanta p[ att nextjs serv startat igang innan cypress kor vidare
      //4. stada upp processerna dvs mongo databasen o srv  nextjs
      //5. reseeda om db 
      on("task", {

        async reseed() {
          await db.todo.deleteMany();
          await seedTodos();

          return null;
        },
      });
    },
  },
});
