const mongoose = require("mongoose");
const logger = require("../utils/logger");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
