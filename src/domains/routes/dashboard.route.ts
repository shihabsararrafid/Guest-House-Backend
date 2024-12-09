import express from "express";
import prisma from "../../libraries/db/prisma";
import { DashboardRepository } from "../repositories/dashboard.repositories";
import DashboardController from "../controllers/dashboard.controller";
import { checkAuth } from "../../middlewares/auth/checkAuth";
const router = express.Router();
const dashboardRepository = new DashboardRepository(prisma);

const dashboardController = new DashboardController(dashboardRepository);

router.get(
  "/admin",
  checkAuth(["ADMIN"]),
  //   validateRequest({ schema: bookRoomsSchema }),
  (req, res, next) => dashboardController.GetDashboardInfo(req, res, next)
);

export default router;
