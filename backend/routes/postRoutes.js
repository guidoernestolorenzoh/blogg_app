const express = require("express");
const { createPost, getPosts, getPostById, searchPosts, updatePost, getMyPosts, publishPost, sharePost } = require("../controllers/postController");
const { protect, optionalAuth } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const {storage, fileFilter} = require('../config/multer');
const multer = require('multer');
const { incrementViews } = require("../controllers/incrementViewController");
const { likePost } = require("../controllers/likePostController");

const router = express.Router();

const uploads = multer({ storage, limits: { fileSize: 5120000 },fileFilter });


router.post('/', protect, authorize("writer", "admin"), uploads.single("coverImage"), createPost);
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/mine', protect, getMyPosts);
router.patch('/:id/publish', protect, authorize("writer", "admin"), publishPost);
router.get('/:id', optionalAuth, getPostById);
router.put('/:id', protect, authorize("writer", "admin"), uploads.single("coverImage"), updatePost);
router.post('/:id/view', incrementViews);
router.post('/:id/share', sharePost);
router.post('/:id/like', protect, likePost);


  

module.exports = router;

