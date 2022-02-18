const express = require("express");
const { getTopics } = require("./controllers/topics_controllers");
const { getUsers } = require("./controllers/users_controllers.js");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articles_controllers");

const {
  getCommentsByArticleId,
  deleteCommentById,
} = require("./controllers/comments_controllers.js");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

const app = express();

app.use(express.json());

//Topics
app.get("/api/topics", getTopics);

//Articles
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);
app.patch("/api/articles/:article_id", patchArticleById);

//Comments
app.delete("/api/comments/:comment_id", deleteCommentById);

//Users
app.get("/api/users", getUsers);

//Error handlers
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
