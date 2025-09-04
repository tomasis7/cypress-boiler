import { spawn } from "child_process";
import { defineConfig } from "cypress";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import waitOn from "wait-on";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3100",
    async setupNodeEvents(on) {
      const mongo = await MongoMemoryReplSet.create({
        replSet: { count: 1 },
      });
      const dbUri = mongo.getUri("cypress-test");

      const server = spawn(
        "npx",
        ["next", "dev", "--turbopack", "-p", "3100"],
        {
          env: {
            ...process.env,
            NODE_ENV: "test",
            DATABASE_URL: dbUri,
          },
          stdio: "inherit",
        }
      );

      await waitOn({ resources: ["http://localhost:3100"], timeout: 60_000 });

      const cleanup = async () => {
        server.kill();
        await mongo.stop();
      };
      on("after:run", cleanup);
      process.on("SIGTERM", cleanup);

      process.env.DATABASE_URL = dbUri;
      on("task", {
        async reseed() {
          const { db } = await import("./prisma/db");
          const { seedTodos } = await import("./prisma/seed/todo");
          await seedTodos();

          return null;
        },
      });
    },
  },
});
