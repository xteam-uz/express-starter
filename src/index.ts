import express from "express";
import { SERVER_HOST, SERVER_PORT } from "@config/config.js";
import App from "./app.js";

const app = express();

App(app);

app
  .listen(SERVER_PORT || 8000, () =>
    console.log(`Server running on http://${SERVER_HOST}:${SERVER_PORT}`),
  )
  .on("error", (error) => {
    throw new Error(error.message);
  });
