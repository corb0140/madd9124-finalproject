"use strict";

const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../middlewares/errors");

const debug = require("debug")("petR-Authentication:service/petService");
const Crap = require("../models/crap");

const imageService = require("./imageService");

const createCrap = async (body, files) => {
  debug(body);

  const crap = new Crap(body);

  crap.status = "AVAILABLE";

  const long = crap.location.coordinates[0];
  const lat = crap.location.coordinates[1];
  crap.location = {
    type: "Point",
    coordinates: [long, lat],
  };

  const urls = await imageService.uploadImages(files);
  crap.images = urls;

  await crap.save();

  return crap;
};

const interested = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap.owner.toString() === ownerId) {
    throw new ForbiddenError("You cannot show interest in your own crap");
  }

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "AVAILABLE") {
      foundCrap.status = "INTERESTED";
      foundCrap.buyer = ownerId;
      await foundCrap.save();
      return foundCrap;
    } else {
      throw new BadRequestError("Crap is not available");
    }
  }
};

const suggest = async (id, ownerId, body) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "INTERESTED") {
      if (foundCrap.buyer.toString() === ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to suggest this crap");
      } else {
        foundCrap.status = "SCHEDULED";

        const { address, date, time } = body;

        foundCrap.suggestion = {
          address: address,
          date: date,
          time: time,
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

    if (status === "SCHEDULED") {
      if (foundCrap.owner.toString() === ownerId.toString()) {
        throw new ForbiddenError(
          "You are the seller, you are not allowed to agree to this crap"
        );
      } else {
        foundCrap.status = "AGREED";
        await foundCrap.save();
        return foundCrap;
      }
    } else {
      throw new BadRequestError("Crap is not scheduled");
    }
  }
};

const disagree = async (id, ownerId) => {
  const foundCrap = await Crap.findById(id);

  if (foundCrap) {
    const status = foundCrap.status;

    if (status === "SCHEDULED") {
      if (foundCrap.owner.toString() === ownerId.toString()) {
        throw new ForbiddenError(
          "You are the seller, you not allowed to disagree to this crap"
        );
      } else {
        foundCrap.status = "INTERESTED";
        foundCrap.suggestion = null;
        await foundCrap.save();
        return foundCrap;
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

    if (status !== "FLUSHED") {
      if (foundCrap.owner.toString() !== ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to reset this crap");
      } else {
        foundCrap.status = "AVAILABLE";
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

    if (status === "AGREED") {
      if (foundCrap.owner.toString() !== ownerId.toString()) {
        throw new ForbiddenError("You are not allowed to flush this crap");
      } else {
        foundCrap.status = "FLUSHED";
        await foundCrap.save();
        return foundCrap;
      }
    } else {
      throw new BadRequestError("Crap is not agreed");
    }
  }
};

const getAllCrap = async (query, long, lat, distance, show_taken) => {
  if ((!query && show_taken === "true") || (!query && show_taken === "false")) {
    const crapResults = await Crap.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [long, lat] },
          $maxDistance: distance,
        },
      },
      status:
        (show_taken === "true" && "AVAILABLE") ||
        (show_taken === "false" && { $ne: "FLUSHED" }),
    }).populate({ path: "owner", select: "name" });

    const sortCraps = crapResults.sort((a, b) => {
      const distanceA = a.location.coordinates[0] - lat;
      const distanceB = b.location.coordinates[0] - lat;

      return distanceA - distanceB;
    });

    const craps = sortCraps.map((crap) => {
      return {
        _id: crap._id,
        title: crap.title,
        description: crap.description,
        images: crap.images,
        status: crap.status,
        owner: crap.owner,
        createdAt: crap.createdAt,
        updatedAt: crap.updatedAt,
      };
    });

    return craps;
  }

  const queryPattern = new RegExp(".*" + query + ".*");

  if ((query && show_taken === "true") || (query && show_taken === "false")) {
    const crapResults = await Crap.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [long, lat] },
          $maxDistance: distance,
        },
      },
      title: queryPattern,
      status:
        (show_taken === "true" && "AVAILABLE") ||
        (show_taken === "false" && { $ne: "FLUSHED" }),
    }).populate({ path: "owner", select: "name" });

    const sortCraps = crapResults.sort((a, b) => {
      const distanceA = a.location.coordinates[0] - lat;
      const distanceB = b.location.coordinates[0] - lat;

      return distanceA - distanceB;
    });

    const craps = sortCraps.map((crap) => {
      return {
        _id: crap._id,
        title: crap.title,
        description: crap.description,
        images: crap.images,
        status: crap.status,
        owner: crap.owner,
        createdAt: crap.createdAt,
        updatedAt: crap.updatedAt,
      };
    });

    return craps;
  }
};

const getOneCrap = async (id, ownerId) => {
  const crap = await Crap.findById(id);

  if (crap.owner.toString() === ownerId) {
    return crap.populate({ path: "owner", select: "name" });
  }

  if (crap.owner.toString() !== ownerId && crap.status === "AGREED") {
    return Crap.findById(id)
      .select("-location -buyer")
      .populate({ path: "owner", select: "name" });
  } else if (crap.owner.toString() !== ownerId && crap.status === "SCHEDULED") {
    return Crap.findById(id)
      .select("-location -buyer")
      .populate({ path: "owner", select: "name" });
  } else if (crap.owner.toString() !== ownerId) {
    return Crap.findById(id)
      .select("-location -buyer -suggestion")
      .populate({ path: "owner", select: "name" });
  }

  if (!crap) {
    throw new NotFoundError("Crap not found");
  }
};

const getMyCrap = async (owner) => {
  const myCrap = await Crap.find({ owner }).populate("owner");
  const crapImInterestedIn = await Crap.find({
    buyer: owner,
    status: { $ne: "AVAILABLE" },
  }).populate("owner");

  const myCraps = myCrap.concat(crapImInterestedIn);

  myCraps.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  return myCraps;
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
  disagree,
  reset,
  flush,
};
