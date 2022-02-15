const express = require("express");
const { getTopics } = require("./controllers/topics_controllers");

const app = express();

app.use(express.json());

//Topics
app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
module.exports = app;
