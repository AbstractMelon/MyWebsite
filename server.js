const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const upload = multer();

require("dotenv").config();

app.use((req, res, next) => {
  if (!req.path.includes(".")) {
    const ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      req.ip;

    console.log(`[PAGE VISIT] ${req.originalUrl} from ${ip}`);
  }

  next();
});

app.use("/", express.static("src"));

app.use(express.json());

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Received contact form data:", { name, email, subject, message });

  try {
    // Configure email transporter
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

    console.log("Email sent successfully");

    res.sendStatus(200);
  } catch (err) {
    console.error("Error sending email:", err);
    res.sendStatus(500);
  }
});

// Jam in a Jiffy
app.get("/jam/jiffy-theme", (req, res) => {
  // Jam start/end in MDT (UTC-6)
  const start = new Date("2025-09-06T08:00:00-06:00");
  const end = new Date("2025-09-06T20:00:00-06:00");
  const now = new Date();

  // Choose the image based on time
  const imageFile =
    now >= start && now <= end
      ? "jam_theme.png" // Jam live
      : "jam_soon.png"; // Before or after jam

  res.sendFile(path.join(__dirname, "src", "assets", "jam", imageFile));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
