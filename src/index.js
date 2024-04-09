"use strict";

require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const expressMongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

require("./models/db");
require("./utils/passport");

const crapRouter = require("./routers/crapRouter");
const authRouter = require("./routers/authRouter");
const { errorHandler } = require("./middlewares/errors");
const sanitizedBody = require("./middlewares/sanitizedBody");
const logger = require("./utils/logger");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.use(expressMongoSanitize());
app.use(sanitizedBody);

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
