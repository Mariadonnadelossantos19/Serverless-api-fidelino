const express = require("express");
const AuthorModel = require("../models/author");

const router = express.Router();
//Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await AuthorModel.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//getSingleAuthor

router.get("/:id", getAuthor, (req, res) => {
  res.json(res.author);
});

//createAuthor
router.post("/", async (req, res) => {
  try {
    //validate the request
    if (!req.body.name || !req.body.age) {
      return res.status(400).json({ message: "Name and Age are required" });
    }
    //check if author already exists
    const existingAuthor = await AuthorModel.findOne({
      name: req.body.name,
    });
    if (existingAuthor) {
      return res.status(400).json({ message: "Author already exists" });
    }

    const author = new AuthorModel(req.body);
    const newAuthor = await author.save();
    res.status(201).json({ message: "Author created", author: newAuthor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//updateAuthor
router.patch("/:id", getAuthor, async (req, res) => {
  try {
    if (req.body.name != null) {
      res.author.name = req.body.name;
    }
    const updatedAuthor = await res.author.save();
    res.json({ message: "Author updated", author: updatedAuthor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", getAuthor, async (req, res) => {
  try {
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json({ message: "Author updated", author: updatedAuthor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//deleteAuthor
router.delete("/:id", getAuthor, async (req, res) => {
  try {
    await AuthorModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Author deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
async function getAuthor(req, res, next) {
  try {
    const author = await AuthorModel.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.author = author;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = router;