"use strict";

require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const expressMongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

require("./src/models/db");
require("./src/utils/passport");

const crapRouter = require("./src/routers/crapRouter");
const authRouter = require("./src/routers/authRouter");
const { errorHandler } = require("./src/middlewares/errors");
const sanitizeBody = require("./src/middlewares/sanitizeBody");
const logger = require("./src/utils/logger");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.use(expressMongoSanitize());
app.use(sanitizeBody);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.CORS_WHITELIST : "*",
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(compression());
}

app.get("/", (_req, res) => {
  res.send("Server running 🚀🚀🚀");
});

app.use("/auth", authRouter);
app.use("/api/crap", crapRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
