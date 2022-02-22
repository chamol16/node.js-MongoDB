const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { isLoggedIn } = require("../libs/auth");

router.get("/notes/add", isLoggedIn, async (req, res) => {
  res.render("notes/newNote");
});

router.get("/notes/newNote", isLoggedIn, async (req, res) => {
  res.render("notes/newNote");
});

//create - save
router.post("/notes/newNote", isLoggedIn, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    req.flash("fail", "Empty spaces");
    res.redirect("/notes/add");
  } else {
    const newNote = new Note({ title, description });
    newNote.user = req.user._id;
    await newNote.save();
    req.flash("success", "Note created successfully");
    res.redirect("/notes");
  }
});

//read - find
router.get("/notes", isLoggedIn, async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).lean();
  res.render("notes/allNotes", { notes });
});

router.get("/notes/edit/:id", isLoggedIn, async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  res.render("notes/editNote.hbs", { note });
});

//update
router.put("/notes/editNote/:id", async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success", "Note updated successfully");
  res.redirect("/notes");
});

//delete

router.delete("/notes/delete/:id", isLoggedIn, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success", "Note deleted successfully");
  res.redirect("/notes");
});

module.exports = router;
