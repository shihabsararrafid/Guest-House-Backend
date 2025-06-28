// issues.route.ts
import express from "express";
import prisma from "../../libraries/db/prisma";
import { validateRequest } from "../../middlewares/request-validate";

import { checkAuth } from "../../middlewares/auth/checkAuth";
import IssueRepository from "../repositories/issues.repositories";
import IssueController from "../controllers/issues.controller";
import {
  createIssueSchema,
  updateIssueSchema,
} from "../interfaces/issues.interface";

const router = express.Router();
const issueRepository = new IssueRepository(prisma);

const issueController = new IssueController(issueRepository);

router.post(
  "/create-issue",
  checkAuth(),
  validateRequest({ schema: createIssueSchema }),
  (req, res, next) => issueController.createIssue(req, res, next)
);

router.get("/get-all-issues-by-user/:id", checkAuth(), (req, res, next) =>
  issueController.getAllIssuesByUser(req, res, next)
);
router.get(
  "/get-all-issues",
  checkAuth(["ADMIN", "RECEPTIONIST"]),
  (req, res, next) => issueController.getAllIssues(req, res, next)
);
router.get("/:id", (req, res, next) =>
  issueController.getSingleIssue(req, res, next)
);
router.delete("/:id", checkAuth(["ADMIN", "RECEPTIONIST"]), (req, res, next) =>
  issueController.deleteIssue(req, res, next)
);
router.patch(
  "/:id",
  checkAuth(["ADMIN", "RECEPTIONIST"]),
  validateRequest({ schema: updateIssueSchema }),
  (req, res, next) => issueController.updateIssue(req, res, next)
);

export default router;
