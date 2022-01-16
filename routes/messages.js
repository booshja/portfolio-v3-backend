// dependencies
const express = require("express");
const jsonschema = require("jsonschema");
// models
const Message = require("../models/message");
// schemas
const messageNewSchema = require("../schemas/messages/messageNew.json");
// util
const { validateHuman } = require("../helpers/recaptcha");
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });

/**
 * Create a new message
 *
 * message should be { name, email, message }
 *
 * returns { id, name, email, message, recieved, isArchived }
 *
 * Authorization required: client
 */
router.post("/", async (req, res, next) => {
  const human = await validateHuman(req.body.token);
  if (!human) {
    return res.status(400).json({
      errors: ["You've been flagged as a bot."],
    });
  }

  try {
    const validator = jsonschema.validate(req.body, messageNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }

    const message = await Message.create(req.body);

    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get a list of all messages
 *
 * Returns [ { id, name, email, message, received, isArchived }, ... ]
 *
 * Authorization Required: admin
 */
router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.getAll();
    return res.status(200).json({ messages });
  } catch (err) {
    return next(err);
  }
});

/**
 * Mark a message as "archived" or "un-archives" by id
 *
 * Returns { id, name, email, message, received, isArchived }
 *
 * Authorization Required: admin
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const message = await Message.toggleArchive(
      +req.params.id,
      req.body.archive
    );
    return res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/**
 * Delete a message by id
 *
 * Returns { msg: "Deleted." }
 *
 * Authorization Required: admin
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const message = await Message.delete(+req.params.id);
    return res.status(200).json({ msg: message.msg });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
