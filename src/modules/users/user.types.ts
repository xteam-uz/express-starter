export type UserId = string;

export type UserRecord = {
  id: UserId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicUser = Omit<UserRecord, "passwordHash">;

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserInput = Partial<Pick<CreateUserInput, "name" | "email" | "password">>;

export type UserRepository = {
  findAll(): Promise<UserRecord[]>;
  findById(id: UserId): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  create(input: Omit<UserRecord, "id" | "createdAt" | "updatedAt">): Promise<UserRecord>;
  update(id: UserId, input: Partial<Omit<UserRecord, "id" | "createdAt" | "updatedAt">>): Promise<UserRecord | null>;
  delete(id: UserId): Promise<UserRecord | null>;
};
