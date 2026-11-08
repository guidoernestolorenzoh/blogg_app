const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
      unique: true,
      trim: true,
    },
    slug: { 
        type: String, 
        trim: true,
        unique: true, 
    },
  },
  { timestamps: true },
);

categorySchema.pre("validate", function () {
    if ((this.isNew || this.isModified("name")) && this.name) {
      this.slug = this.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
  });

module.exports = mongoose.model("Category", categorySchema);
