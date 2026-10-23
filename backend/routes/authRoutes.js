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



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZGFhYWNkZjg2MmYxNDRhOTRhNjdmYiIsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE3OTI3MTU0NzAsImV4cCI6MTc5MzMyMDI3MH0.AU3H_bCGbvJxaTUWzktjqdx9xqNIyLa5ryJmEldDqpA