import type { RequestHandler } from "express";
import type { UserService } from "./user.service.js";
import type { CreateUserBody, UpdateUserBody } from "./user.schemas.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  findAll: RequestHandler = async (_req, res) => {
    const users = await this.userService.findAll();
    res.status(200).json({ data: users });
  };

  findById: RequestHandler<{ id: string }> = async (req, res) => {
    const user = await this.userService.findById(req.params.id);
    res.status(200).json({ data: user });
  };

  create: RequestHandler<Record<string, never>, unknown, CreateUserBody> = async (req, res) => {
    const user = await this.userService.create(req.body);
    res.status(201).json({ data: user });
  };

  update: RequestHandler<{ id: string }, unknown, UpdateUserBody> = async (req, res) => {
    const user = await this.userService.update(req.params.id, req.body);
    res.status(200).json({ data: user });
  };

  delete: RequestHandler<{ id: string }> = async (req, res) => {
    const user = await this.userService.delete(req.params.id);
    res.status(200).json({ data: user });
  };
}
