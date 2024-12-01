import {
  bookRoomsSchema,
  getAvailableBookingSchema,
} from "./../interfaces/booking.interface";
import { Bed, Booking, PrismaClient, Room } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";
import { add } from "date-fns";

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
  async bookRooms(
    data: z.infer<typeof bookRoomsSchema>
  ): Promise<Partial<Booking>> {
    try {
      const { rooms, ...others } = data;
      let total = 0;
      console.log(others);
      const guestId = "cm3zd9gya0000ofi0zwwp6cmi";
      const roomInfo: {
        roomId: string;
        numberOfGuests: number;
        pricePerNight: number;
      }[] = [];
      const checkInTime = add(new Date(others.checkIn), {
        hours: 12,
      });
      const checkOutTime = add(new Date(others.checkOut), {
        hours: 11,
      });
      const result = await prisma.$transaction(async (tx) => {
        for (const r of rooms) {
          const room = await tx.room.findUnique({
            where: {
              id: r.id,
              bookings: {
                none: {
                  booking: {
                    AND: [
                      { checkIn: { lte: checkOutTime } },
                      { checkOut: { gte: checkInTime } },
                    ],
                  },
                },
              },
            },
            select: {
              pricePerNight: true,
            },
          });
          if (!room) {
            throw new AppError(
              "db-error",
              "Room not found or already it is been reserved",
              404
            );
          }
          total += room.pricePerNight;
          const { id, ...d } = r;
          roomInfo.push({ ...d, roomId: id });
        }
        const booking = await this.prisma.booking.create({
          data: {
            ...others,
            totalPrice: total,
            guestId,
            discount: others.discount ?? 0,
            discountType: others.discountType ?? "Amount",
            checkIn: checkInTime,
            checkOut: checkOutTime,
            rooms: {
              createMany: {
                data: roomInfo,
              },
            },
          },
        });
        return booking;
      });
      return result;
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
      const checkInTime = add(new Date(checkIn), {
        hours: 12,
      });
      const checkOutTime = add(new Date(checkOut), {
        hours: 11,
      });
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
              booking: {
                AND: [
                  { checkIn: { lte: checkOutTime } },
                  { checkOut: { gte: checkInTime } },
                ],
              },
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
