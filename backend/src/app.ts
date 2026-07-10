import express, { type Request, type Response } from "express";
import queryRouter from "./routes/query.route.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// routes
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Api is healthy",
  });
});
app.use("/api/v1/queries", queryRouter);

export default app;
