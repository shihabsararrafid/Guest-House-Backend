import { z } from "zod";

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
  //   capacityArray: z.array(
  //     z.object({
  //       capacity: z.number(),
  //     })
  //   ),
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
