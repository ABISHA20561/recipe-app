const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connection.on("connected",    () => console.log(" MongoDB connected"));
mongoose.connection.on("disconnected", () => console.log(" MongoDB disconnected"));
mongoose.connection.on("error",    err => console.error(" MongoDB error:", err));


mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth",    require("./routes/auth"));
app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/quiz", require("./routes/quiz"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));