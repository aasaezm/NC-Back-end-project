const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
} = require("../models/articles_models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  updateArticleById(article_id, inc_votes)
    .then((patchedArticle) => {
      res.status(200).send({ article: patchedArticle });
    })
    .catch(next);
};
