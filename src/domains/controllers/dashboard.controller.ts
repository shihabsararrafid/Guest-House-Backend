import { NextFunction, Request, Response } from "express";
import { DashboardRepository } from "../repositories/dashboard.repositories";
import { BaseController } from "./base.controller";
import { AppError } from "../../libraries/error-handling/AppError";

export default class DashboardController extends BaseController {
  private dashboardRepository: DashboardRepository;

  constructor(dashboardRepository: DashboardRepository) {
    super();
    this.dashboardRepository = dashboardRepository;
  }
  async GetDashboardInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;

      const room = await this.dashboardRepository
        .GetDashboardInfo
        // bookingId,
        // req.body,
        // req.user
        ();
      this.sendSuccessResponse(res, room);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
}
