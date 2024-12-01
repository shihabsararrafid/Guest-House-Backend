import { getAvailableBookingSchema } from "./../interfaces/booking.interface";
import { Bed, Booking, PrismaClient, Room } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";

export default class BookingRepository extends BaseRepository<Booking> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  async getAll(): Promise<Partial<Booking>[]> {
    // try {
    //   const rooms = await this.prisma.room.findMany({
    //     where: {},
    //   });
    //   return rooms;
    // } catch (error) {
    //   if (error instanceof AppError) {
    //     throw error;
    //   } else {
    //     throw new AppError(
    //       "database-error",
    //       `Failed to get list of rooms: ${
    //         error instanceof Error ? error.message : "Unexpected error"
    //       }`,
    //       500
    //     );
    //   }
    // }
    throw new Error("Method not implemented.");
  }
  async getById(id: string): Promise<Partial<Booking> | null> {
    // try {
    //   const room = await this.prisma.room.findUnique({
    //     where: { id },
    //   });
    //   return room;
    // } catch (error) {
    //   if (error instanceof AppError) {
    //     throw error;
    //   } else {
    //     throw new AppError(
    //       "database-error",
    //       `Failed to get the room info: ${
    //         error instanceof Error ? error.message : "Unexpected error"
    //       }`,
    //       500
    //     );
    //   }
    // }
    throw new Error("Method not implemented.");
  }
  async create(data: Partial<Booking>): Promise<Partial<Booking>> {
    // generate salt and hashed password
    // @ts-ignore
    // const { beds, ...others } = data;

    // try {
    //   const room = await this.prisma.room.create({
    //     // @ts-ignore
    //     data: {
    //       ...others,
    //       beds: {
    //         createMany: {
    //           data: beds,
    //         },
    //       },
    //     },
    //   });
    //   return room;
    // } catch (error) {
    //   if (error instanceof AppError) {
    //     throw error;
    //   } else {
    //     throw new AppError(
    //       "database-error",
    //       `Failed to create new room: ${
    //         error instanceof Error ? error.message : "Unexpected error"
    //       }`,
    //       500
    //     );
    //   }
    // }
    throw new Error("Method not implemented.");
  }
  async update(id: string, data: Partial<Booking>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async getAvailableRooms(
    query: z.infer<typeof getAvailableBookingSchema>
  ): Promise<any> {
    try {
      const { checkIn, checkOut, capacity } = query;
      const checkInTime = new Date(checkIn);
      const checkOutTime = new Date(checkOut);
      const capacityArray = (JSON.parse(capacity) as number[]).sort(
        (a, b) => a - b
      );
      const len = capacityArray.length;
      const lowCapacity = capacityArray[0];
      const highCapacity = capacityArray[len - 1];
      const roomsAvailableForDates = await prisma.room.findMany({
        where: {
          bookings: {
            none: {
              AND: [
                { checkIn: { lte: checkInTime } },
                { checkOut: { gte: checkOutTime } },
              ],
            },
          },
          OR: [{ capacity: { gte: lowCapacity, lte: highCapacity } }],
        },
      });
      return roomsAvailableForDates;
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
}
