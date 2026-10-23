const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true, 
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },    
    role: {
      type: String,
      enum: ['admin', 'writer', 'member'],
      default: 'member', 
    },
    // 📌 Autores que este usuario sigue (solo writers/admins).   
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // 🧑‍💼 Campos del perfil
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Máximo 1000 caracteres'],
    },
    avatar: {
      type: String, // ruta: "/uploads/avatar-123.jpg"
      default: '',
    },
    title: {
      type: String, // ej: "Pastor", "Editora", "CEO Founder"
      default: '',
      trim: true,
    },
  },
  { timestamps: true } 
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; 
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
