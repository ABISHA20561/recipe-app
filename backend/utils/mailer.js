const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(toEmail, username, password) {
  await resend.emails.send({
    from: "Recipe Recommender <onboarding@resend.dev>",  // works without domain verification
    to: toEmail,
    subject: "Welcome to Recipe Recommender — Account Created Successfully!",
    html: `your existing html here...`,
  });
}

module.exports = { sendWelcomeEmail };