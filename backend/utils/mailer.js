const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(toEmail, username, password) {
  await resend.emails.send({
    from: "Recipe Recommender <onboarding@resend.dev>",
    to: toEmail,
    subject: "Welcome to Recipe Recommender — Account Created Successfully!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; border: 1px solid #00fff7; border-radius: 12px; padding: 32px; color: #e0e0e0;">
        <h1 style="color: #00fff7;">🍽️ Welcome to Recipe Recommender!</h1>
        <p style="color: #aaa;">Your account has been created successfully.</p>
        <hr style="border-color: rgba(0,255,247,0.2); margin: 24px 0;" />
        <h3 style="color: #fff;">Your Account Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.07); color: #aaa; width: 140px;">Username</td>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.04); color: #00fff7; font-weight: bold;">${username}</td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.05); color: #aaa;">Email</td>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.02); color: #fff;">${toEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.07); color: #aaa;">Password</td>
            <td style="padding: 10px 16px; background: rgba(0,255,247,0.04); color: #fff; font-family: monospace;">${password}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 14px 18px; background: rgba(255,153,0,0.08); border: 1px solid rgba(255,153,0,0.3); border-radius: 8px; color: #ffaa44; font-size: 13px;">
          ⚠️ Please keep your password safe. We recommend changing it after your first login.
        </div>
      </div>
    `,
  });
}

module.exports = { sendWelcomeEmail };