import { NextFunction, Request, Response } from "express";

import { BaseController } from "./base.controller";
import { AppError } from "../../libraries/error-handling/AppError";
import IssueRepository from "../repositories/issues.repositories";

export default class IssueController extends BaseController {
  private issueRepository: IssueRepository;

  constructor(issueRepository: IssueRepository) {
    super();
    this.issueRepository = issueRepository;
  }

  async createIssue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userPayload = req.user;
      const issue = await this.issueRepository.create({
        ...req.body,
        userId: userPayload.id,
      });
      this.sendSuccessResponse(res, issue);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async getAllIssues(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const issues = await this.issueRepository.getAll();
      this.sendSuccessResponse(res, issues);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
  async getAllIssuesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userPayload = req.user;
      const issues = await this.issueRepository.getAllByUser({
        userId: userPayload.id,
        roomId: req.params.id,
      });
      this.sendSuccessResponse(res, issues);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
  async getSingleIssue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const issue = await this.issueRepository.getById(id);
      this.sendSuccessResponse(res, issue);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async deleteIssue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const issue = await this.issueRepository.delete(id);
      this.sendSuccessResponse(res, issue);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async updateIssue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const issue = await this.issueRepository.update(id, req.body);
      this.sendSuccessResponse(res, issue);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
}
