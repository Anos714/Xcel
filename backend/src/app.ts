import express, { type Request, type Response } from "express";

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

export default app;
