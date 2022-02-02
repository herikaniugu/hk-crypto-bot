const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// TIMEZONE
process.env.TZ = "Africa/Dar_es_Salaam";

// SETUP
require("dotenv").config();
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API
app.use("/trade", require("./server/trade"));
app.use("/balance", require("./server/balance"));
app.use("/cancel", require("./server/cancel"));
app.use("/setup", require("./server/setup"));
app.use("/backtest", require("./server/backtest"));

// LISTEN
app.listen(port, () => {
	console.log("Server listening to port %s", port);
});

// CATCH
process.on("uncaughtException", (error) => {
	console.log(`Uncaught Exception: ${error.message}`);
	process.exit(1);
});