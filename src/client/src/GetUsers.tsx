import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CSS from 'csstype';
import axios from 'axios';

const GetUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const cellStyle: CSS.Properties = {
    width: '50px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'block',
    whiteSpace: 'nowrap',
  };

  const gotToPosts = () => {
    // This will navigate to first component
    navigate(`/posts/1`);
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/api/users/1');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <table className="table">
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>address</th>
          </tr>
        </thead>
        {users.map((user: any, index) => {
          return (
            <tr key={user.id}>
              <td onClick={gotToPosts}>{user.name}</td>
              <td>{user.email}</td>
              <td style={cellStyle}>{user.address}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default GetUsers;
