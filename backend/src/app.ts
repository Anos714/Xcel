import express, { type Request, type Response } from "express";
import queryRouter from "./routes/query.route.js";
import automationRouter from "./routes/automation.routes.js";
import tweetRouter from './routes/tweet.route.js'
import settingRouter from './routes/settings.route.js'
import dashboardRouter from './routes/dashboard.route.js'

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Api is healthy",
  });
});
app.use("/api/v1/queries", queryRouter);
app.use("/api/v1/automation", automationRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/settings",settingRouter);
app.use("/api/v1/dashboard",dashboardRouter)


export default app;
