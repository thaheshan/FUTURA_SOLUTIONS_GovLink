import app from './app';
import { MongoDB } from './config/mongodb';
import { config } from './config/environment';

const mongodb = MongoDB.getInstance();

mongodb.connect().then(() => {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
