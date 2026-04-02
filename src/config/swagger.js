const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventFlow User Service API",
      version: "1.0.0",
      description: "User authentication and profile management microservice",
      contact: { name: "EventFlow Team" },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: "Local development server",
      },
      {
        url: `https://eventflow-user-service-latest.onrender.com`,
        description: "Production",
      }
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
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@example.com" },
            password: { type: "string", minLength: 6, example: "secret123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "jane@example.com" },
            password: { type: "string", example: "secret123" },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Jane Smith" },
            email: { type: "string", format: "email", example: "janesmith@example.com" },
          },
        },
        UserProfile: {
          type: "object",
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", example: "jane@example.com" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            token: { type: "string" },
            user: { $ref: "#/components/schemas/UserProfile" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
