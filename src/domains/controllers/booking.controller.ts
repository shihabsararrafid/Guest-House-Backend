import { NextFunction, Request, Response } from "express";
import { AppError } from "../../libraries/error-handling/AppError";
import BookingRepository from "../repositories/booking.repositories";
import { BaseController } from "./base.controller";
import { z } from "zod";
import {
  bookRoomsSchema,
  getAvailableBookingSchema,
  getBookingsSchemaAdmin,
} from "../interfaces/booking.interface";
import { render } from "@react-email/components";
import React from "react";
import BookingConfirmationEmail from "../../react-mail-templates/booking-notification";
import EmailService from "../services/email.service";
type availableRoomsQuery = z.infer<typeof getAvailableBookingSchema>;
type bookRoomsSchema = z.infer<typeof bookRoomsSchema>;
type getAdminBookingsSchema = z.infer<typeof getBookingsSchemaAdmin>;
const emailService = new EmailService();

export default class BookingController extends BaseController {
  private bookingRepository: BookingRepository;
  constructor(bookingRepository: BookingRepository) {
    super();
    this.bookingRepository = bookingRepository;
  }
  async getAvailableRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const room = await this.bookingRepository.getAvailableRooms(
        req.query as unknown as availableRoomsQuery
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
  async bookRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userPayload = req.user;
      const room = await this.bookingRepository.bookRooms(
        req.body as unknown as bookRoomsSchema,
        userPayload
      );
      // console.log(room, "room");
      const {
        id,
        checkIn,
        checkOut,
        totalPrice,
        totalPriceWithDiscount,
        discount,
        discountType,
        paidAmount,
        status,
        rooms,
      } = room;
      // console.log(rooms);
      const d = rooms.map((r: any) => ({
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
        bookingId: id,
        checkIn,
        checkOut,
        totalPrice,
        totalPriceWithDiscount,
        discount,
        discountType,
        paidAmount,
        status,
        rooms: d,
      };
      // console.log(data);
      const emailHtml = await render(
        // @ts-ignore
        React.createElement(BookingConfirmationEmail, data)
      );
      // const html = await render(<WelcomeEmail />);
      emailService.sendEmail(
        "shrafid.532@gmail.com",
        "Your Booking Information",
        emailHtml
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
  async getBookedRoomsAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // console.log(req.body);
      const room = await this.bookingRepository.getAdminBookedRooms(
        req.query as unknown as getAdminBookingsSchema
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
  //   async getAllRooms(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     try {
  //       const rooms = await this.roomRepository.getAll();
  //       this.sendSuccessResponse(res, rooms);
  //     } catch (error) {
  //       if (error instanceof AppError) {
  //         this.sendErrorResponse(res, error);
  //       } else {
  //         next(error);
  //       }
  //     }
  //   }
  async getSingleBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const room = await this.bookingRepository.getById(id);
      this.sendSuccessResponse(res, room);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
  async deleteBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const room = await this.bookingRepository.delete(id);
      this.sendSuccessResponse(res, room);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
    async updateBookings(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const { id } = req.params;
        const room = await this.bookingRepository.update(id, req.body);
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
