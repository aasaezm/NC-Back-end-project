const { fetchTopics } = require("../models/topics_models");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send(topics);
  });
};
