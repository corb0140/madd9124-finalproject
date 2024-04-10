"use strict";

const { NotFoundError, ForbiddenError } = require("../middlewares/errors");
const debug = require("debug")("petR-Authentication:service/petService");
const Crap = require("../models/crap");

const createCrap = async (body) => {
  debug(body);

  const crap = new Crap(body);

  await crap.save();

  return crap;
};

const getAllCrap = async () => {
  const crap = await Crap.find({}).populate("owner");

  return crap;
};

const getOneCrap = async (id) => {
  const crap = await Crap.findById(id).populate("owner");

  if (!crap) {
    throw new NotFoundError("Crap not found");
  }

  return crap;
};

const getMyCrap = async (owner) => {
  const myCrap = await Crap.find({ owner }).populate("owner");

  return myCrap;
};

const updateCrap = async (id, ownerId, updates) => {
  const foundCrap = await Crap.findById(id);

  if (!foundCrap) {
    throw new NotFoundError(`Crap with id ${id} not found`);
  }

  if (foundCrap.owner.toString() !== ownerId) {
    throw new ForbiddenError("You are not allowed to update this crap");
  }

  const updatedCrap = await Crap.findByIdAndUpdate(id, updates, {
    runValidators: true,
    returnOriginal: false,
  }).populate("owner");

  return updatedCrap;
};

const deleteCrap = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (!foundCrap) {
    throw new NotFoundError(`Crap with id ${id} not found`);
  }

  if (foundCrap.owner.toString() !== ownerId) {
    throw new ForbiddenError("You are not allowed to delete this crap");
  }

  const deletedCrap = await Crap.findByIdAndDelete(id).populate("owner");

  return deletedCrap;
};

module.exports = {
  createCrap,
  getAllCrap,
  getOneCrap,
  getMyCrap,
  updateCrap,
  deleteCrap,
};
