import React, { useState, useEffect } from 'react';
import CSS from 'csstype';
import axios from 'axios';

const GetPosts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:3001/api/posts/1');
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return <div>Posts!!</div>;
};

export default GetPosts;
