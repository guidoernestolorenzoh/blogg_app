const express = require("express");
const { createCategory, getCategories, getCategoryById } = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();


router.post('/', protect, authorize("admin"), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);


  

module.exports = router;

