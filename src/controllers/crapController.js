"use strict";

const crapService = require("../services/crapService");

const createCrap = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const newCrap = await crapService.createCrap({
      ...req.sanitizeBody,
      ownerId,
    });

    res.status(201).json({
      data: newCrap,
    });
  } catch (err) {
    next(err);
  }
};

const interested = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const interestedInCrap = await crapService.interested(id, ownerId);

    res.json({
      data: interestedInCrap,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCrap = async (_req, res) => {
  const crap = await crapService.getAllCrap();

  res.json({
    data: crap,
  });
};

const getOneCrap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const crap = await crapService.getOneCrap(id);

    res.json({
      data: crap,
    });
  } catch (err) {
    next(err);
  }
};

const getMyCrap = async (req, res, next) => {
  try {
    const ownerId = req.user._id.toString();
    const myCrap = await crapService.getMyCrap(ownerId);

    res.json({
      data: myCrap,
    });
  } catch (err) {
    next(err);
  }
};

const updateCrap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const sanitizeBody = req.sanitizeBody;
    const updatedCrap = await crapService.updateCrap(id, ownerId, sanitizeBody);

    res.json({
      data: updatedCrap,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCrap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const deletedCrap = await crapService.deleteCrap(id, ownerId);

    res.json({
      data: deletedCrap,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCrap,
  getAllCrap,
  getOneCrap,
  getMyCrap,
  updateCrap,
  deleteCrap,
};
