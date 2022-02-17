const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      const article = rows[0];
      return article;
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $2
       WHERE article_id = $1
       RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      const [article] = rows;
      return article;
    });
};
