const Post = require("../models/Post");
const Category = require("../models/Category");
const { generarExcerpt } = require("../utils/text");

const createPost = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Por favor, seleccione una categoria" });
    }

    const existingCategory  = await Category.findById(category);
    if (!existingCategory) {
      return res
        .status(400)
        .json({ message: "No existe ninguna categoria" });
    }
    
    const coverImage = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";
    const tags = req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags]
      : [];
    const excerpt = generarExcerpt(content, 3);
    const post = await Post.create({
      title,
      content,
      excerpt,
      coverImage,
      category,
      status,
      tags,
      author: req.user._id,
    });
    await post.populate("author", "name avatar bio title");
    await post.populate("category", "name slug");
    
    res.status(201).json({
      message: "Post creado satisfactoriamente!",
      post,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "La categoría seleccionada no es válida" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un post con ese título" });
    }
    res
      .status(500)
      .json({ message: "Error al crear un nuevo post", error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "name avatar bio title")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {    
    res
      .status(500)
      .json({ message: "Error al obtener los posts", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    .populate(
      "author",
      "name avatar bio title",
    )
    .populate(
      "category",
      "name slug",
    )

    if (!post) {
      return res.status(404).json({ message: "No hay post para mostrar" });
    }

    res.status(200).json(post);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    res
      .status(500)
      .json({ message: "Error al obtener el post", error: error.message });
  }
};

module.exports = { createPost, getPosts, getPostById };
