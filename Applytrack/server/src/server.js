import app from './app.js';
import {
  connectToDatabase,
  disconnectFromDatabase,
} from './config/database.js';

const port = Number.parseInt(process.env.PORT ?? '5000', 10);
const host = process.env.HOST ?? '127.0.0.1';
const mongodbUri = process.env.MONGODB_URI;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535');
  process.exit(1);
}

let server;

try {
  await connectToDatabase(mongodbUri);

  server = app.listen(port, host, () => {
    console.log(`ApplyTrack API listening at http://${host}:${port}`);
  });
} catch (error) {
  console.error(`Unable to start ApplyTrack API: ${error.message}`);
  process.exit(1);
}

function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server`);

  server.close(async (error) => {
    if (error) {
      console.error('Failed to close HTTP server', error);
      process.exit(1);
    }

    await disconnectFromDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
