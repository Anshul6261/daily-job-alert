import nodemailer from "nodemailer";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function getJobs() {
  const query = "MERN stack developer remote OR India site:linkedin.com/jobs";
  const url = \`https://www.googleapis.com/customsearch/v1?q=\${encodeURIComponent(query)}&key=\${process.env.GOOGLE_API_KEY}&cx=\${process.env.SEARCH_ENGINE_ID}\`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) return [];

  return data.items.map((item, index) => {
    return \`\${index + 1}. \${item.title}\n\${item.link}\n\`;
  });
}

async function sendEmail(jobs) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: \`"MERN Job Bot" <\${process.env.GMAIL_USER}>\`,
    to: process.env.TO_EMAIL,
    subject: \`🔥 MERN Stack Jobs – \${new Date().toLocaleDateString()}\`,
    text: jobs.length ? jobs.join("\n\n") : "No jobs found today.",
  };

  await transporter.sendMail(mailOptions);
}

async function main() {
  const jobs = await getJobs();
  await sendEmail(jobs);
}

main();