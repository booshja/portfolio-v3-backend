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
