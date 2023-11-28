import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); //cors
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

// Convert the current module's URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, "../client/build")));

// Handle all other routes by serving the index.html from the build folder
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
