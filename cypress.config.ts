import { defineConfig } from "cypress";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { spawn } from "child_process";
import waitOn from "wait-on";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3100",
    async setupNodeEvents(on) {
      // Kill any existing processes on port 3100 before starting
      // await new Promise<void>((resolve) => {
      //   exec("ss -tulpn | grep :3100", (error, stdout) => {
      //     if (stdout.trim()) {
      //       const match = stdout.match(/pid=(\d+)/);
      //       if (match) {
      //         const pid = match[1];
      //         exec(`kill -9 ${pid}`, () => {
      //           setTimeout(resolve, 1000); // Wait 1s after killing
      //         });
      //       } else {
      //         resolve();
      //       }
      //     } else {
      //       resolve();
      //     }
      //   });
      // });

      //1. skapa in memory databas (replica set prisma gn'ller annars)
      const mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
      const dbUri = mongo.getUri("cypress-test");

      //2. nextjs starta srv pa annat port som ansluter till 1.
      const server = spawn(
        "npx",
        ["next", "dev", "--turbopack", "--port", "3100"],
        {
          env: { ...process.env, NODE_ENV: "test", DATABASE_URL: dbUri },
          stdio: "inherit",
        }
      );
      //3. vanta p[ att nextjs serv startat igang innan cypress kor
      await waitOn({ resources: [`http://localhost:3100`], timeout: 60_000 });
      //4. stada upp processerna dvs mongo databasen o srv  nextjs
      const cleanup = async () => {
        try {
          server.kill();
          // setTimeout(() => server.kill("SIGKILL"), 5000); // Force kill after 5s if still running
          await mongo.stop();
        } catch (error) {
          console.warn("Cleanup error:", error);
        }
      };

      // Multiple cleanup handlers to ensure processes are killed
      on("after:run", cleanup);
      // on("after:spec", cleanup);
      process.on("SIGTERM", cleanup);
      // process.on("SIGINT", cleanup);
      // process.on("exit", cleanup);
      // process.on("uncaughtException", cleanup);
      //5. reseeda om db
      process.env.DATABASE_URL = dbUri;
      on("task", {
        async reseed() {
          const { db } = await import("./prisma/db");
          const { seedTodos } = await import("./prisma/seed/todo");

          await db.todo.deleteMany();
          await seedTodos();

          return null;
        },
      });
    },
  },
});
