import dotenv from "dotenv";
dotenv.config();
import config from "../configs/index";

export const emailConfig = {
  host: config.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(config.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
};
