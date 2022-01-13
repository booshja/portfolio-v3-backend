const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// errors
// const { NotFoundError } = require("./expressError");

// routes
// const messagesRoutes = require("./routes/messages");

// logging
const logger = require("morgan");
const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3001/" }));
app.use(express.json());
app.use(logger("common"));

// express routes
// app.use("/messages", messagesRoutes);

/** Handle 404 Errors */
app.use((req, res, next) => {
  return next(new NotFoundError("Endpoint not found."));
});

/** Generic Error Handler */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
