import { json, type Application } from "express";
import restaurantsRouter from "@routes/restaurants.js";
import cusinisRouter from "@routes/cuisines.js";

const App = (app: Application): void => {
  app.use(json());

  // routes
  app.use("/api/restaurants", restaurantsRouter);
  app.use("/api/cusines", cusinisRouter);
};

export default App;
