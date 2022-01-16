// dependencies
const express = require("express");
const jsonschema = require("jsonschema");
// models
const Order = require("../models/order");
// schemas
const orderNewSchema = require("../schemas/orders/orderNew.json");
// util
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });
