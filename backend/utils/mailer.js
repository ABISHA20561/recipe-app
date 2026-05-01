// backend/utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,                        // ← switch from service:"gmail" to explicit
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ← ADD THIS — runs once on server startup, shows error in Render logs
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer config error:", error.message);
  } else {
    console.log("✅ Mailer is ready to send emails");
  }
});

/**
 * Sends a welcome email after successful registration.
 * @param {string} toEmail   - recipient's email
 * @param {string} username  - their chosen username
 * @param {string} password  - their plain-text password (before hashing)
 */
async function sendWelcomeEmail(toEmail, username, password) {
  const mailOptions = {
    from: `"Recipe Recommender 🍽️" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to Recipe Recommender — Account Created Successfully!",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        background: #0a0a1a;
        border: 1px solid #00fff7;
        border-radius: 12px;
        padding: 32px;
        color: #e0e0e0;
      ">
        <h1 style="color: #00fff7; margin-bottom: 4px;">
          🍽️ Welcome to Recipe Recommender!
        </h1>
        <p style="color: #aaa; margin-top: 0;">Your account has been created successfully.</p>

        <hr style="border-color: rgba(0,255,247,0.2); margin: 24px 0;" />

        <h3 style="color: #fff; margin-bottom: 16px;">Your Account Details</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.07); color: #aaa; width: 140px; border-radius: 6px 0 0 0;">
              Username
            </td>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.04); color: #00fff7; font-weight: bold; border-radius: 0 6px 0 0;">
              ${username}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.05); color: #aaa;">
              Email
            </td>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.02); color: #fff;">
              ${toEmail}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.07); color: #aaa; border-radius: 0 0 0 6px;">
              Password
            </td>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.04); color: #fff; font-family: monospace; letter-spacing: 2px; border-radius: 0 0 6px 0;">
              ${password}
            </td>
          </tr>
        </table>

        <div style="
          margin-top: 24px;
          padding: 14px 18px;
          background: rgba(255,153,0,0.08);
          border: 1px solid rgba(255,153,0,0.3);
          border-radius: 8px;
          color: #ffaa44;
          font-size: 13px;
        ">
          ⚠️ Please keep your password safe. Do not share it with anyone.
          We recommend changing it after your first login.
        </div>

        <hr style="border-color: rgba(0,255,247,0.1); margin: 28px 0;" />

        <p style="color: #555; font-size: 12px; text-align: center; margin: 0;">
          This is an automated message from Recipe Recommender (P2D+QNN+FL).<br/>
          If you did not create this account, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
