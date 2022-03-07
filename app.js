const express = require("express");
const cors = require("cors");
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
  postComment,
} = require("./controllers/comments_controllers.js");

const { getEndpoints } = require("./controllers/api_controllers.js");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

const app = express();

app.use(cors());

app.use(express.json());

//Topics
app.get("/api/topics", getTopics);

//Articles
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.patch("/api/articles/:article_id", patchArticleById);

//Comments
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

//Users
app.get("/api/users", getUsers);

//API
app.get("/api/", getEndpoints);

//Error handlers
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
