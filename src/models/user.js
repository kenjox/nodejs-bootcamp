const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [validator.isEmail, 'Please provide valid email address'],
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false, // Hide the field from response
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirm is required'],
    validate: {
      // Only work on SAVE
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password does not match',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (req, res, next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Dont save confirm password in db ...delete the field
  this.passwordConfirm = undefined;
});

// Create password check on schema instance
userSchema.methods.isValidPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
  // If user changed password, then the field changedPasswordAt will exist in db
  if (this.passwordChangedAt) {
    const passChanged = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return jwtTimeStamp < passChanged;
  }

  // Password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
