"use strict";

const { NotFoundError, ForbiddenError } = require("../middlewares/errors");
const debug = require("debug")("petR-Authentication:service/petService");
const Crap = require("../models/crap");

const getAllCrap = async () => {
  const crap = await Crap.find({}).populate("owner");

  return crap;
};

module.exports = {
  getAllCrap,
};
