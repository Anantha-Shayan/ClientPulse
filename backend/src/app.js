const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/requestLogger');
const { standardLimiter, authLimiter } = require('./middleware/rateLimiter');
const ApiError = require('./utils/ApiError');

const app = express();
const allowedOrigins = new Set(env.FRONTEND_URL);

if (env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new ApiError(403, 'CORS_FORBIDDEN', 'Origin is not allowed'));
  },
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(standardLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', apiRoutes);

app.use((_req, _res, next) => next(new ApiError(404, 'NOT_FOUND', 'Route not found')));
app.use(errorHandler);

module.exports = app;
