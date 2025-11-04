const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../controllers/postController');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/session - Check current session
router.get('/session', authController.getSession);

// PUT /api/auth/account
router.put('/account', isAuthenticated, authController.updateAccount);

module.exports = router;