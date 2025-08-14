const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
const upload = multer();

require("dotenv").config();

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
