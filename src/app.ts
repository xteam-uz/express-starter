import { json, type Application, type Request, type Response } from "express";

const App = (app: Application): void => {
    app.use(json());

    // routes
    app.get("/api/hello", (req: Request, res: Response) => {
        res.status(200).json({ msg: "Hello World" });
    });
};

export default App;
