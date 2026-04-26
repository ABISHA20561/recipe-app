// Authentication module - developed by ABISHA20561
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, modelUserId } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({
      username,
      email,
      password:    hashed,
      modelUserId: modelUserId ? parseInt(modelUserId) : null
    });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id:          user._id,
        username:    user.username,
        email:       user.email,
        modelUserId: user.modelUserId
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id:          user._id,
        username:    user.username,
        email:       user.email,
        modelUserId: user.modelUserId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;