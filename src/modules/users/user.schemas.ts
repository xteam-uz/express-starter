import { ValidationError } from "@shared/errors/app-error.js";

export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserBody = Partial<CreateUserBody>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (
  source: Record<string, unknown>,
  key: string,
  options: { min?: number; max?: number; required?: boolean } = {},
): string | undefined => {
  const value = source[key];

  if (value === undefined || value === null) {
    if (options.required) {
      throw new ValidationError([{ path: key, message: `${key} is required` }]);
    }

    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError([{ path: key, message: `${key} must be a string` }]);
  }

  const trimmedValue = value.trim();

  if (options.min !== undefined && trimmedValue.length < options.min) {
    throw new ValidationError([{ path: key, message: `${key} must be at least ${options.min} characters` }]);
  }

  if (options.max !== undefined && trimmedValue.length > options.max) {
    throw new ValidationError([{ path: key, message: `${key} must be at most ${options.max} characters` }]);
  }

  return trimmedValue;
};

const readEmail = (source: Record<string, unknown>, required: boolean): string | undefined => {
  const email = readString(source, "email", { required, max: 254 });

  if (!email) {
    return undefined;
  }

  const normalizedEmail = email.toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new ValidationError([{ path: "email", message: "email must be valid" }]);
  }

  return normalizedEmail;
};

export const userIdParamsSchema = {
  parse(value: unknown): { id: string } {
    if (!isRecord(value)) {
      throw new ValidationError([{ path: "params", message: "params must be an object" }]);
    }

    const id = readString(value, "id", { required: true, min: 1 });
    return { id: id as string };
  },
};

export const createUserBodySchema = {
  parse(value: unknown): CreateUserBody {
    if (!isRecord(value)) {
      throw new ValidationError([{ path: "body", message: "body must be an object" }]);
    }

    return {
      name: readString(value, "name", { required: true, min: 1, max: 100 }) as string,
      email: readEmail(value, true) as string,
      password: readString(value, "password", { required: true, min: 12, max: 128 }) as string,
    };
  },
};

export const updateUserBodySchema = {
  parse(value: unknown): UpdateUserBody {
    if (!isRecord(value)) {
      throw new ValidationError([{ path: "body", message: "body must be an object" }]);
    }

    const update: UpdateUserBody = {
      ...(value.name !== undefined
        ? { name: readString(value, "name", { min: 1, max: 100 }) as string }
        : {}),
      ...(value.email !== undefined ? { email: readEmail(value, false) as string } : {}),
      ...(value.password !== undefined
        ? { password: readString(value, "password", { min: 12, max: 128 }) as string }
        : {}),
    };

    if (Object.keys(update).length === 0) {
      throw new ValidationError([{ path: "body", message: "At least one field must be provided" }]);
    }

    return update;
  },
};
