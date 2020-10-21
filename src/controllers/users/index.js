const catchAsync = require('../../utils/catch-async');
const User = require('../../models/user');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: users,
  });
});
const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented',
  });
};

const updateUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented',
  });
};
const deleteUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented',
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
