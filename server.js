const express = require("express");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();

function getClientIp(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.ip
  );
}

app.use((req, res, next) => {
  if (!req.path.includes(".")) {
    console.log(`[PAGE VISIT] ${req.originalUrl} from ${getClientIp(req)}`);
  }
  next();
});

app.use("/", express.static("src"));
app.use(express.json({ limit: "10kb" }));

const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const submissions = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = submissions.get(ip);

  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    submissions.set(ip, { start: now, count: 1 });
    return false;
  }

  record.count += 1;
  return record.count > RATE_LIMIT_MAX;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of submissions) {
    if (now - record.start > RATE_LIMIT_WINDOW) submissions.delete(ip);
  }
}, RATE_LIMIT_WINDOW).unref();

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message, website } = req.body || {};
  const ip = getClientIp(req);

  // Bots fill hidden fields, so treat any value here as spam.
  if (website) {
    console.log(`[CONTACT] Blocked spam submission from ${ip}`);
    return res.sendStatus(200);
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    typeof email !== "string" ||
    !isValidEmail(email) ||
    email.length > 254 ||
    typeof subject !== "string" ||
    !subject.trim() ||
    subject.length > 200 ||
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 5000
  ) {
    return res.status(400).send("Invalid form data");
  }

  if (isRateLimited(ip)) {
    console.warn(`[CONTACT] Rate limited ${ip}`);
    return res.status(429).send("Too many requests");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: "abstractmelons@gmail.com",
      subject: `Portfolio: ${subject} (from ${name})`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    console.log(`[CONTACT] Message sent from ${ip}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error sending email:", err);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
