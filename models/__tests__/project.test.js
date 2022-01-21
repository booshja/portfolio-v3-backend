const db = require("../../db");
const { BadRequestError, NotFoundError } = require("../../expressError");
const Project = require("../project");

const testProjectIds = [];

beforeAll(async function () {
  await db.query("DELETE FROM projects");

  const results = await db.query(
    `INSERT INTO projects(name,
                          description,
                          tags,
                          thoughts,
                          image_url,
                          github_url,
                          live_url,
                          position)
      VALUES ('Project1', 'This is a website I built, 1.', '{tags: ["node", "express", "react"]}', 'This was a cool project 1.', 'google.com', 'github.com', 'bttnusa.com', 1),
              ('Project2', 'This is a website I built, 2.', '{tags: ["node", "express", "react"]}', 'This was a cool project 2.', 'google.com', 'github.com', 'bttnusa.com', 2),
              ('Project3', 'This is a website I built, 3.', '{tags: ["node", "express", "react"]}', 'This was a cool project 3.', 'google.com', 'github.com', 'bttnusa.com', 3),
              ('Project4', 'This is a website I built, 4.', '{tags: ["node", "express", "react"]}','This was a cool project 4.', 'google.com', 'github.com', 'bttnusa.com', 4)
      RETURNING id`
  );
  testProjectIds.splice(0, 0, ...results.rows.map((row) => row.id));
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
  const newProjectWithBoth = {
    name: "Testerino Testerson",
    description: "me@email.com",
    tags: "Testing, testing...",
    thoughts: "This was a cool project!",
    imageUrl: "github.com/booshja",
    githubUrl: "github.com",
    liveUrl: "jacobandes.dev",
    position: 5,
  };

  const newProjectWithImage = {
    name: "Testerino Testerson",
    description: "me@email.com",
    tags: "Testing, testing...",
    thoughts: "This was a cool project!",
    imageUrl: "github.com/booshja",
    githubUrl: "github.com",
    position: 6,
  };

  const newProjectWithLive = {
    name: "Testerino Testerson",
    description: "me@email.com",
    tags: "Testing, testing...",
    thoughts: "This was a cool project!",
    githubUrl: "github.com",
    liveUrl: "jacobandes.dev",
    position: 7,
  };

  it("creates new project (all fields)", async () => {
    let project = await Project.create(newProjectWithBoth);
    expect(project).toEqual({
      id: expect.any(Number),
      name: "Testerino Testerson",
      description: "me@email.com",
      tags: "Testing, testing...",
      thoughts: "This was a cool project!",
      imageUrl: "github.com/booshja",
      githubUrl: "github.com",
      liveUrl: "jacobandes.dev",
      position: 5,
    });
  });

  it("creates new project (only image_url)", async () => {
    let project = await Project.create(newProjectWithImage);
    expect(project).toEqual({
      id: expect.any(Number),
      name: "Testerino Testerson",
      description: "me@email.com",
      tags: "Testing, testing...",
      thoughts: "This was a cool project!",
      imageUrl: "github.com/booshja",
      githubUrl: "github.com",
      liveUrl: null,
      position: 6,
    });
  });

  it("creates new project (only live_url)", async () => {
    let project = await Project.create(newProjectWithLive);
    expect(project).toEqual({
      id: expect.any(Number),
      name: "Testerino Testerson",
      description: "me@email.com",
      tags: "Testing, testing...",
      thoughts: "This was a cool project!",
      githubUrl: "github.com",
      liveUrl: "jacobandes.dev",
      imageUrl:
        "https://images.unsplash.com/photo-1614469723922-c043ad9fd036?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2709&q=80",
      position: 7,
    });
  });

  it("throws BadRequestError if no data", async () => {
    try {
      await Project.create();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError if missing data", async () => {
    try {
      await Project.create({
        name: "The best website in the world",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid input type", async () => {
    try {
      await Project.create("Hey there!");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** getAll */

describe("getAll", () => {
  it("gets all projects", async () => {
    const projects = await Project.getAll();
    expect(projects).toEqual([
      {
        id: expect.any(Number),
        name: "Project1",
        description: "This is a website I built, 1.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 1.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 1,
      },
      {
        id: expect.any(Number),
        name: "Project2",
        description: "This is a website I built, 2.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 2.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 2,
      },
      {
        id: expect.any(Number),
        name: "Project3",
        description: "This is a website I built, 3.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 3.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 3,
      },
      {
        id: expect.any(Number),
        name: "Project4",
        description: "This is a website I built, 4.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 4.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 4,
      },
    ]);
  });
});

/***************************************** get */

describe("get", () => {
  it("gets post by id", async () => {
    const project = await Project.get(testProjectIds[0]);
    expect(project).toEqual({
      id: expect.any(Number),
      name: "Project1",
      description: "This is a website I built, 1.",
      tags: `{tags: ["node", "express", "react"]}`,
      thoughts: "This was a cool project 1.",
      imageUrl: "google.com",
      githubUrl: "github.com",
      liveUrl: "bttnusa.com",
      position: 1,
    });
  });

  it("throws error for no id", async () => {
    try {
      await Project.get();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws error for invalid id", async () => {
    try {
      await Project.get(0);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws error for invalid input type", async () => {
    try {
      await Project.get("Hey there!");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", () => {
  it("updates a project fully", async () => {
    const project = await Project.update(testProjectIds[3], {
      name: "jacobandes.dev",
      description: "This is a wonderful website I created.",
      tags: `{ tags: ["graphql", "apollo", "react"]}`,
      thoughts: "Ooohhh look at this!",
      imageUrl: "jacobandes.dev/image",
      githubUrl: "github.com/booshja/portfolio-v3",
      liveUrl: "jacobandes.dev",
      position: 1,
    });
    expect(project).toEqual({
      id: expect.any(Number),
      name: "jacobandes.dev",
      description: "This is a wonderful website I created.",
      tags: '{ tags: ["graphql", "apollo", "react"]}',
      thoughts: "Ooohhh look at this!",
      imageUrl: "jacobandes.dev/image",
      githubUrl: "github.com/booshja/portfolio-v3",
      liveUrl: "jacobandes.dev",
      position: 1,
    });
  });

  it("updates a project partially", async () => {
    const project = await Project.update(testProjectIds[3], {
      description: "This has been updated!",
    });
    expect(project).toEqual({
      id: expect.any(Number),
      name: "Project4",
      description: "This has been updated!",
      tags: `{tags: ["node", "express", "react"]}`,
      thoughts: "This was a cool project 4.",
      imageUrl: "google.com",
      githubUrl: "github.com",
      liveUrl: "bttnusa.com",
      position: 4,
    });
  });

  it("throws BadRequestError for no input", async () => {
    try {
      await Project.update();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError for partial missing input", async () => {
    try {
      await Project.update(1);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid id input type", async () => {
    try {
      await Project.update("bananas", { description: "This is sweet!" });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid project input type", async () => {
    try {
      await Project.update(1, "apples");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws NotFoundError for unfound id", async () => {
    try {
      await Project.update(-1, { description: "My new favorite website!" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** delete */
describe("update positions", () => {
  it("updates positions", async () => {
    const result = await Project.updatePositions([
      { id: testProjectIds[3], position: 1 },
      { id: testProjectIds[2], position: 2 },
      { id: testProjectIds[1], position: 3 },
      { id: testProjectIds[0], position: 4 },
    ]);
    expect(result).toEqual([
      {
        id: expect.any(Number),
        name: "Project4",
        description: "This is a website I built, 4.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 4.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 1,
      },
      {
        id: expect.any(Number),
        name: "Project3",
        description: "This is a website I built, 3.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 3.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 2,
      },
      {
        id: expect.any(Number),
        name: "Project2",
        description: "This is a website I built, 2.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 2.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 3,
      },
      {
        id: expect.any(Number),
        name: "Project1",
        description: "This is a website I built, 1.",
        tags: `{tags: ["node", "express", "react"]}`,
        thoughts: "This was a cool project 1.",
        imageUrl: "google.com",
        githubUrl: "github.com",
        liveUrl: "bttnusa.com",
        position: 4,
      },
    ]);
  });

  it("throws BadRequestError if no input", async () => {
    try {
      await Project.updatePositions();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError if empty array input", async () => {
    try {
      await Project.updatePositions([]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError if input not of type Array", async () => {
    try {
      await Project.updatePositions("MAKE THEM ALL NUMBER ONE!!!");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws BadRequestError if data doesn't match with db", async () => {
    try {
      await Project.updatePositions([
        { id: "apple", position: 1 },
        { id: "orange", position: 2 },
      ]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** delete */

describe("delete", () => {
  it("deletes project", async () => {
    const result = await Project.delete(testProjectIds[0]);
    expect(result).toEqual({ msg: "Deleted." });

    const res = await db.query(`SELECT id FROM projects WHERE id=$1`, [
      testProjectIds[0],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  it("throws BadRequestError if no id", async () => {
    try {
      await Project.delete();
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  it("throws NotFoundError if no such project", async () => {
    try {
      await Project.delete(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  it("throws BadRequestError for invalid input type", async () => {
    try {
      await Project.delete([1, 2, 3]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
