// dependencies
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";

// routers
import blogRoutes from "./routes/blogRoutes";

// utils
dotenv.config();
const app = express();
const PORT = process.env.NODE_PORT;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(blogRoutes);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
