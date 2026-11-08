const express = require("express");
const { register, login, getMe, uploadAvatar } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {storage, fileFilter} = require('../config/multer');
const multer = require('multer');


const router = express.Router();
const uploads = multer({ storage, limits: { fileSize: 5120000 },fileFilter });


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe)
router.put("/avatar", protect, uploads.single("avatar"), uploadAvatar);


  

module.exports = router;

