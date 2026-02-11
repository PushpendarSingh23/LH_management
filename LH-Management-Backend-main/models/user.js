const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: { type: String},
  password: { type: String, required: true },
  email: {type: String, required: true},
  role: { type: String, enum: ['systemAdministrator', 'assistantRegistrar', 'guard', 'facultyMentor', 'gsec'], required: true },
  resetToken: String, 
  resetTokenExpiration: Date,
});

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password') || user.isNew) {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
//   }
//   next();
// });

// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };


const User = mongoose.model('User', userSchema);

module.exports = User;
