import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StockPilot API",
      version: "1.0.0",
      description: `
        StockPilot - Inventory Management System for SMEs.
        
        ## Roles & Permissions
        - **Owner/Admin** → Full access to everything
        - **Manager** → Products, stock, operational reports
        - **Attendant** → View products & record sales only
        
        ## Authentication
        All protected routes require a Bearer token in the header:
        \`Authorization: Bearer your_token_here\`
      `,
      contact: {
        name: "StockPilot Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api`,
        description: "Development server",
      },
      {
        url: `https://your-render-url.onrender.com/api`,
        description: "Production server",
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
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

export const specs = swaggerJsdoc(options);
