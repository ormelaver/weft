import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import CSS from 'csstype';
import axios from 'axios';
import { debounce } from 'lodash';

const GetPosts = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get(
      `http://localhost:3001/api/posts/?userId=${userId}`
    );
    const fetchedPosts = res.data;
    setPosts(fetchedPosts);
  };

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/posts/?userId=${userId}&id=${postId}`
      );
      // Refresh the posts after successful deletion
      fetchPosts();
    } catch (error) {
      // Handle error
      console.error('Error deleting post:', error);
    }
  };

  const deleteIconStyle: CSS.Properties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    cursor: 'pointer',
  };

  const filterPosts = (searchText: string) => {
    const filteredPosts = posts.filter((post: any) =>
      post.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filteredPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const debouncedFilter = debounce(filterPosts, 800);
    debouncedFilter(searchText);

    return () => {
      debouncedFilter.cancel();
    };
  }, [searchText, posts]);

  useEffect(() => {
    filterPosts(searchText);
  }, [searchText]);

  const containerStyle: CSS.Properties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f1e7fe',
    color: 'black',
    padding: '2rem',
  };

  const tableStyle: CSS.Properties = {
    width: '70%',
    margin: '2rem auto',
    borderCollapse: 'collapse',
    border: '1px solid #ddd',
  };

  const headlineStyle: CSS.Properties = {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1rem',
  };

  const searchBoxStyle: CSS.Properties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const tableHeaderCellStyle: CSS.Properties = {
    backgroundColor: '#f9f9f9',
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
  };

  const tableBodyCellStyle: CSS.Properties = {
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headlineStyle}>User Posts</h1>
      <input
        type="text"
        placeholder="Search posts"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={searchBoxStyle}
      />
      <table className="table" style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderCellStyle}>Title</th>
            <th style={tableHeaderCellStyle}>Body</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post: any, index) => {
            const isHovered = index === hoveredRowIndex;
            return (
              <tr
                key={post.id}
                onMouseEnter={() => setHoveredRowIndex(index)}
                onMouseLeave={() => setHoveredRowIndex(null)}
                style={{ position: 'relative' }}
              >
                <td style={tableBodyCellStyle}>{post.title}</td>
                <td style={tableBodyCellStyle}>{post.body}</td>
                <td style={{ position: 'relative', ...tableBodyCellStyle }}>
                  {isHovered && (
                    <FaTrash
                      style={deleteIconStyle}
                      onClick={() => handleDelete(post.id)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GetPosts;
