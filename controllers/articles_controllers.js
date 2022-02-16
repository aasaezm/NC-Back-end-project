const {
  fetchArticleById,
  updateArticleById,
} = require("../models/articles_models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};
