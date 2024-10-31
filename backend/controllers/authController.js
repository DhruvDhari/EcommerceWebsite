const bcrypt = require('bcryptjs');
const User = require('../models/User');

const { generateToken } = require('../utils/jwt');



exports.registerUser = async (req, res) => {

  const { username, email, password } = req.body;

  const profileImage = req.file ? `/uploads/${req.file.filename}` : 'https://walnuteducation.com/static/core/images/icon-profile.png';
  
  // const profilePhoto = req.file ? req.file.path : 'https://walnuteducation.com/static/core/images/icon-profile.png';


  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const nameHasDigits = /\d/; 
  if (nameHasDigits.test(username)) {
    return res.status(400).json({ message: 'Name should not contain any digits' });
  }
  try {
 
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword,profileImage });   


  
    const token = generateToken(user._id);
    res.status(201).json({ userId: user._id, username: user.username, profileImage:user.profileImage ,token});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {

  const { email, password } = req.body;


  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
  
    // res.json({ userId: user._id, username: user.username, token });
    res.status(200).json({
      token,
      email,
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage // Send profile image URL
  });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
