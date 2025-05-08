import express from "express";
import { SERVER } from "./config/config.js";

const app = express();

app.use("/", (req, res) => {
  res.status(200).json({ msg: "Hello World" });
});

app
  .listen(SERVER.SERVER_PORT, () =>
    console.log(
      `Server running on http://${SERVER.SERVER_HOST}:${SERVER.SERVER_PORT}`
    )
  )
  .on("error", (error) => {
    throw new Error(error.message);
  });
