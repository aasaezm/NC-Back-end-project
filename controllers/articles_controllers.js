const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
} = require("../models/articles_models.js");

const { checkExists } = require("../db/helpers/utils.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {
    query: { sort_by, order, topic },
  } = req;

  if (topic) {
    checkExists("articles", "topic", topic)
      .then(() => {
        fetchArticles(sort_by, order, topic)
          .then((articles) => {
            res.status(200).send({ articles });
          })
          .catch(next);
      })
      .catch(next);
  } else {
    fetchArticles(sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.patchArticleById = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  updateArticleById(article_id, inc_votes)
    .then((patchedArticle) => {
      res.status(200).send({ patchedArticle });
    })
    .catch(next);
};
