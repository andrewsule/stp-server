const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose.connect(process.env.MONGO_DB_LOCAL_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

const hostname = process.env.HOST_NAME;
const port = process.env.PORT;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use("/", require("./router"));

app.get("/", (req, res) => {
  res.json();
});

app.listen(port, hostname, () => {
  console.log(`Express server is started at http://${hostname}:${port}`);
});
