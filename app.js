const express = require("express");
const { getTopics } = require("./controllers/topics_controllers");
const { getArticleById } = require("./controllers/articles_controllers");
const { getUsers } = require("./controllers/users_controllers.js");
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

//Users
app.get("/api/users", getUsers);

//Error handlers
app.all("/*", (req, res) => {
  console.log(res);
  res.status(404).send({ msg: "Path not found" });
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
