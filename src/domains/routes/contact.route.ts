import express from "express";
import EmailService from "../services/email.service";
import { AppError } from "../../libraries/error-handling/AppError";
const router = express.Router();
const emailService = new EmailService();
router.post("/", async (req, res, next) => {
  try {
    const { email, subject, body } = req.body;
    const emailHtml = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
          }
          h1 {
            color: #444;
          }
          p {
            margin: 0 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Contact Form Submission</h1>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${body}</p>
        </div>
      </body>
    </html>
  `;

    await emailService.sendEmail("shrafid.532@gmail.com", subject, emailHtml);
    res.json({
      message: "Success",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        "Error",
        `Failed to create new room: ${
          error instanceof Error ? error.message : "Unexpected error"
        }`,
        500
      );
    }
  }
});

export default router;
