import prisma from "./prisma/primsa-client";
import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./constants/env";
import errorHandler from "./middleware/error-handler";
import router from "./routes/router";
const { BoxClient, BoxDeveloperTokenAuth } = require("box-typescript-sdk-gen");

dotenv.config();

// start the webserver
const app = express();
prisma.$connect();
// Initialise middlewares
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(express.urlencoded({ extended: true })); // Allows parsing of URL-encoded request bodies
app.use(cors({ origin: process.env.APP_ORIGIN, credentials: true })); // Enable CORS, only allow requests from our frontend next.js app
app.use(cookieParser()); // Allows parsing of cookies in the request headers

app.use("/", router);

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
