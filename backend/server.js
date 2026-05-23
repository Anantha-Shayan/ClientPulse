const app = require('./src/app');
const env = require('./src/config/env');
const prisma = require('./src/config/db.postgres');
const connectMongo = require('./src/config/db.mongo');
const logger = require('./src/middleware/requestLogger');

const start = async () => {
  await prisma.$connect();
  await connectMongo();
  app.listen(env.PORT, () => logger.info(`ClientPulse API running on port ${env.PORT}`));
};

start().catch((err) => {
  logger.error(err.stack || err.message);
  process.exit(1);
});
