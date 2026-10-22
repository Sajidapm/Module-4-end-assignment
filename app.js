
require("dotenv").config();

const express = require("express");
const userRouter = require("./routes/userProfileRoutes");
const authRoutes = require("./routes/authenticationRoutes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./data/db.js");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("User Management API is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);

// Error handler
app.use(errorHandler);

// Connect database and start server
connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
