const Post = require("../models/Post");

const incrementViews = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
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
  
  module.exports = { incrementViews };
  