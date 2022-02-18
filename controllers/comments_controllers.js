const {
  fetchCommentsByArticleId,
  removeCommentById,
} = require("../models/comments_models.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
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
