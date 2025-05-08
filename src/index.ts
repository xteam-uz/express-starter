import express from "express";
import { SERVER } from "./config/config.js";
import App from "./app.js";

const app = express();

App(app);

app
  .listen(SERVER.SERVER_PORT, () =>
    console.log(
      `Server running on http://${SERVER.SERVER_HOST}:${SERVER.SERVER_PORT}`
    )
  )
  .on("error", (error) => {
    throw new Error(error.message);
  });
