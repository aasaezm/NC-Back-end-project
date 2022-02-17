const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
