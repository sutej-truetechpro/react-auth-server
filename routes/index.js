const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
module.exports = router;
