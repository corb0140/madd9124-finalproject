const validateCrapData = (req, res, next) => {
  const { title, description, location } = req.body;

  if (title && description && location) {
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
