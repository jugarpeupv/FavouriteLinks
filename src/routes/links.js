const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedin } = require("../lib/auth");

router.get("/add", isLoggedin, (req, res) => {
  res.render("links/add");
});

router.post("/add", isLoggedin, async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash("success", "Link saved successfully");
  res.redirect("/links");
});

// Aquí estamos en /links porque está añadida esta ruta como middleware. Le pasamos links a la vista
router.get("/", isLoggedin, async (req, res) => {
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [
    req.user.id,
  ]);
  res.render("links/list", { links });
});

router.get("/delete/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash("success", "Link removed successfully");
  res.redirect("/links");
});

router.get("/edit/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE ID= ?", [id]);
  res.render("links/edit", { link: links[0] });
});

router.post("/edit/:id", isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url,
  };
  await pool.query("UPDATE links set ? WHERE id= ?", [newLink, id]);
  req.flash("success", "Link updated succesfully");
  res.redirect("/links");
});

module.exports = router;
