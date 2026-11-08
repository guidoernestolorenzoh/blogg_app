const Post = require("../models/Post");
const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Por favor, introduzca un nombre para la categoria" });
    }

    const category = await Category.create({
      name
    });
    
    res.status(201).json({
      message: "Categoria creada satisfactoriamente!",
      category
    });
  } catch (error) {
    if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Ya existe una categoria con ese nombre" });
      }
      res
        .status(500)
        .json({ message: "Error al crear una nueva categoria", error: error.message });    
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las categorias", error: error.message });
  }
};

const getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id)  
  
      if (!category) {
        return res.status(404).json({ message: "No hay categoria para mostrar" });
      }
  
      res.status(200).json(category);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Categoria no encontrada" });
      }
      res
        .status(500)
        .json({ message: "Error al obtener la categoria", error: error.message });
    }
  };
  

module.exports = { createCategory, getCategories, getCategoryById };
