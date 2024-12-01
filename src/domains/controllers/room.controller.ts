import { NextFunction, Request, Response } from "express";
import RoomRepository from "../repositories/room.repositories";
import { BaseController } from "./base.controller";
import { AppError } from "../../libraries/error-handling/AppError";

export default class RoomController extends BaseController {
  private roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    super();
    this.roomRepository = roomRepository;
  }
  async creteRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const room = await this.roomRepository.create(req.body);
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
