const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const server = express();

// Hardcoded Environment Variables (Included in code as requested)
const PORT = 5000;
const MONGO_URI = "mongodb+srv://sobika0505:Sobika04052005@sobika.ufmnkvg.mongodb.net/Finance_tracking";
const JWT_SECRET = "finance_super_secret_key";

server.use(express.json());
server.use(cors());

// Routes
const authRouter = require("./routes/authrouter");
const transactionRouter = require("./routes/transcationrouter");
const userRouter = require("./routes/userrouter");
const dashboardRouter = require("./routes/dashboardrouter");

server.use("/auth", authRouter);
server.use("/transaction", transactionRouter);
server.use("/user", userRouter);
server.use("/dashboard", dashboardRouter);

// MongoDB connect
mongoose.connect("mongodb+srv://sobika0505:Sobika04052005@sobika.ufmnkvg.mongodb.net/Finance_tracking")
  .then(() => console.log("MongoDB Connected..."))
  .catch(() => console.log("MongoDB Not Connected.."));

// Server running
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
