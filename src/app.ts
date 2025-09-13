import { json, type Application } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import UserRouter from "@routes/user.js";
import { logger } from "@middlewares/logger.js";
import { errorHandler } from "@middlewares/errorHandler.js";

const App = (app: Application): void => {
    // Middlewares
    app.use(json());
    // app.use(morgan("dev"));

    // Database connection
    mongoose
        .connect(process.env.DB_URI || "mongodb://localhost:27017", {
            dbName: "express_crud",
        })
        .then(() => {
            console.log("Database connected");
        })
        .catch((error) => {
            console.log("Database connection error: ", error);
        });

    // Routes
    app.use("/api/users", logger, UserRouter);

    // Error handler
    app.use(errorHandler);
};

export default App;
