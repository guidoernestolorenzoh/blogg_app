const Post = require("../models/Post");
const { generarExcerpt } = require("../utils/text");

const createPost = async (req, res) => {
    try {
      const { title, content, coverImage, category, status, tags } = req.body;
   
      const excerpt = generarExcerpt(content, 3);
      const post = await Post.create({ 
        title, content, excerpt, coverImage, category, status, tags,
        author: req.user._id,
    });
    await post.populate("author", "name avatar");
      res
        .status(201)
        .json({
          message: "Post creado satisfactoriamente!",
          post,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).json({ message: "Ya existe un post con ese título" });
          }
          res.status(500).json({ message: "Error al crear un nuevo post", error: error.message });
    }
  };

  const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ status: "published" })
        .populate("author", "name avatar")
        .sort({createdAt: -1});

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: "Error al obtener los posts", error: error.message});
    }
  };
  
  const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate("author", "name avatar")

        if (!post) {
           return res.status(404).json({message:"No hay post para mostrar"})
        }

        res.status(200).json(post);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Post no encontrado" });
      }
      res.status(500).json({ message: "Error al obtener el post", error: error.message });
    }
  };

  module.exports = { createPost, getPosts, getPostById };