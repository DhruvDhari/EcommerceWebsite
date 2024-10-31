const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { username, text } = req.body;

  try {
    const newPost = new Post({ username, text });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};
