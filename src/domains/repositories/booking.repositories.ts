import {
  bookRoomsSchema,
  getAvailableBookingSchema,
  getBookingsSchemaAdmin,
} from "./../interfaces/booking.interface";
import { Bed, Booking, PrismaClient, Room } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";
import { add, differenceInDays } from "date-fns";

export default class BookingRepository extends BaseRepository<Booking> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  async getAll(): Promise<Partial<Booking>[]> {
    throw new Error("Method not implemented.");
  }
  async getById(id: string): Promise<Partial<Booking> | null> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          rooms: {
            include: {
              room: true,
            },
          },
        },
      });
      return booking;
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
      const totalStay = differenceInDays(
        add(new Date(checkOutTime), {
          hours: 1,
        }),
        checkInTime
      );
      console.log(totalStay);
      const result = await prisma.$transaction(async (tx) => {
        for (const r of rooms) {
          // check whether room is booked or not , or whether room exists or not
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
          total += r.pricePerNight * totalStay;
          const { id, ...d } = r;
          roomInfo.push({ ...d, roomId: id });
        }
        const discount = others.discount ?? 0;
        const discountType = others.discountType ?? "Amount";
        const totalAmountWithDiscount =
          total -
          (discountType === "Amount" ? discount : (discount * total) / 100);
        const booking = await this.prisma.booking.create({
          data: {
            ...others,
            totalPrice: total,
            totalPriceWithDiscount: totalAmountWithDiscount,
            guestId,
            discount: discount ?? 0,
            discountType: discountType ?? "Amount",
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
  }
  async update(id: string, data: Partial<Booking>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<any> {
    try {
      const r = await this.prisma.$transaction([
        this.prisma.bookingRoom.deleteMany({
          where: {
            bookingId: id,
          },
        }),
        this.prisma.booking.delete({
          where: { id },
        }),
      ]);
      return r;
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
  async getAdminBookedRooms(
    data: z.infer<typeof getBookingsSchemaAdmin>
  ): Promise<Partial<Booking>[]> {
    try {
      let query = {};

      if (data.checkIn) {
        const checkInTime = add(new Date(data.checkIn), {
          hours: 12,
        });
        query = { checkIn: { gte: checkInTime } };
      }
      if (data.checkOut) {
        const checkOutTime = add(new Date(data.checkOut), {
          hours: 11,
        });
        query = { ...query, checkOut: { lte: checkOutTime } };
      }
      if (data.isPaid === true || data.isPaid === false) {
        query = { ...query, isPaid: data.isPaid };
      }
      if (data.guestId) {
        query = { ...query, guestId: data.guestId };
      }
      if (data.bookingStatus) {
        query = { ...query, status: data.bookingStatus };
      }
      if (data.roomId) {
        query = {
          ...query,
          rooms: {
            roomId: data.roomId,
          },
        };
      }

      const bookings = await this.prisma.booking.findMany({
        where: query,
        include: {
          rooms: {
            include: {
              room: {
                select: { roomNumber: true },
              },
            },
          },
        },
      });
      return bookings;
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
