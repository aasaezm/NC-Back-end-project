const {
  fetchCommentsByArticleId,
  removeCommentById,
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
    .then((comment) => {
      res.status(201).send({ postedComment: comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const {
    params: { comment_id },
  } = req;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
