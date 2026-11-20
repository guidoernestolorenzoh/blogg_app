const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, rellene todos los campos" });
    }

    const exist = await User.findOne({ email: email.toLowerCase().trim() });
    if (exist) {
      return res.status(400).json({ message: "Ese email ya está registrado" });
    }

    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({
        message: "Usuario creado satisfactoriamente!",
        user,
        token: generateToken(user),
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el registro", error: error.message });
  }
};

const updateProfile  = async (req, res) => {
  try {
    const { name, bio, title } = req.body;

    if (name !== undefined && !name.trim()) {
      return res
        .status(400)
        .json({ message: "El nombre no puede estar vacio" });
    }

    const user = req.user;

    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (title !== undefined) user.title = title;

    const updated = await user.save();

    res
      .status(200)
      .json({
        message: "Perfil actualizado satisfactoriamente!",
        user:updated,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, rellene todos los campos" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

    res.status(201)
      .json({
        message: "Bienvenido!!",
        user,
        token: generateToken(user),
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Credenciales inválidas", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se envió ninguna imagen" });
    }

    req.user.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await req.user.save();
    res.json({ message: "Avatar actualizado", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Error al subir el avatar", error: error.message });
  }
};


const getMe = async (req, res) => {
    res.json(req.user);
}

module.exports = {register, login, uploadAvatar, getMe, updateProfile };