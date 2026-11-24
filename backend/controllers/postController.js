const mongoose = require("mongoose");
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

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "No existe ninguna categoria" });
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
    await post.populate("author", "name avatar bio title email");
    await post.populate("category", "name slug");

    res.status(201).json({
      message: "Post creado satisfactoriamente!",
      post,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "La categoría seleccionada no es válida" });
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

const updatePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    
    const { title, content, category, status } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res
        .status(400)
        .json({ message: "Por favor, rellene los campos" });
    }
    
    if (!category) {
      return res
        .status(400)
        .json({ message: "Por favor, seleccione una categoria" });
    }

    const existing = await Post.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Post no encontrado" });
      if (existing.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "No tienes permiso para editar este post" });
      }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "No existe ninguna categoria" });
    }

    const excerpt = generarExcerpt(content, 3);

    const updateData = {
      title: title.trim(),
      content: content.trim(),
      excerpt,
      category      
    };
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }
    if (req.body.tags !== undefined) {
      updateData.tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    }
    if (req.file) {
      updateData.coverImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    
    const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    
    await post.populate("author", "name avatar bio title email");
    await post.populate("category", "name slug");
    
    res.status(200).json({
      message: "Post actualizado satisfactoriamente!",
      post,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "La categoría seleccionada no es válida" });
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
      .json({ message: "Error al actualizar el post", error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    if (!req.query.page || !req.query.limit) {
      const posts = await Post.find({ status: "published" })
        .populate("author", "name avatar bio title email")
        .populate("category", "name slug")
        .sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } 

    const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;

      const total = await Post.countDocuments({ status: "published" });
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      const posts = await Post.find({ status: "published" })
        .populate("author", "name avatar bio title email")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return res.status(200).json({ posts, totalPages, hasMore });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los posts", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar bio title email")
      .populate("category", "name slug");

    if (!post) {
      return res.status(404).json({ message: "No hay post para mostrar" });
    }
    
    if (post.status === "draft") {
      const isOwner = req.user && post.author._id.toString() === req.user._id.toString();
      const isAdmin = req.user && req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(404).json({ message: "No hay post para mostrar" });
      }
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

const getMyPosts = async (req, res) => {
  try {
    if (!req.query.page || !req.query.limit) {
      const posts = await Post.find({ author: req.user._id })
        .populate("author", "name avatar bio title email")
        .populate("category", "name slug")
        .sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } 

    const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;

      const total = await Post.countDocuments({ author: req.user._id });
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      const posts = await Post.find({ author: req.user._id })
        .populate("author", "name avatar bio title email")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return res.status(200).json({ posts, totalPages, hasMore });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los posts", error: error.message });
  }
};

const publishPost = async (req, res) => {
  try {
    const existing = await Post.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Post no encontrado" });
    if (existing.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para editar este post" });
    }
      const post = await Post.findByIdAndUpdate(
          req.params.id,
          { status: "published"  },
          { new: true, runValidators: true }
        )
          .populate("author", "name avatar bio title")
          .populate("category", "name slug");
        
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

const searchPosts = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(400).json({ message: "Escribe algo para buscar" });
    }

    const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const posts = await Post.find({
      status: "published",
      $or: [
        { title: { $regex: safeQ, $options: "i" } },
        { content: { $regex: safeQ, $options: "i" } },
      ],
    })
      .populate("author", "name avatar bio title email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar posts", error: error.message });
  }
};

const sharePost = async (req, res) => {
  try {
      const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { shares: 1 } },
          { new: true }
        )
          .populate("author", "name avatar bio title")
          .populate("category", "name slug");
        
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

module.exports = { createPost, getPosts, getPostById, searchPosts, publishPost, updatePost, getMyPosts, sharePost };
