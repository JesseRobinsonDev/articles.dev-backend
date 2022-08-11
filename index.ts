import express from "express";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes";
import articleRoutes from "./api/routes/articleRoutes";
import commentRoutes from "./api/routes/commentRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "30mb" }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  })
);

app.use("/user", userRoutes);
app.use("/article", articleRoutes);
app.use("/comment", commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
