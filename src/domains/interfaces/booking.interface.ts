import { z } from "zod";
const BookingStatusEnum = z
  .enum(["PENDING", "CONFIRMED", "CANCELLED", "ON_GOING", "COMPLETED"])
  .optional();

export const getAvailableBookingSchema = z.object({
  checkIn: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: "Invalid date format",
    }),
  checkOut: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: "Invalid date format",
    }),
  capacity: z.string(),
});

export const bookRoomsSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  discount: z.number().default(0),
  discountType: z.enum(["Percentage", "Amount"]).default("Percentage"),
  bookedMoney: z.number().default(0),
  paidAmount: z.number().default(0),
  rooms: z.array(
    z.object({
      id: z.string(),
      numberOfGuests: z.number(),
      pricePerNight: z.number(),
    })
  ),
});
export const updateBookingSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  discount: z.number().default(0),
  discountType: z.enum(["Percentage", "Amount"]).default("Percentage"),
  bookedMoney: z.number().default(0),
  paidAmount: z.number().default(0),
});
export const getBookingsSchemaAdmin = z.object({
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  isPaid: z.coerce.boolean().optional(),
  bookingStatus: BookingStatusEnum,
  guestId: z.string().optional(),
  roomId: z.string().optional(),
});
