import express from "express";
import { config } from "dotenv";
import { createClient } from "redis";

config();

const app = express();
app.use(express.json()); // to parse JSON request bodies

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis error:", err));

redisClient.connect();

// Routes

app.get("/", (req, res) => {
  res.send("Hello World ");
});

app.post("/add-name", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  await redisClient.rPush("names", name);
  res.status(201).json({ message: "Name added successfully" });
});

app.get("/names", async (_req, res) => {
  const names = await redisClient.lRange("names", 0, -1);
  res.json({ names });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
