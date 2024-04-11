"use strict";

const { Router } = require("express");

const crapController = require("../controllers/crapController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isValidObjectId = require("../middlewares/isValidObjectId");
const validateCrapData = require("../middlewares/validateCrapData");
const attachImages = require("../middlewares/attachImages");
const sanitizeBody = require("../middlewares/sanitizeBody");

const crapRouter = Router();

crapRouter.use(isAuthenticated);

crapRouter.get("/", crapController.getAllCrap);

crapRouter.get("/", crapController.getAllCrap);
crapRouter.get("/:id", isValidObjectId, crapController.getOneCrap);
crapRouter.get("/me", crapController.getMyCrap);

crapRouter.post(
  "/",
  attachImages,
  sanitizeBody,
  validateCrapData,
  crapController.createCrap
);
crapRouter.post("/:id/interested", isValidObjectId, crapController.interested);
crapRouter.post("/:id/suggest", isValidObjectId, crapController.suggest);
crapRouter.post("/:id/agree", isValidObjectId, crapController.agree);
crapRouter.post("/:id/reset", isValidObjectId, crapController.reset);
crapRouter.post("/:id/flush", isValidObjectId, crapController.flush);

crapRouter.put(
  "/:id",
  isValidObjectId,
  attachImages,
  sanitizeBody,
  validateCrapData,
  crapController.updateCrap
);

crapRouter.patch(
  "/:id",
  isValidObjectId,
  attachImages,
  sanitizeBody,
  crapController.updateCrap
);

crapRouter.delete("/:id", isValidObjectId, crapController.deleteCrap);

module.exports = crapRouter;
