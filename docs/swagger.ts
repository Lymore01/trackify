import swaggerJsDocs from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trackify API with Swagger",
      version: "0.1.0",
      description:
        "Trackify simplifies URL shortening and click tracking with analytics for smarter link management.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["../src/routes/auth/login.ts"],
  encoding: "utf-8",
  failOnErrors: true,
  verbose: false,
  format: "json",
};

const specs = swaggerJsDocs(options);
function swaggerDocs(app: Express, port: number) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
export default swaggerDocs;
