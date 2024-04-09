"use strict";

const crapService = require("../services/crapService");

const getAllCrap = async (_req, res) => {
  const crap = await crapService.getAllCrap();

  res.json({
    data: crap,
  });
};

module.exports = {
  getAllCrap,
};
