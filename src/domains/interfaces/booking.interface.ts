import { z } from "zod";

export const getAvailableBookingSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  capacityArray: z.array(
    z.object({
      capacity: z.number(),
    })
  ),
});
