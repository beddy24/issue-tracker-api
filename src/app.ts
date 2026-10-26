import express, { type NextFunction, type Request, type Response} from "express";
import { authRouter } from "./auth/users.routes";

export const app = express();
app.use(express.json());

app.get("/health", (_req, res)=> res.json({status: "ok"}));
app.use("/auth", authRouter)


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});