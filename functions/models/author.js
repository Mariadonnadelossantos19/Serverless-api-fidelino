const mongoose = require("mongoose");
const authorSchema = require("../schema/author");

const AuthorModel = mongoose.model("Author", authorSchema);

module.exports = AuthorModel;