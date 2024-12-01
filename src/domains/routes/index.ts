import { Router } from "express";
import authRoutes from "./auth.route";
import roomRoutes from "./room.route";
const defineRoutes = async (expressRouter: Router) => {
  expressRouter.use("/auth", authRoutes);
  expressRouter.use("/room", roomRoutes);
};

export default defineRoutes;
