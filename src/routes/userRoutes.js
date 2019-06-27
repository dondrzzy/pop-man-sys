const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const userController = require('../controllers/userController');

userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.registerUser);
userRouter.post('/login', userController.loginUser);

module.exports = userRouter;