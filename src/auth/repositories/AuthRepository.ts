import { $Enums, PrismaClient, User } from "@prisma/client";
import { BaseRepository } from "../../domains/repositories/BaseRepositories";
import bcrypt from "bcrypt";
import { errorHandler } from "../../libraries/error-handling";
import { AppError } from "../../libraries/error-handling/AppError";

export default class AuthRepository extends BaseRepository<User> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  getAll(): Promise<Partial<User>[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<Partial<User> | null> {
    throw new Error("Method not implemented.");
  }
  async create(data: {
    role: $Enums.Role;
    email: string;
    username: string | null;
    password: string;
  }): Promise<Partial<User>> {
    // generate salt and hashed password

    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(data.password, salt);
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (user)
        throw new AppError(
          "database-error",
          "User already Exists with the email",
          409
        );
      return this.prisma.user.create({
        data: { ...data, salt },
      });
    } catch (error) {
      await errorHandler.handleError(error);
      throw new AppError("database-error", "Failed to fetch all users");
    }
  }
  update(id: string, data: Partial<User>): Promise<Partial<User>> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Partial<User>> {
    throw new Error("Method not implemented.");
  }
}
