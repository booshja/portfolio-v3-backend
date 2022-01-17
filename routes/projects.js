// dependencies
const express = require("express");
const jsonschema = require("jsonschema");
// models
const Project = require("../models/project");
// schemas
const projectNewSchema = require("../schemas/projects/projectNew.json");
const projectUpdateSchema = require("../schemas/projects/projectUpdate.json");
// util
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });

/**
 * Create a project
 *
 * project should be { name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }
 * Where: imageUrl and liveUrl are optional, and tags is an array of strings.
 *
 * Returns { id, name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }
 *
 * Authorization Required: admin
 */
router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, projectNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }

    const project = { ...req.body };
    project.tags = JSON.stringify(project.tags);

    const newProject = await Project.create(project);

    return res.status(201).json({ project: newProject });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get an array of all projects.
 *
 * Returns [ { id, name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }, ... ]
 *
 * Authorization Required: client
 */
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.getAll();
    return res.status(200).json({ projects });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get a project by id.
 *
 * Returns { id, name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }
 *
 * Authorization Required: client
 */
router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.get(+req.params.id);
    return res.status(200).json({ project });
  } catch (err) {
    return next(err);
  }
});

/**
 * Update a project by id, partial update accepted.
 *
 * Returns { id, name, description, tags, thoughts, imageUrl, githubUrl, liveUrl }
 *
 * Authorization Required: admin
 */
router.patch("/", async (req, res, next) => {
  try {
    if (!req.body.id || !req.body.project)
      throw new BadRequestError("Missing data.");

    const validator = jsonschema.validate(
      req.body.project,
      projectUpdateSchema
    );
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      return next(new BadRequestError(errors));
    }

    const project = req.body.project;
    if (project.tags) {
      project.tags = JSON.stringify(project.tags);
    }

    const newProject = await Project.update(+req.body.id, project);
    return res.status(200).json({ project: newProject });
  } catch (err) {
    return next(err);
  }
});

/**
 * Delete a project by id.
 *
 * Returns { msg: "Deleted." }
 *
 * Authorization Required: admin
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const message = await Project.delete(+req.params.id);
    return res.status(200).json({ msg: message.msg });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
