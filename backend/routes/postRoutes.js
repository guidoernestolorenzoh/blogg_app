const express = require("express");
const { createPost, getPosts, getPostById } = require("../controllers/postController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const {storage, fileFilter} = require('../config/multer');
const multer = require('multer');

const router = express.Router();

const uploads = multer({ storage, limits: { fileSize: 5120000 },fileFilter });


router.post('/', protect, authorize("writer", "admin"), uploads.single("coverImage"), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);


  

module.exports = router;

