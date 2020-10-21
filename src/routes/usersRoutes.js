const express = require('express');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/users');

const { signup, signin } = require('../controllers/auth/auth');

const usersRouter = express.Router();

usersRouter.post('/signup', signup);
usersRouter.post('/signin', signin);

usersRouter.route('/').get(getAllUsers);
usersRouter
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = usersRouter;
