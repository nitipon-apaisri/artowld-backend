import "dotenv/config";
import express, { Express, Request, Response } from "express";
import logger from "./middlewares/logger";
import router from "./routes";
const app: Express = express();
const port = process.env.PORT || 1997;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api", router);
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});
const run = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
};

if (process.env.NODE_ENV !== "test") {
    run();
}
export default app;
