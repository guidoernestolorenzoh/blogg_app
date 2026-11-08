const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "The title is required"],
      trim: true,
    },
    slug: { 
        type: String, 
        trim: true,
        unique: true, 
    },
    content: {
      type: String,
      required: [true, "The content is required"],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

postSchema.pre("validate", function () {
    if ((this.isNew || this.isModified("title")) && this.title) {
      this.slug = this.title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
  });

module.exports = mongoose.model("Post", postSchema);
