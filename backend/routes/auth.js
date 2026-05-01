// backend/routes/auth.js
// ── ONLY CHANGE from original: added sendWelcomeEmail call in /register ──

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

// ── NEW: import the mailer ──
const { sendWelcomeEmail } = require("../utils/mailer");

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, modelUserId } = req.body;

    // hash AFTER saving plain text for the email
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password:    hashed,
      modelUserId: modelUserId ? parseInt(modelUserId) : null,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ── NEW: send welcome email (don't await — don't block the response) ──
    sendWelcomeEmail(email, username, password).catch(err =>
      console.error("Welcome email failed:", err.message)
    );

    res.json({
      token,
      user: {
        id:          user._id,
        username:    user.username,
        email:       user.email,
        modelUserId: user.modelUserId,
      },
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// LOGIN  (no changes here)
// ─────────────────────────────────────────
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
        modelUserId: user.modelUserId,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
