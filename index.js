const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let latestData = {}; // to store the latest reading

// ✅ Route to receive data from ESP32
app.post("/api/data", (req, res) => {
  const { voltage, current } = req.body;
  if (!voltage || !current) {
    return res.status(400).json({ message: "Missing voltage or current" });
  }

  latestData = { voltage, current, time: new Date() };
  console.log("Received Data:", latestData);
  res.json({ message: "Data received successfully" });
});

// ✅ Route for mobile app to fetch latest reading
app.get("/api/data/latest", (req, res) => {
  res.json(latestData);
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Fault Detection Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
