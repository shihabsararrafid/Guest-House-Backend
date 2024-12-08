import { NextFunction, Request, Response } from "express";
import PaymentRepository from "../repositories/payment.repositories";
import { BaseController } from "./base.controller";
import { AppError } from "../../libraries/error-handling/AppError";
import { render } from "@react-email/components";
import ConfirmBookingEmail from "../../react-mail-templates/confirm-payment";
import EmailService from "../services/email.service";
import React from "react";
const emailService = new EmailService();
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
  async confirmPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { paymentId } = req.params;

      const room = await this.paymentRepository.confirmPayment(
        paymentId,
        req.body,
        req.user
      );
      // console.log(rooms);
      const d = room?.booking?.rooms.map((r: any) => ({
        roomNumber: r.room.roomNumber,
        pricePerNight: r.pricePerNight,
        numberOfGuests: r.numberOfGuests,
        specialRequests: r.specialRequests,
        hasWifi: r.room.hasWifi,
        hasAC: r.room.hasAC,
        hasTv: r.room.hasTv,
        hasRefrigerator: r.room.hasRefrigerator,
      }));
      const data = {
        booking: {
          id: room?.booking?.id,
          checkIn: room?.booking?.checkIn,
          checkOut: room?.booking?.checkOut,
          totalPrice: room?.booking?.totalPrice,
          rooms: d,
        },
        payment: {
          id: room?.id,
          amount: room?.amount,
          status: room?.status,
          stripeReceiptUrl: null,
        },
      };
      // Handle email sending in a try-catch block that won't affect the main flow
      try {
        const emailHtml = await render(
          // @ts-ignore
          React.createElement(ConfirmBookingEmail, data)
        );

        await emailService.sendEmail(
          "shrafid.532@gmail.com",
          "Your Booking Information",
          emailHtml
        );
      } catch (emailError) {
        // Log the error but don't throw it
        console.error("Failed to send confirmation email:", emailError);
        // Optionally, you could log this to a monitoring service or error tracking system
      }

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
