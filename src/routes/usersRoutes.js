const express = require('express');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/users');

const usersRouter = express.Router();

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = usersRouter;
