const express = require("express");
const cors = require("cors");

const identifyRoutes = require("./routes/identifyRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/identify", identifyRoutes);

module.exports = app;