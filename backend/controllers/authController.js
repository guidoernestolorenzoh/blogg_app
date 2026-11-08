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
    // 1. Si multer no dejó archivo, no hay nada que guardar
    if (!req.file) {
      return res.status(400).json({ message: "No se envió ninguna imagen" });
    }

    // 2. req.user YA viene de protect, no hay que buscar el token de nuevo
    req.user.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // 3. Guardar ese cambio en la base de datos
    await req.user.save();

    // 4. Responder, que es lo que faltaba en tu versión
    res.json({ message: "Avatar actualizado", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Error al subir el avatar", error: error.message });
  }
};


const getMe = async (req, res) => {
    res.json(req.user);
}

module.exports = {register, login, uploadAvatar, getMe };