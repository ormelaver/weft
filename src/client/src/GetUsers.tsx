import React, { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';

import CSS from 'csstype';
import axios from 'axios';

const GetUsers = ({ page }: any) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [expandedCells, setExpandedCells] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(4);

  const goToPosts = (userId: number) => {
    const params = { userId: userId.toString() };
    navigate({
      pathname: '/posts',
      search: `?${createSearchParams(params)}`,
    });
  };

  const fetchUsers = async () => {
    const res = await axios.get(
      `http://localhost:3001/api/users/?page=${currentPage}`
    );
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleAddressClick = (index: number) => {
    if (expandedCells.includes(index)) {
      setExpandedCells(
        expandedCells.filter((cellIndex) => cellIndex !== index)
      );
    } else {
      setExpandedCells([...expandedCells, index]);
    }
  };

  const handleSort = (sortBy: 'name') => {
    const startIndex = (currentPage - 1) * perPage;
    let endIndex = currentPage * perPage;

    // Adjust endIndex if it exceeds the length of the users array
    if (endIndex > users.length) {
      endIndex = users.length;
    }

    const usersForCurrentPage = [...users].slice(startIndex, endIndex);

    usersForCurrentPage.sort((a: any, b: any) => {
      const nameA = a[sortBy].toUpperCase();
      const nameB = b[sortBy].toUpperCase();

      if (nameA < nameB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const updatedUsers = [...users];
    for (let i = startIndex, j = 0; i < endIndex; i++, j++) {
      updatedUsers[i] = usersForCurrentPage[j];
    }

    setUsers(updatedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const cellStyle: CSS.Properties = {
    width: '50px',
    textOverflow: 'ellipsis',
    overflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  };

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

  const tableHeaderCellStyle: CSS.Properties = {
    backgroundColor: '#f9f9f9',
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
  };

  const nameColumnCellStyle: CSS.Properties = {
    ...tableHeaderCellStyle,
    cursor: 'pointer',
  };

  const tableBodyCellStyle: CSS.Properties = {
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
  };

  const pageContainerStyle: CSS.Properties = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  };

  const pageLinkStyle: CSS.Properties = {
    margin: '0.5rem',
    color: '#000',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const currentPageStyle: CSS.Properties = {
    fontWeight: 'bold',
    color: '#ccc',
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(users.length / perPage);

  // Create array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={containerStyle}>
      <h1>Users</h1>
      <table className="table" style={tableStyle}>
        <thead>
          <tr>
            <th style={nameColumnCellStyle} onClick={() => handleSort('name')}>
              Name
            </th>
            <th style={tableHeaderCellStyle}>Email</th>
            <th style={tableHeaderCellStyle}>Address</th>
          </tr>
        </thead>
        <tbody>
          {users
            .slice((currentPage - 1) * perPage, currentPage * perPage)
            .map((user: any, index) => (
              <tr key={user.id}>
                <td style={tableBodyCellStyle}>
                  <span
                    onClick={() => goToPosts(user.id)}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {user.name}
                  </span>
                </td>
                <td style={tableBodyCellStyle}>{user.email}</td>
                <td
                  className={`expandableCell ${
                    expandedCells.includes(index) ? 'expanded' : ''
                  }`}
                  style={{
                    ...cellStyle,
                    ...tableBodyCellStyle,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => handleAddressClick(index)}
                >
                  {user.address}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div style={pageContainerStyle}>
        {pageNumbers.map((page) => (
          <span
            key={page}
            style={{
              ...pageLinkStyle,
              ...(currentPage === page ? currentPageStyle : {}),
            }}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </span>
        ))}
      </div>
      <style>
        {`
          .expandableCell {
            position: relative;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .expandableCell::after {
            content: '...';
            position: absolute;
            right: 0;
            bottom: 0;
            background: #ffffff;
            padding: 0.25rem;
            pointer-events: none;
          }

          .expandableCell.expanded {
            width: auto;
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
          }

          .expandableCell.expanded::after {
            content: unset;
          }
      `}
      </style>
    </div>
  );
};

export default GetUsers;
