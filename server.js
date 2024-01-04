import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/data_routes.js";
import jwt from "jsonwebtoken";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(cors());

// initialize middleware
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send({ message: "Server is running" }));

// use routes
app.use("/api/", router);

// setting up port
const PORT = process.env.PORT || 8000;

// Swagger documentation setup
const swaggerFile = fs.readFileSync("./documentation/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(swaggerFile);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => app.listen(PORT))
  .then(() => console.log(`Connected to DataBase and listening at port ${PORT}`))
  .catch((err) => console.log(err));

export default app;
