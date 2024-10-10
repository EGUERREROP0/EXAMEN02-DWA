import { Router } from "express";
import pool from "../database/database.js";

const router = Router();

router.get("/list-plato", async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT dish.*, dish_category.name AS category_name 
       FROM dish 
       INNER JOIN dish_category ON dish.dish_category_id = dish_category.dish_category_id`
    );
    res.render("platos/list", { platos: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Crear palto
router.get("/add-plato", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM dish_category");
    res.render("platos/add", { categorias: result });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add-plato", async (req, res) => {
  try {
    const { name, description, stock, price, status, dish_category_id } =
      req.body;
    const newPlato = {
      name,
      description,
      stock,
      price,
      status,
      dish_category_id,
    };

    await pool.query("INSERT INTO dish SET ?", [newPlato]);
    res.redirect("/list-plato");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Actualizar plato
router.get("/edit-plato/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [plato] = await pool.query("SELECT * FROM dish WHERE dish_id = ?", [
      id,
    ]);
    const [categorias] = await pool.query("SELECT * FROM dish_category");
    const platoEdit = plato[0];
    res.render("platos/edit", { plato: platoEdit, categorias: categorias });
    console.log(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/edit-plato/:id", async (req, res) => {
  try {
    const { name, description, stock, price, status, dish_category_id } =
      req.body;
    const { id } = req.params;
    console.log(id);
    const editPlato = {
      name,
      description,
      stock,
      price,
      status,
      dish_category_id,
    };
    await pool.query("UPDATE dish SET ? WHERE dish_id = ?", [editPlato, id]);
    res.redirect("/list-plato");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//eliminar
router.get("/delete-plato/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await pool.query("DELETE FROM dish WHERE dish_id = ?", [id]);
    res.redirect("/list-plato");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
