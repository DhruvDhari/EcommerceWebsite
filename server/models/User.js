const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default:'https://walnuteducation.com/static/core/images/icon-profile.png' },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
},
{ 
  timestamps: true 
},
);

module.exports = mongoose.model('User', userSchema);
