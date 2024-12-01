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
