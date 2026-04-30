import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Ticketing System API",
      version: "1.0.0",
      description: "API documentation for the Movie Ticketing System",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "ERROR_CODE",
                },
                message: {
                  type: "string",
                  example: "Error message",
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/docs/*.yml"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
