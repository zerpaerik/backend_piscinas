import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Piscinas API',
      version: '1.0.0',
      description: 'API RESTful para gestión de piscinas y usuarios',
    },
    servers: [
      { url: 'http://localhost:4000/api' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/routes/*.ts',
    './src/models/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
