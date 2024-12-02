import { NextFunction, Request, Response } from "express";
import PaymentRepository from "../repositories/payment.repositories";
import { BaseController } from "./base.controller";
import { AppError } from "../../libraries/error-handling/AppError";

export default class PaymentController extends BaseController {
  private paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    super();
    this.paymentRepository = paymentRepository;
  }
  async createPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;

      const room = await this.paymentRepository.createPayment(
        bookingId,
        req.body,
        req.user
      );
      this.sendSuccessResponse(res, room);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
  // async updateRoom(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const room = await this.roomRepository.update(id, req.body);
  //     this.sendSuccessResponse(res, room);
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       this.sendErrorResponse(res, error);
  //     } else {
  //       next(error);
  //     }
  //   }
  // }
}
