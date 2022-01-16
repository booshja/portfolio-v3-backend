const db = require("../../db");
const { BadRequestError, NotFoundError } = require("../../expressError");
const Message = require("../message");

const testMessageIds = [];

beforeAll(async function () {
  await db.query("DELETE FROM messages");

  const results = await db.query(
    `INSERT INTO messages(name, email, message, is_archived)
      VALUES ('Tester1', '1@email.com', 'This is a test 1.', false),
              ('Tester2', '2@email.com', 'This is a test 2.', false),
              ('Tester3', '3@email.com', 'This is a test 3.', false),
              ('Tester4', '4@email.com', 'This is a test 4.', true)
      RETURNING id`
  );
  testMessageIds.splice(0, 0, ...results.rows.map((row) => row.id));
});

beforeEach(async function () {
  await db.query("BEGIN");
});

afterEach(async function () {
  await db.query("ROLLBACK");
});

afterAll(async function () {
  await db.end();
});

/************************************** create */
describe("create", () => {
  let newMessage = {
    name: "Testerino Testerson",
    email: "me@email.com",
    message: "Testing, testing...",
  };

  it("creates new message", async () => {
    let message = await Message.create(newMessage);
    expect(message).toEqual({
      id: expect.any(Number),
      name: "Testerino Testerson",
      email: "me@email.com",
      message: "Testing, testing...",
      isArchived: false,
      received: expect.any(Date),
    });
  });

  it("throws BadRequestError if no data", async () => {
    try {
      await Message.create();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError if missing data", async () => {
    try {
      await Message.create({
        name: "Testerino Testerson",
        email: "me@email.com",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid input type", async () => {
    try {
      await Message.create("Make this!");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getAll */

describe("getAll", () => {
  it("gets all messages, including archived", async () => {
    const messages = await Message.getAll();
    expect(messages).toEqual([
      {
        id: expect.any(Number),
        email: "1@email.com",
        name: "Tester1",
        message: "This is a test 1.",
        received: expect.any(Date),
        isArchived: false,
      },
      {
        id: expect.any(Number),
        email: "2@email.com",
        name: "Tester2",
        message: "This is a test 2.",
        received: expect.any(Date),
        isArchived: false,
      },
      {
        id: expect.any(Number),
        email: "3@email.com",
        name: "Tester3",
        message: "This is a test 3.",
        received: expect.any(Date),
        isArchived: false,
      },
      {
        id: expect.any(Number),
        email: "4@email.com",
        name: "Tester4",
        message: "This is a test 4.",
        received: expect.any(Date),
        isArchived: true,
      },
    ]);
  });
});

/******************************* toggleArchive */

describe("toggleArchive", () => {
  it("archives post by id", async () => {
    const archive = await Message.toggleArchive(testMessageIds[0]);
    expect(archive).toEqual({
      id: expect.any(Number),
      email: "1@email.com",
      name: "Tester1",
      message: "This is a test 1.",
      received: expect.any(Date),
      isArchived: true,
    });
  });

  it("un-archives post by id", async () => {
    const unarchive = await Message.toggleArchive(testMessageIds[0], false);
    expect(unarchive).toEqual({
      id: expect.any(Number),
      email: "1@email.com",
      name: "Tester1",
      message: "This is a test 1.",
      received: expect.any(Date),
      isArchived: false,
    });
  });

  it("throws BadRequestError if no id", async () => {
    try {
      await Message.toggleArchive();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws NotFoundError if message not found", async () => {
    try {
      await Message.toggleArchive(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid id input", async () => {
    try {
      await Message.toggleArchive("apples", false);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid archive input", async () => {
    try {
      await Message.toggleArchive(3, "bananas");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** delete */

describe("delete", () => {
  it("deletes message", async () => {
    const result = await Message.delete(testMessageIds[0]);
    expect(result).toEqual({ msg: "Deleted." });

    const res = await db.query(`SELECT id FROM messages WHERE id=$1`, [
      testMessageIds[0],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  it("throws BadRequestError if no id", async () => {
    try {
      await Message.delete();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws NotFoundError if no such message", async () => {
    try {
      await Message.delete(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  it("throws BadRequestError if invalid input type", async () => {
    try {
      await Message.delete("This one!");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
