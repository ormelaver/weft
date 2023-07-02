import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { debounce } from 'lodash';

import styles from './posts.module.scss';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [querySearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const userId = querySearchParams.get('userId');
  const page = querySearchParams.get('page') || 1;

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/posts/?userId=${userId}` // &page=${page}&limit=5
      );
      const fetchedPosts = res.data.data;
      setPosts(fetchedPosts);
    } catch (error) {
      navigate(`/`);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/posts/?userId=${userId}&id=${postId}`
      );
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filterPosts = (searchText: string) => {
    const filteredPosts = posts.filter((post: any) =>
      post.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPosts(filteredPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

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

  return (
    <div className={styles.containerStyle}>
      <h1 className={styles.headlineStyle}>User Posts</h1>
      <input
        type="text"
        placeholder="Search posts"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={styles.searchBoxStyle}
      />
      <table className={styles.tableStyle}>
        <thead>
          <tr>
            <th className={styles.tableHeaderCellStyle}>Title</th>
            <th className={styles.tableHeaderCellStyle}>Body</th>
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
                <td className={styles.tableBodyCellStyle}>{post.title}</td>
                <td className={styles.tableBodyCellStyle}>{post.body}</td>
                <td className={styles.trashIconCellStyle}>
                  {isHovered && (
                    <FaTrash
                      className={styles.deleteIconStyle}
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

export default Posts;
