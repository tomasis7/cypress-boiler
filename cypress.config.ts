import { defineConfig } from "cypress";
import { db } from "./prisma/db";
import { seedTodos } from "./prisma/seed/todo";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { spawn } from "child_process";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      //1. skapa in memory databas (replica set prisma gn'ller annars)
      const mongo = await MongoMemoryReplSet.create({ replSet: { count: 1}})
      const dbUri = mongo.getUri("cypress-test");
    
      //2. nextjs starta srv pa annat port som ansluter till 1.
      const server = spawn("npx", ["next", "dev", "--turbopack", '-port', '3100'], { env: { NODE_ENV: "test", DATABASE_URL: dbUri }, stdio: "inherit" });
      //3. vanta p[ att nextjs serv startat igang innan cypress kor
      await waitOn({"resources": [`http://localhost:3100`], timeout: 60_000 })
      //4. stada upp processerna dvs mongo databasen o srv  nextjs
      const cleanup = async () => {
        server.kill();
        await mongo.stop();
      };
      process.on("exit", cleanup);
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
