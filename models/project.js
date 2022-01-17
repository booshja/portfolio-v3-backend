const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialInsert, sqlForPartialUpdate } = require("../helpers/sql");

/** Project Model */
class Project {
  /**
   * Create a project, update db, return new project data
   *
   * @static
   * @async
   * @function create
   * @memberof Project
   * @param {Object} project - The project object
   * @param {String} project.name - The name of the project
   * @param {String} project.description - A description of the project
   * @param {Array} project.tags - An array of strings containing keywords for the project.
   * @param {String} project.thoughts - Thoughts/lessons/etc. about building the project.
   * @param {String} [project.imageUrl='https://images.unsplash.com/photo-1614469723922-c043ad9fd036?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2709&q=80'] - The url to the image of the built project.
   * @param {String} project.githubUrl - The url to the project repo on GitHub.
   * @param {String} [project.liveUrl=null] - The url to the live deployed project.
   *
   * @returns {Object} New Project data in an object: { name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }
   *
   * @throws {BadRequestError} Throws error if no data passed to function.
   * @throws {BadRequestError} Throws error if missing data.
   * @throws {BadRequestError} Throws error if input type is not Object.
   */
  static async create(project) {
    // check for missing/incomplete data
    if (!project) throw new BadRequestError("No data.");
    if (
      !project.name ||
      !project.description ||
      !project.tags ||
      !project.thoughts ||
      !project.githubUrl
    )
      throw new BadRequestError("Missing data.");
    if (typeof project !== "object")
      throw new BadRequestError("Invalid input type.");

    const { sqlInsertCols, sqlInsertVals, values } = sqlForPartialInsert(
      project,
      {
        imageUrl: "image_url",
        githubUrl: "github_url",
        liveUrl: "live_url",
      }
    );

    const querySql = `INSERT INTO projects (${sqlInsertCols})
          VALUES (${sqlInsertVals})
          RETURNING id,
                    name,
                    description,
                    tags,
                    thoughts,
                    image_url AS "imageUrl",
                    github_url AS "githubUrl",
                    live_url AS "liveUrl"`;

    const result = await db.query(querySql, [...values]);
    const newProject = result.rows[0];

    return newProject;
  }

  /**
   * Get an array of all projects.
   *
   * @static
   * @async
   * @function getAll
   * @memberof Project
   *
   * @yields {Array} An array of project objects.
   */
  static async getAll() {
    const result = await db.query(
      `SELECT id,
              name,
              description,
              tags,
              thoughts,
              image_url AS "imageUrl",
              github_url AS "githubUrl",
              live_url AS "liveUrl"
        FROM projects`
    );

    return result.rows;
  }

  /**
   * Get a single project by id.
   *
   * @static
   * @async
   * @function get
   * @memberof Project
   * @param {Number} id - Project id
   *
   * @returns {Object} - Project object: { name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }
   *
   * @throws {BadRequestError} Throws error if no id.
   * @throws {NotFoundError} Throws error if no row found by id.
   * @throws {BadRequestError} Throws error if type of input is not Number.
   */
  static async get(id) {
    // check input
    if (!id) throw new BadRequestError("No input");
    if (typeof id !== "number")
      throw new BadRequestError("Invalid input type.");

    const result = await db.query(
      `SELECT id,
              name,
              description,
              tags,
              thoughts,
              image_url AS "imageUrl",
              github_url AS "githubUrl",
              live_url AS "liveUrl"
        FROM projects
        WHERE id = $1`,
      [id]
    );
    const project = result.rows[0];

    if (!project) throw new NotFoundError(`No project: ${id}`);

    return project;
  }

  /**
   * Update a project.
   *
   * @static
   * @async
   * @function update
   * @memberof Project
   * @param {Object} project - The project object
   * @param {String} [project.name] - The name of the project
   * @param {String} [project.description] - A description of the project
   * @param {Array} [project.tags] - An array of strings containing keywords for the project.
   * @param {String} [project.thoughts] - Thoughts/lessons/etc. about building the project.
   * @param {String} [project.imageUrl] - The url to the image of the built project.
   * @param {String} [project.githubUrl] - The url to the project repo on GitHub.
   * @param {String} [project.liveUrl] - The url to the live deployed project.
   *
   * @throws {BadRequestError} Throws error if no data.
   * @throws {NotFoundError} Throws error if no row found by id.
   * @throws {BadRequestError} Throws error if input is not type Object.
   */
  static async update(id, project) {
    // check for missing/incomplete params
    if (!id && !project) throw new BadRequestError("No input.");
    if (!id || !project) throw new BadRequestError("Missing input.");
    if (typeof project !== "object")
      throw new BadRequestError("Invalid input type.");
    if (typeof id !== "number")
      throw new BadRequestError("Invalid input type.");

    const { setCols, values } = sqlForPartialUpdate(project, {
      imageUrl: "image_url",
      githubUrl: "github_url",
      liveUrl: "live_url",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE projects
                        SET ${setCols}
                        WHERE id = ${idVarIdx}
                        RETURNING id,
                                  name,
                                  description,
                                  tags,
                                  thoughts,
                                  image_url AS "imageUrl",
                                  github_url AS "githubUrl",
                                  live_url AS "liveUrl"`;

    const result = await db.query(querySql, [...values, id]);
    const newProject = result.rows[0];

    if (!newProject) throw new NotFoundError(`No project: ${id}`);

    return newProject;
  }

  /**
   * Delete Project data by id.
   *
   * @static
   * @async
   * @function delete
   * @memberof Project
   * @param {Number} id - Project id
   *
   * @throws {BadRequestError} Throws error if no id.
   * @throws {NotFoundError} Throws error if no row found by id.
   * @throws {BadRequestError} Throws error if type of input is not Number.
   */
  static async delete(id) {
    // check input
    if (!id) throw new BadRequestError("No input.");
    if (typeof id !== "number")
      throw new BadRequestError("Invalid input type.");

    const result = await db.query(
      `DELETE
        FROM projects
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    const removed = result.rows[0];

    if (!removed) throw new NotFoundError(`No project: ${id}`);

    return { msg: "Deleted." };
  }
}

module.exports = Project;
