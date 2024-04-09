const validateCrapData = (req, res, next) => {
  const { title, description, location, status } = req.body;

  if (title && description && location && status) {
    next();
    return;
  }

  res.status(400).json({
    error: {
      message: "Invalid crap information",
    },
  });
};

module.exports = validateCrapData;
