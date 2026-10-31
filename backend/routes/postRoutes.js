const express = require("express");
const { createPost, getPosts, getPostById } = require("../controllers/postController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");


const router = express.Router();

router.post('/', protect, authorize("writer", "admin"), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);


  

module.exports = router;

