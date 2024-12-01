import { Bed, PrismaClient, Room } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";
import { createRoomSchema } from "../interfaces/room.interface";

export default class RoomRepository extends BaseRepository<Room> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  async getAll(): Promise<Partial<Room>[]> {
    try {
      const rooms = await this.prisma.room.findMany({
        where: {},
      });
      return rooms;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get list of rooms: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async getById(id: string): Promise<Partial<Room> | null> {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
      });
      return room;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get the room info: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async create(data: Partial<Room> & Partial<Bed>): Promise<Partial<Room>> {
    // generate salt and hashed password
    // @ts-ignore
    const { beds, ...others } = data;

    try {
      const room = await this.prisma.room.create({
        // @ts-ignore
        data: {
          ...others,
          beds: {
            createMany: {
              data: beds,
            },
          },
        },
      });
      return room;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to create new room: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  update(id: string, data: Partial<Room>): Promise<Partial<Room>> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Partial<Room>> {
    throw new Error("Method not implemented.");
  }
}
