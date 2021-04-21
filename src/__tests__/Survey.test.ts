import request from 'supertest';
import { getConnection } from 'typeorm';
import {app} from '../app';

import createConnection from '../database';

describe("Surveys", () => {
  beforeAll(async() => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/surveys")
      .send({
        title: "fasdfasd fasfe4hdfghd fg hdfgh dfghdfgh tyrghdfghdrtu r 34 ",
        description: "User example"
      });

      expect(response.status).toBe(201);
  });

  it("should be able to get all surveys", async () => {
    await request(app).post("/surveys")
    .send({
      title: "fasdfasd fasfe4 fasdfasd fasdfasd 34 ",
      description: "User fasdf asdf asdf example"
    });

    const response = await request(app).get("/surveys");
    expect(response.body.length).toBe(2);

  });
  
})