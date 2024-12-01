import { Router } from "express";
import authRoutes from "./auth.route";
import roomRoutes from "./room.route";
import bookingRoutes from "./booking.route";
const defineRoutes = async (expressRouter: Router) => {
  expressRouter.use("/auth", authRoutes);
  expressRouter.use("/room", roomRoutes);
  expressRouter.use("/booking", bookingRoutes);
};

export default defineRoutes;
