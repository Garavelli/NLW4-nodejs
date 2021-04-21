import request from 'supertest';
import {app} from '../app';

import createConnection from '../database';

describe("Users", () => {
  beforeAll(async() => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users")
      .send({
        email: "user34@example.com",
        name: "User 4 example"
      });

      expect(response.status).toBe(201);
  });

  it("Should not be able to create a user with the same email", async () => {
    const response = await request(app).post("/users").send({
      email: "user34@example.com",
      name: "User 3 example",
    });

    expect(response.status).toBe(400)
  })
  
})