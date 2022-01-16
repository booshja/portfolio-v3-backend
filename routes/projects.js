const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Project = require("../models/project");
const projectNewSchema = require("../schemas/projectNew.json");

const router = express.Router({ mergeParams: true });
