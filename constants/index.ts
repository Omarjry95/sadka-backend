const app = require("./app");
const user = require("./user");
const payment = require("./payment");

module.exports = {
  ...app,
  ...user,
  ...payment
}