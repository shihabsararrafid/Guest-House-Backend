import { Router } from "express";
import authRoutes from "./auth.route";
import roomRoutes from "./room.route";
import bookingRoutes from "./booking.route";
import paymentRoutes from "./payment.route";
import dashboardRoutes from "./dashboard.route";
import contactRoute from "./contact.route";
import userRoute from "./user.route";
const defineRoutes = async (expressRouter: Router) => {
  expressRouter.use("/auth", authRoutes);
  expressRouter.use("/room", roomRoutes);
  expressRouter.use("/booking", bookingRoutes);
  expressRouter.use("/payment", paymentRoutes);
  expressRouter.use("/dashboard", dashboardRoutes);
  expressRouter.use("/contact", contactRoute);
  expressRouter.use("/user", userRoute);
};

export default defineRoutes;
