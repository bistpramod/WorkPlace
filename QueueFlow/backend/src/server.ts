import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function start(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`QueueFlow API listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start QueueFlow API", error);
    process.exit(1);
  }
}

void start();
