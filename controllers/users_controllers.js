const { fetchUsers } = require("../models/users_models.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch(next);
};
