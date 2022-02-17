const {
  fetchCommentsByArticleId,
  insertComment,
} = require("../models/comments_models.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  const { body: comment } = req;
  const { username: author } = comment;
  const { body } = comment;

  insertComment(article_id, author, body)
    .then((response) => {
      res.status(201).send(response);
    })
    .catch(next);
};
