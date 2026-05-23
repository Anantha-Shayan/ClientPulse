const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClientPulse API',
      version: '1.0.0',
      description: 'RBAC project tracking API for digital transformation agencies'
    },
    servers: [{ url: '/api/v1' }]
  },
  apis: ['./src/routes/*.js']
});
