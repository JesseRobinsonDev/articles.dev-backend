import express from "express";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes";
import articleRoutes from "./api/routes/articleRoutes";
import commentRoutes from "./api/routes/commentRoutes";
import cors from "cors";
import { Request, Response } from "express";

//dotenv.config();

const app = express();
const port = process.env.PORT;
const origin = process.env.ORIGIN;

app.use(express.json({ limit: "30mb" }));

app.use(
  cors({
    origin: origin,
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  })
);

// Add routes to express app
app.use("/user", userRoutes);
app.use("/article", articleRoutes);
app.use("/comment", commentRoutes);

app.get("/", (req: Request, res: Response) => {
  console.log("API V1.0");
  return res.status(200).json("Success");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
