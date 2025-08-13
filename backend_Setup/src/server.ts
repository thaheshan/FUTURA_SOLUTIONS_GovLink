import app from './app';
import { connectMongo } from './config/mongodb';
import env from './config/environment';

connectMongo().then(() => {
  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
});
