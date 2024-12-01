import { PrismaClient, Room } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";

export default class RoomRepository extends BaseRepository<Room> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  getAll(): Promise<Partial<Room>[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<Partial<Room> | null> {
    throw new Error("Method not implemented.");
  }
  async create(data: any): Promise<Partial<Room>> {
    // generate salt and hashed password
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
