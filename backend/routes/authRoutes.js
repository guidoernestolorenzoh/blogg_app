const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe)

router.get('/solo-admin', protect, authorize('admin'), (req, res) => {
    res.json({ message: 'Bienvenido, admin 👑' });
  });
  

module.exports = router;

