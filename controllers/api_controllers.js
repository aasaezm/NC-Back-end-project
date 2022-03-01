const { fetchEndpoints } = require("../models/api_models.js");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints().then(res.status(200).json(endpoints)).catch(next);
};
