const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Project = require("../../models/project");

const testProjectIds = [];

beforeAll(async () => {
  await db.query("DELETE FROM projects");

  const project1 = await Project.create({
    name: "Project1",
    description: "This is a project, 1.",
    tags: JSON.stringify(["postgres", "express", "react", "node"]),
    thoughts: "This was a great learning experience",
    imageUrl:
      "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
    githubUrl: "github.com/booshja/1",
    liveUrl: "jacobandes.dev",
    position: 1,
  });

  const project2 = await Project.create({
    name: "Project2",
    description: "This is a project, 2.",
    tags: JSON.stringify(["postgres", "express", "react", "node"]),
    thoughts: "This was a great learning experience",
    imageUrl:
      "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
    githubUrl: "github.com/booshja/2",
    liveUrl: "jacobandes.dev",
    position: 2,
  });

  testProjectIds.push(project1.id);
  testProjectIds.push(project2.id);
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

/****************************** POST /projects */
describe("POST, /projects", () => {
  it("creates a new project (with all fields)", async () => {
    const resp = await request(app)
      .post("/projects")
      .send({
        name: "PaintingJoy",
        description: "This was my second capstone.",
        tags: [
          "postgres",
          "express",
          "react",
          "node",
          "styled-components",
          "stripe",
          "auth0",
        ],
        thoughts: "This was a great learning experience, I tell ya!",
        imageUrl:
          "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
        githubUrl: "github.com/booshja/Painting-Joy-frontend",
        liveUrl: "paintingjoy.art",
        position: 3,
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      project: {
        id: expect.any(Number),
        name: "PaintingJoy",
        description: "This was my second capstone.",
        tags: JSON.stringify([
          "postgres",
          "express",
          "react",
          "node",
          "styled-components",
          "stripe",
          "auth0",
        ]),
        thoughts: "This was a great learning experience, I tell ya!",
        imageUrl:
          "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
        githubUrl: "github.com/booshja/Painting-Joy-frontend",
        liveUrl: "paintingjoy.art",
        position: 3,
      },
    });
  });

  it("creates a new project (only imageUrl)", async () => {
    const resp = await request(app)
      .post("/projects")
      .send({
        name: "SetPlaylist",
        description: "This was my first capstone.",
        tags: ["postgres", "flask", "jinja", "python", "css"],
        thoughts: "Great semantic HTML practice!",
        imageUrl:
          "https://duckduckgo.com/?q=aussie+puppies&atb=v303-1&iar=images&iax=images&ia=images",
        githubUrl: "github.com/booshja/SetPlaylist",
        position: 4,
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      project: {
        id: expect.any(Number),
        name: "SetPlaylist",
        description: "This was my first capstone.",
        tags: JSON.stringify(["postgres", "flask", "jinja", "python", "css"]),
        thoughts: "Great semantic HTML practice!",
        imageUrl:
          "https://duckduckgo.com/?q=aussie+puppies&atb=v303-1&iar=images&iax=images&ia=images",
        githubUrl: "github.com/booshja/SetPlaylist",
        liveUrl: null,
        position: 4,
      },
    });
  });

  it("creates a new project (only liveUrl)", async () => {
    const resp = await request(app)
      .post("/projects")
      .send({
        name: "Jobly",
        description: "This was a react project.",
        tags: ["react", "styled-components"],
        thoughts: "This was a quick fun one",
        githubUrl: "github.com/booshja/Jobly-frontend",
        liveUrl: "google.com",
        position: 5,
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      project: {
        id: expect.any(Number),
        name: "Jobly",
        description: "This was a react project.",
        tags: JSON.stringify(["react", "styled-components"]),
        thoughts: "This was a quick fun one",
        githubUrl: "github.com/booshja/Jobly-frontend",
        liveUrl: "google.com",
        imageUrl:
          "https://images.unsplash.com/photo-1614469723922-c043ad9fd036?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2709&q=80",
        position: 5,
      },
    });
  });

  it("gives bad request with partial missing data", async () => {
    const resp = await request(app).post("/projects").send({
      name: "Ooopsie Daisy",
    });
    expect(resp.statusCode).toEqual(400);
  });

  it("gives bad request with no data", async () => {
    const resp = await request(app).post("/projects").send();
    expect(resp.statusCode).toEqual(400);
  });
});

/******************************* GET /projects */
describe("GET, /projects", () => {
  it("returns a list of all projects", async () => {
    const resp = await request(app).get("/projects");
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      projects: [
        {
          id: expect.any(Number),
          name: "Project1",
          description: "This is a project, 1.",
          tags: JSON.stringify(["postgres", "express", "react", "node"]),
          thoughts: "This was a great learning experience",
          imageUrl:
            "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
          githubUrl: "github.com/booshja/1",
          liveUrl: "jacobandes.dev",
          position: 1,
        },
        {
          id: expect.any(Number),
          name: "Project2",
          description: "This is a project, 2.",
          tags: JSON.stringify(["postgres", "express", "react", "node"]),
          thoughts: "This was a great learning experience",
          imageUrl:
            "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
          githubUrl: "github.com/booshja/2",
          liveUrl: "jacobandes.dev",
          position: 2,
        },
      ],
    });
  });
});

/*************************** GET /projects/:id */
describe("GET, /projects/:id", () => {
  it("gets a project by id", async () => {
    const resp = await request(app).get(`/projects/${testProjectIds[0]}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      project: {
        id: expect.any(Number),
        name: "Project1",
        description: "This is a project, 1.",
        tags: JSON.stringify(["postgres", "express", "react", "node"]),
        thoughts: "This was a great learning experience",
        imageUrl:
          "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
        githubUrl: "github.com/booshja/1",
        liveUrl: "jacobandes.dev",
        position: 1,
      },
    });
  });

  it("gives bad request for wrong id type", async () => {
    const resp = await request(app).get("/projects/bananas");
    expect(resp.statusCode).toEqual(400);
  });

  it("gives not found for non-matching id", async () => {
    const resp = await request(app).get("/projects/-1");
    expect(resp.statusCode).toEqual(404);
  });
});

/***************************** PATCH /projects */
describe("PATCH, /projects", () => {
  it("updates a project (full update)", async () => {
    const resp = await request(app)
      .patch("/projects")
      .send({
        id: testProjectIds[0],
        project: {
          name: "This is new!",
          description: "Hey look, I updated this!",
          tags: ["potatoes", "carrots", "onions"],
          thoughts: "Wait this sounds like a stew",
          imageUrl:
            "https://kitchenfarms.com/wp-content/uploads/2017/01/potato-background.jpg",
          githubUrl: "github.com/booshja/Stew",
          liveUrl: "google.com",
          position: 99,
        },
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      project: {
        id: testProjectIds[0],
        name: "This is new!",
        description: "Hey look, I updated this!",
        tags: JSON.stringify(["potatoes", "carrots", "onions"]),
        thoughts: "Wait this sounds like a stew",
        imageUrl:
          "https://kitchenfarms.com/wp-content/uploads/2017/01/potato-background.jpg",
        githubUrl: "github.com/booshja/Stew",
        liveUrl: "google.com",
        position: 99,
      },
    });
  });

  it("updates a project (partial update)", async () => {
    const resp = await request(app)
      .patch("/projects")
      .send({
        id: testProjectIds[1],
        project: {
          name: "This is a new name!",
        },
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      project: {
        id: testProjectIds[1],
        name: "This is a new name!",
        description: "This is a project, 2.",
        tags: JSON.stringify(["postgres", "express", "react", "node"]),
        thoughts: "This was a great learning experience",
        imageUrl:
          "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
        githubUrl: "github.com/booshja/2",
        liveUrl: "jacobandes.dev",
        position: 2,
      },
    });
  });

  it("gives bad request for partial missing data (id)", async () => {
    const resp = await request(app)
      .patch("/projects")
      .send({
        project: {
          name: "This doens't feel right...",
        },
      });
    expect(resp.statusCode).toBe(400);
  });

  it("gives bad request for partial missing data (project)", async () => {
    const resp = await request(app).patch("/projects").send({
      id: testProjectIds[1],
    });
    expect(resp.statusCode).toBe(400);
  });

  it("gives bad request for no data", async () => {
    const resp = await request(app).patch("/projects").send();
    expect(resp.statusCode).toBe(400);
  });

  it("gives not found for non-matching id", async () => {
    const resp = await request(app)
      .patch("/projects")
      .send({
        id: -1,
        project: {
          name: "This can't be right...",
        },
      });
    expect(resp.statusCode).toBe(404);
  });

  it("gives bad request for invalid data", async () => {
    const resp = await request(app)
      .patch("/projects")
      .send({
        id: "banana",
        project: {
          name: [1, 2, 3],
        },
      });
    expect(resp.statusCode).toBe(400);
  });
});

/***************************** PATCH /projects */
describe("PATCH, /projects/positions", () => {
  it("updates the positions of projects", async () => {
    const resp = await request(app)
      .patch("/projects/positions")
      .send({
        positions: [
          { id: testProjectIds[0], position: 2 },
          { id: testProjectIds[1], position: 1 },
        ],
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      projects: [
        {
          id: expect.any(Number),
          name: "Project2",
          description: "This is a project, 2.",
          tags: JSON.stringify(["postgres", "express", "react", "node"]),
          thoughts: "This was a great learning experience",
          imageUrl:
            "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
          githubUrl: "github.com/booshja/2",
          liveUrl: "jacobandes.dev",
          position: 1,
        },
        {
          id: expect.any(Number),
          name: "Project1",
          description: "This is a project, 1.",
          tags: JSON.stringify(["postgres", "express", "react", "node"]),
          thoughts: "This was a great learning experience",
          imageUrl:
            "https://duckduckgo.com/?q=puppies&atb=v303-1&iax=images&ia=images",
          githubUrl: "github.com/booshja/1",
          liveUrl: "jacobandes.dev",
          position: 2,
        },
      ],
    });
  });

  it("gives bad request for no data", async () => {
    const resp = await request(app).patch("/projects/positions").send();
    expect(resp.statusCode).toBe(400);
  });

  it("gives bad request for invalid data", async () => {
    const resp = await request(app)
      .patch("/projects/positions")
      .send({
        positions: ["apples", "bananas", "tomatoes"],
      });
    expect(resp.statusCode).toBe(400);
  });
});

/*************************** DELETE /projects/ */
describe("DELETE, /projects", () => {
  it("deletes a project by id", async () => {
    const resp = await request(app).delete(`/projects/${testProjectIds[0]}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      msg: "Deleted.",
    });
  });

  it("gives not found for no id", async () => {
    const resp = await request(app).delete("/projects");
    expect(resp.statusCode).toBe(404);
  });

  it("gives not found for non-matching id", async () => {
    const resp = await request(app).delete("/projects/-1");
    expect(resp.statusCode).toBe(404);
  });
});
