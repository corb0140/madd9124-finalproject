"use strict";

const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../middlewares/errors");
const debug = require("debug")("petR-Authentication:service/petService");
const Crap = require("../models/crap");

const createCrap = async (body) => {
  debug(body);

  const crap = new Crap(body);

  crap.status = "available";
  crap.location = {
    type: "Point",
    coordinates: [body.longitude, body.latitude],
  };

  await crap.save();

  return crap;
};

const interested = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "available") {
      foundCrap.status = "interested";
      foundCrap.buyer = ownerId;
      await foundCrap.save();
      return foundCrap;
    } else {
      throw new BadRequestError("Crap is not available");
    }
  }
};

const suggest = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "interested") {
      if (foundCrap.buyer.toString() !== ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to suggest this crap");
      } else {
        foundCrap.status = "scheduled";
        foundCrap.suggestion = {
          address: "baseline. ottawa",
          date: new Date(),
        };
        await foundCrap.save();
        return foundCrap;
      }
    } else {
      throw new BadRequestError("No one is interested in this crap");
    }
  }
};

const agree = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "scheduled") {
      if (foundCrap.owner.toString() !== ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to agree to this crap");
      } else {
        const within = foundCrap.location.within(
          foundCrap.location,
          1000,
          "meters"
        );

        if (within) {
          foundCrap.status = "agreed";
          await foundCrap.save();
          return foundCrap;
        } else {
          foundCrap.status = "interested";
          await foundCrap.save();
          return foundCrap;
        }
      }
    } else {
      throw new BadRequestError("Crap is not scheduled");
    }
  }
};

const reset = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status !== "flushed") {
      if (foundCrap.owner.toString() !== ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to reset this crap");
      } else {
        foundCrap.status = "available";
        foundCrap.buyer = null;
        foundCrap.suggestion = null;
        await foundCrap.save();
        return foundCrap;
      }
    } else {
      throw new BadRequestError("Crap is not agreed");
    }
  }
};

const flush = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "agreed") {
      if (foundCrap.owner.toString() !== ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to flush this crap");
      } else {
        foundCrap.status = "flushed";
        await foundCrap.save();
        return foundCrap;
      }
    } else {
      throw new BadRequestError("Crap is not agreed");
    }
  }
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
  interested,
  suggest,
  agree,
  reset,
  flush,
};
