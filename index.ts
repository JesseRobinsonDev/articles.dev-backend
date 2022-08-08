import express from "express";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "30mb" }));

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
