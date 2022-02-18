const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf8").then((response) => {
    const endpoints = JSON.parse(response);
    return endpoints;
  });
};
