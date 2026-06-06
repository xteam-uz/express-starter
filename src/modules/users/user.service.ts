import { hashPassword } from "./password.js";
import { ConflictError, NotFoundError } from "@shared/errors/app-error.js";
import type { CreateUserInput, PublicUser, UpdateUserInput, UserRecord, UserRepository } from "./user.types.js";

const toPublicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.users.findAll();
    return users.map(toPublicUser);
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.users.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return toPublicUser(user);
  }

  async create(input: CreateUserInput): Promise<PublicUser> {
    const existingUser = await this.users.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError("Email is already registered");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return toPublicUser(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<PublicUser> {
    const passwordHash = input.password ? await hashPassword(input.password) : undefined;
    const updatedUser = await this.users.update(id, {
      ...(input.name ? { name: input.name } : {}),
      ...(input.email ? { email: input.email } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return toPublicUser(updatedUser);
  }

  async delete(id: string): Promise<PublicUser> {
    const deletedUser = await this.users.delete(id);

    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    return toPublicUser(deletedUser);
  }
}
