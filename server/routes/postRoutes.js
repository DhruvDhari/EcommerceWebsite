const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createPost);
router.get('/', protect, getPosts);

module.exports = router;
