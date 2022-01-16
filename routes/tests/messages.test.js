const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Message = require("../../models/message");

const testMessageIds = [];

beforeAll(async () => {
  await db.query("DELETE FROM messages");

  const message1 = await Message.create({
    name: "Tester1",
    email: "1@email.com",
    message: "This is a test message, 1!",
  });

  const message2 = await Message.create({
    name: "Tester2",
    email: "2@email.com",
    message: "This is a test message, 2!",
  });

  testMessageIds.push(message1.id);
  testMessageIds.push(message2.id);
});

beforeEach(async () => {
  await db.query("BEGIN");
});

afterEach(async () => {
  await db.query("ROLLBACK");
});

afterAll(async () => {
  await db.end();
});

/****************************** POST /messages */
describe("POST, /messages", () => {
  it("creates a new message", async () => {
    const resp = await request(app).post("/messages").send({
      name: "PostTest",
      email: "post@email.com",
      message: "This is a post request test!",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      message: {
        id: expect.any(Number),
        email: "post@email.com",
        name: "PostTest",
        message: "This is a post request test!",
        isArchived: false,
        received: expect.any(String),
      },
    });
  });

  it("gives bad request with partial missing data", async () => {
    const resp = await request(app).post("/messages").send({
      message: "Oh, hello!",
    });
    expect(resp.statusCode).toEqual(400);
  });

  it("gives bad request with no data", async () => {
    const resp = await request(app).post("/messages").send();
    expect(resp.statusCode).toEqual(400);
  });
});

/******************************* GET /messages */
describe("GET, /messages", () => {
  it("returns a list of all messages", async () => {
    const resp = await request(app).get("/messages");
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      messages: [
        {
          id: expect.any(Number),
          name: "Tester1",
          email: "1@email.com",
          message: "This is a test message, 1!",
          isArchived: false,
          received: expect.any(String),
        },
        {
          id: expect.any(Number),
          name: "Tester2",
          email: "2@email.com",
          message: "This is a test message, 2!",
          isArchived: false,
          received: expect.any(String),
        },
      ],
    });
  });
});

/***************************** PATCH /messages */
describe("PATCH, /messages", () => {
  it("archives a message by id", async () => {
    const resp = await request(app)
      .patch(`/messages/${testMessageIds[0]}`)
      .send({
        archive: true,
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      message: {
        id: testMessageIds[0],
        name: "Tester1",
        email: "1@email.com",
        message: "This is a test message, 1!",
        received: expect.any(String),
        isArchived: true,
      },
    });
  });

  it("un-archives a message by id", async () => {
    const resp = await request(app)
      .patch(`/messages/${testMessageIds[0]}`)
      .send({
        archive: false,
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      message: {
        id: testMessageIds[0],
        name: "Tester1",
        email: "1@email.com",
        message: "This is a test message, 1!",
        received: expect.any(String),
        isArchived: false,
      },
    });
  });

  it("gives not found for non-matching id", async () => {
    const resp = await request(app).patch("/messages/-1");
    expect(resp.statusCode).toEqual(404);
  });
});

/**************************** DELETE /messages */
describe("DELETE, /messages", () => {
  it("deletes a message by id", async () => {
    const resp = await request(app).delete(`/messages/${testMessageIds[0]}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      msg: "Deleted.",
    });
  });

  it("gives not found for non-matching id", async () => {
    const resp = await request(app).delete(`/messages/-1`);
    expect(resp.statusCode).toEqual(404);
  });

  it("gives not found for missing id", async () => {
    const resp = await request(app).delete("/mmessages/").send();
    expect(resp.statusCode).toEqual(404);
  });
});
