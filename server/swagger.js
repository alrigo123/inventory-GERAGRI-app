// server/swagger.js
import swaggerJSDoc  from 'swagger-jsdoc';
import swaggerUi     from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory GERAGRI API',
      version: '1.0.0',
      description: 'REST endpoints for the inventory app'
    },
  },
  apis: ['./routes/*.js'],  // adjust as needed
};

const swaggerSpec = swaggerJSDoc(options);

// export a named initializer
export function initSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
