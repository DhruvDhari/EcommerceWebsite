import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Post() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
  
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUsername();
  }, []);

  const handlePost = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
        username,
        text: message,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setPosts([...posts, response.data]);
      setMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className="post-container">
      <h2>Post </h2>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <p><strong>{post.username}</strong>: {post.text}</p>
          </div>
        ))}
      </div>
      <textarea
    
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Write your message here..."
  />
  <button className='post-button' onClick={handlePost}>Post</button>
    </div>
  );
}

export default Post;
