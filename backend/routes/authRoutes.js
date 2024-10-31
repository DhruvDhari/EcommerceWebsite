const express = require('express');
const multer = require('multer');
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage });


router.post('/register',upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get('/me',protect , getUser);

module.exports = router;
