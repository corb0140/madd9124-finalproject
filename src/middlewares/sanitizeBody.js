const debug = require("debug")("final-project:middleware:sanitizeBody");
const xss = require("xss");

const sanitize = (str) =>
  xss(str, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });

const stripTags = (payload) => {
  const { ...attributes } = payload;

  debug(payload);

  for (const key in attributes) {
    const value = attributes[key];
    if (Array.isArray(value)) {
      attributes[key] = value.map((v) =>
        typeof v === "object" ? stripTags(v) : sanitize(v)
      );
    } else if (typeof value === "object") {
      attributes[key] = stripTags(value);
    } else {
      attributes[key] = sanitize(value);
    }
  }

  return attributes;
};

const sanitizeBody = (req, res, next) => {
  const { id, _id, ...attributes } = req.body;

  req.sanitizeBody = stripTags(attributes);

  next();
};

module.exports = sanitizeBody;
