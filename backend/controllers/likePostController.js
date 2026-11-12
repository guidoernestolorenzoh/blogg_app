const Post = require("../models/Post");

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "No hay post para mostrar" });
    }

    const userId = req.user._id;
    const alreadyLiked = (post.likedBy || []).some(
      (id) => id.toString() === userId.toString(),
    );

    const update = alreadyLiked
      ? { $pull: { likedBy: userId }, $inc: { likes: -1 } }
      : { $addToSet: { likedBy: userId }, $inc: { likes: 1 } };

    const updated = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate("author", "name avatar bio title")
      .populate("category", "name slug");

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    res
      .status(500)
      .json({ message: "Error al dar like", error: error.message });
  }
};

module.exports = { likePost };
