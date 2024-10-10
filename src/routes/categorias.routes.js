import { Router } from "express";
import pool from "../database/database.js";
const router = Router();

router.get("/list", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM dish_category");
    res.render("categorias/list", { categorias: result });
    console.log(result)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Agregar categorria
/*router.get("/add", async (req, res) => {
  res.render("categorias/add");
});*/

router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    const newCategoria = { name };
    await pool.query("INSERT INTO dish_category SET ?", [newCategoria]);
    res.redirect("/list");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Editar
router.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [categoria] = await pool.query(
      "SELECT * FROM dish_category WHERE dish_category_id = ?",
      [id]
    );
    const categoriaEdit = categoria[0];

    res.render("categorias/edit", { categoria: categoriaEdit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/edit/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const editCategoria = { name };
    await pool.query("UPDATE dish_category SET ? WHERE dish_category_id = ?", [
      editCategoria,
      id,
    ]);
    res.redirect("/list");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await pool.query("DELETE FROM dish WHERE dish_category_id = ?", [id]);
    await pool.query("DELETE FROM dish_category WHERE dish_category_id = ?", [
      id,
    ]);
    res.redirect("/list");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;