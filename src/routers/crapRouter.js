"use strict";

const { Router } = require("express");

const crapController = require("../controllers/crapController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isValidObjectId = require("../middlewares/isValidObjectId");
const validateCrapData = require("../middlewares/validateCrapData");
const attachImages = require("../middlewares/attachImages");
const sanitizeBody = require("../middlewares/sanitizeBody");

const crapRouter = Router();

// crapRouter.use(isAuthenticated);

// crapRouter.post("/", crapController.createCrap);
// crapRouter.get("/", crapController.getAllCrap);

// crapRouter.get("/", crapController.getAllCraps);
// crapRouter.get("/:id", crapController.getCrapById);

// crapRouter.put("/:id", crapController.updateCrap);
// crapRouter.patch(
//   "/:id",
//   //   isValidObjectId,
//   //   validateCrapData,
//   //   attachImages,

//   crapController.updateCrap
// );
// crapRouter.delete("/:id", crapController.deleteCrap);

module.exports = crapRouter;
