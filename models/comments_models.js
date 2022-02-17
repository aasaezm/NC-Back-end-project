const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return rows;
    });
};

exports.insertComment = (article_id, author, body) => {
  return db
    .query(
      `INSERT INTO comments
  (author, body, article_id)
  VALUES 
    ($1, $2, $3)
    RETURNING *;`,
      [article_id, author, body]
    )
    .then((response) => {
      console.log(response);
    });
};
