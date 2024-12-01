import { z } from "zod";

// Enum validations
const RoomTypeEnum = z
  .enum(["SINGLE", "DOUBLE", "TWIN", "SUITE", "DELUXE", "PRESIDENTIAL"])
  .default("DOUBLE");
const RoomStatusEnum = z.enum([
  "AVAILABLE",
  "OCCUPIED",
  "MAINTENANCE",
  "RESERVED",
  "CLEANING",
]);
const BedTypeEnum = z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING", "TWIN"]);

// Bed schema
const BedSchema = z.object({
  bedType: BedTypeEnum,
  quantity: z.number().int().positive(),
  capacity: z.number().int().positive(),
});

// Main room creation schema
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: RoomTypeEnum,
  status: RoomStatusEnum.optional().default("AVAILABLE"),
  floor: z.number().int().positive("Floor must be a positive number"),
  capacity: z.number().int().positive().default(2),
  pricePerNight: z.number().positive("Price per night must be positive"),
  description: z.string().optional(),

  // Room features
  hasWifi: z.boolean().default(true),
  hasAC: z.boolean().default(true),
  hasTv: z.boolean().default(true),
  hasRefrigerator: z.boolean().default(true),

  // Dimensions and view
  squareFootage: z.number().positive().optional(),
  viewType: z.string().optional(),

  // Bed configuration
  beds: z
    .array(BedSchema)
    .min(1, "At least one bed configuration is required")
    .refine(
      (beds) => {
        // Calculate total capacity from beds
        const totalCapacity = beds.reduce(
          (sum, bed) => sum + bed.quantity * bed.capacity,
          0
        );
        return totalCapacity > 0;
      },
      {
        message: "Total bed capacity must be greater than 0",
      }
    ),
});
export const updateRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),
  type: RoomTypeEnum,
  status: RoomStatusEnum.optional().optional(),
  floor: z
    .number()
    .int()
    .positive("Floor must be a positive number")
    .optional(),
  capacity: z.number().int().positive().optional(),
  pricePerNight: z.number().optional(),
  description: z.string().optional(),
  // Room features
  hasWifi: z.boolean().optional(),
  hasAC: z.boolean().optional(),
  hasTv: z.boolean().optional(),
  hasRefrigerator: z.boolean().optional(),
  // Dimensions and view
  squareFootage: z.number().positive().optional(),
  viewType: z.string().optional(),
  // Bed configuration
  beds: z
    .array(BedSchema)
    .min(1, "At least one bed configuration is required")
    .refine(
      (beds) => {
        // Calculate total capacity from beds
        const totalCapacity = beds.reduce(
          (sum, bed) => sum + bed.quantity * bed.capacity,
          0
        );
        return totalCapacity > 0;
      },
      {
        message: "Total bed capacity must be greater than 0",
      }
    )
    .optional(),
});

// Type inference
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
