const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// GET /api/posts - Get all posts
router.get('/', postController.isAuthenticated, postController.getAllPosts);

// GET /api/posts/user/:userId - Get posts by user (BEFORE /:id route)
router.get('/user/:userId', postController.isAuthenticated, postController.getPostsByUser);

// POST /api/posts - Create new post
router.post('/', postController.isAuthenticated, postController.createPost);

// GET /api/posts/:id - Get single post
router.get('/:id', postController.isAuthenticated, postController.getPostById);

// PUT /api/posts/:id - Update post
router.put('/:id', postController.isAuthenticated, postController.updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', postController.isAuthenticated, postController.deletePost);

module.exports = router;