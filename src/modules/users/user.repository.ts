import { randomUUID } from "node:crypto";
import type { FilterQuery } from "mongoose";
import { UserModel, type UserDocument } from "./user.model.js";
import type { UserRecord, UserRepository } from "./user.types.js";

const toUserRecord = (document: UserDocument & { _id: unknown; id?: string }): UserRecord => ({
  id: String(document._id),
  name: document.name,
  email: document.email,
  passwordHash: document.passwordHash,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export class MongooseUserRepository implements UserRepository {
  async findAll(): Promise<UserRecord[]> {
    const users = await UserModel.find().select("+passwordHash").sort({ createdAt: -1 }).limit(100).exec();
    return users.map(toUserRecord);
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await UserModel.findById(id).select("+passwordHash").exec();
    return user ? toUserRecord(user) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await UserModel.findOne({ email } satisfies FilterQuery<UserDocument>).select("+passwordHash").exec();
    return user ? toUserRecord(user) : null;
  }

  async create(input: Omit<UserRecord, "id" | "createdAt" | "updatedAt">): Promise<UserRecord> {
    const user = await UserModel.create(input);
    const hydratedUser = await UserModel.findById(user._id).select("+passwordHash").orFail().exec();
    return toUserRecord(hydratedUser);
  }

  async update(
    id: string,
    input: Partial<Omit<UserRecord, "id" | "createdAt" | "updatedAt">>,
  ): Promise<UserRecord | null> {
    const user = await UserModel.findByIdAndUpdate(id, input, { new: true }).select("+passwordHash").exec();
    return user ? toUserRecord(user) : null;
  }

  async delete(id: string): Promise<UserRecord | null> {
    const user = await UserModel.findByIdAndDelete(id).select("+passwordHash").exec();
    return user ? toUserRecord(user) : null;
  }
}

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserRecord>();

  async findAll(): Promise<UserRecord[]> {
    return [...this.users.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const normalizedEmail = email.toLowerCase();
    return [...this.users.values()].find((user) => user.email === normalizedEmail) ?? null;
  }

  async create(input: Omit<UserRecord, "id" | "createdAt" | "updatedAt">): Promise<UserRecord> {
    const now = new Date();
    const user: UserRecord = {
      ...input,
      email: input.email.toLowerCase(),
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  async update(
    id: string,
    input: Partial<Omit<UserRecord, "id" | "createdAt" | "updatedAt">>,
  ): Promise<UserRecord | null> {
    const user = this.users.get(id);

    if (!user) {
      return null;
    }

    const updatedUser: UserRecord = {
      ...user,
      ...input,
      email: input.email?.toLowerCase() ?? user.email,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<UserRecord | null> {
    const user = this.users.get(id);

    if (!user) {
      return null;
    }

    this.users.delete(id);
    return user;
  }
}
