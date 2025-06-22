import express from "express";
import prisma from "../../libraries/db/prisma";
import { checkAuth } from "../../middlewares/auth/checkAuth";
import { validateRequest } from "../../middlewares/request-validate";
import UserController from "../controllers/user.controller";
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  updatePasswordSchema,
} from "../interfaces/user.interface";
import UserRepository from "../repositories/user.repositories";

const router = express.Router();
const userRepository = new UserRepository(prisma);
const userController = new UserController(userRepository);

// SUPERADMIN routes
router.get(
  "/admin/users",
  checkAuth(["SUPERADMIN", "ADMIN"]),
  validateRequest({ schema: getUsersQuerySchema, isQuery: true }),
  (req, res, next) => userController.getUsers(req, res, next)
);

// User management routes
router.post(
  "/",

  checkAuth(["SUPERADMIN", "ADMIN"]),
  validateRequest({ schema: createUserSchema }),
  (req, res, next) => userController.createUser(req, res, next)
);

router.get("/profile", checkAuth(), (req, res, next) =>
  userController.getSingleUser(req, res, next)
);

router.patch(
  "/profile",
  checkAuth(),
  validateRequest({ schema: updateUserSchema }),
  (req, res, next) => userController.updateUser(req, res, next)
);

router.patch(
  "/profile/password",

  validateRequest({ schema: updatePasswordSchema }),
  (req, res, next) => userController.updatePassword(req, res, next)
);

// SUPERADMIN management routes
router.get(
  "/:id",

  checkAuth(["SUPERADMIN", "ADMIN"]),
  (req, res, next) => userController.getSingleUser(req, res, next)
);

router.patch(
  "/:id",
  checkAuth(["SUPERADMIN", "ADMIN"]),
  validateRequest({ schema: updateUserSchema }),
  (req, res, next) => userController.updateUser(req, res, next)
);

router.delete(
  "/:id",

  checkAuth(["SUPERADMIN", "ADMIN"]),
  (req, res, next) => userController.deleteUser(req, res, next)
);

router.post(
  "/:id/verify-email",

  checkAuth(["SUPERADMIN", "ADMIN"]),
  (req, res, next) => userController.verifyEmail(req, res, next)
);

router.post(
  "/:id/deactivate",

  checkAuth(["SUPERADMIN", "ADMIN"]),
  (req, res, next) => userController.deactivateUser(req, res, next)
);

router.post(
  "/:id/reactivate",

  checkAuth(["SUPERADMIN", "ADMIN"]),
  (req, res, next) => userController.reactivateUser(req, res, next)
);

export default router;
