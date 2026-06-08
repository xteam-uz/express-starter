import { once } from "node:events";
import { createServer, type Server } from "node:http";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createApp } from "../src/app.js";
import { InMemoryUserRepository } from "../src/modules/users/user.repository.js";

let server: Server;
let baseUrl: string;

const request = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = (await response.json()) as unknown;

  return { response, body };
};

before(async () => {
  const app = createApp({ userRepository: new InMemoryUserRepository() });
  server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Test server did not bind to a TCP port");
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  server.close();
  await once(server, "close");
});

describe("app", () => {
  it("returns liveness health", async () => {
    const { response, body } = await request("/health/live");

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ok" });
  });

  it("validates user creation payloads", async () => {
    const { response, body } = await request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "not-an-email",
        password: "short",
      }),
    });

    assert.equal(response.status, 400);
    assert.equal((body as { error: { code: string } }).error.code, "VALIDATION_ERROR");
  });

  it("creates users without exposing password hashes", async () => {
    const { response, body } = await request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "a-very-strong-password",
      }),
    });

    const data = (body as { data: Record<string, unknown> }).data;

    assert.equal(response.status, 201);
    assert.equal(data.name, "Ada Lovelace");
    assert.equal(data.email, "ada@example.com");
    assert.equal(data.password, undefined);
    assert.equal(data.passwordHash, undefined);
  });
});
