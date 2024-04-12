"use strict";

const crapService = require("../services/crapService");

const createCrap = async (req, res, next) => {
  try {
    const ownerId = req.user._id.toString();
    const newCrap = await crapService.createCrap(
      {
        ...req.sanitizeBody,
        ownerId,
      },
      req.files
    );

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

const suggest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const sanitizeBody = req.sanitizeBody;
    const suggestedCrap = await crapService.suggest(id, ownerId, sanitizeBody);

    res.json({
      data: suggestedCrap,
    });
  } catch (err) {
    next(err);
  }
};

const agree = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const agreedCrap = await crapService.agree(id, ownerId);

    res.json({
      data: agreedCrap,
    });
  } catch (err) {
    next(err);
  }
};

const disagree = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const disagreedCrap = await crapService.disagree(id, ownerId);

    res.json({
      data: disagreedCrap,
    });
  } catch (err) {
    next(err);
  }
};

const reset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const resetCrap = await crapService.reset(id, ownerId);

    res.json({
      data: resetCrap,
    });
  } catch (err) {
    next(err);
  }
};

const flush = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const flushedCrap = await crapService.flush(id, ownerId);

    res.json({
      data: flushedCrap,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCrap = async (req, res, next) => {
  try {
    const { query, lat, long, distance, show_taken } = req.query;

    const crap = await crapService.getAllCrap(
      query,
      lat,
      long,
      distance,
      show_taken
    );

    res.json({
      data: crap,
    });
  } catch (err) {
    next(err);
  }
};

const getOneCrap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id.toString();
    const crap = await crapService.getOneCrap(id, ownerId);

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
  interested,
  suggest,
  agree,
  disagree,
  reset,
  flush,
};
