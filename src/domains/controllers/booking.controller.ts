import { NextFunction, Request, Response } from "express";
import { AppError } from "../../libraries/error-handling/AppError";
import BookingRepository from "../repositories/booking.repositories";
import { BaseController } from "./base.controller";
import { z } from "zod";
import { getAvailableBookingSchema } from "../interfaces/booking.interface";
type availableRoomsQuery = z.infer<typeof getAvailableBookingSchema>;
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
  //   async getSingleRoom(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     try {
  //       const { id } = req.params;
  //       const room = await this.roomRepository.getById(id);
  //       this.sendSuccessResponse(res, room);
  //     } catch (error) {
  //       if (error instanceof AppError) {
  //         this.sendErrorResponse(res, error);
  //       } else {
  //         next(error);
  //       }
  //     }
  //   }
  //   async deleteRoom(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     try {
  //       const { id } = req.params;
  //       const room = await this.roomRepository.delete(id);
  //       this.sendSuccessResponse(res, room);
  //     } catch (error) {
  //       if (error instanceof AppError) {
  //         this.sendErrorResponse(res, error);
  //       } else {
  //         next(error);
  //       }
  //     }
  //   }
  //   async updateRoom(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> {
  //     try {
  //       const { id } = req.params;
  //       const room = await this.roomRepository.update(id, req.body);
  //       this.sendSuccessResponse(res, room);
  //     } catch (error) {
  //       if (error instanceof AppError) {
  //         this.sendErrorResponse(res, error);
  //       } else {
  //         next(error);
  //       }
  //     }
  //   }
}
