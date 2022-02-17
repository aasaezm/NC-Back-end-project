const express = require("express");
const { getTopics } = require("./controllers/topics_controllers");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles_controllers");
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
app.patch("/api/articles/:article_id", patchArticleById);

//Error handlers
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
