import { useState, useEffect } from 'react';
import {
  useNavigate,
  createSearchParams,
  useSearchParams,
} from 'react-router-dom';
import axios from 'axios';

import styles from './users.module.scss';
import clsx from 'clsx';

const GetUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [expandedCells, setExpandedCells] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [perPage] = useState(4);
  const [querySearchParams] = useSearchParams();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const currentPage = querySearchParams.get('page') || '1';
  const totalPages = Math.ceil(users.length / perPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPosts = (userId: number) => {
    const params = { userId: userId.toString() };
    navigate({
      pathname: '/posts',
      search: `?${createSearchParams(params)}`,
    });
  };

  const fetchUsers = async () => {
    setDataLoaded(false);
    try {
      const res = await axios.get(`http://localhost:3001/api/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users');
    }
    setDataLoaded(true);
  };

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
    const startIndex = (Number(currentPage) - 1) * perPage;
    let endIndex = Number(currentPage) * perPage;

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
    navigate(`/users?page=${page}`);
  };

  useEffect(() => {
    if (dataLoaded) {
      if (parseInt(currentPage) > totalPages) {
        navigate(`/users?page=${totalPages}`);
      } else if (parseInt(currentPage) < 1) {
        navigate(`/users?page=1`);
      }
    }
  }, [dataLoaded, currentPage, totalPages]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Users</h1>
      <table className={styles.tableStyle}>
        <thead>
          <tr>
            <th
              className={styles.nameColumnCellStyle}
              onClick={() => handleSort('name')}
            >
              Name
            </th>
            <th className={styles.tableHeaderCellStyle}>Email</th>
            <th className={styles.tableHeaderCellStyle}>Address</th>
          </tr>
        </thead>
        <tbody>
          {users
            .slice(
              (Number(currentPage) - 1) * perPage,
              Number(currentPage) * perPage
            )
            .map((user: any, index) => (
              <tr key={user.id}>
                <td className={styles.tableBodyCellStyle}>
                  <span
                    onClick={() => goToPosts(user.id)}
                    className={styles.userNameLinkStyle}
                  >
                    {user.name}
                  </span>
                </td>
                <td className={styles.tableBodyCellStyle}>{user.email}</td>
                <td
                  className={clsx(
                    styles.cellStyle,
                    styles.tableBodyCellStyle,
                    styles.linkStyle
                  )}
                  onClick={() => handleAddressClick(index)}
                >
                  <span
                    className={clsx(
                      styles.cellSpanStyle,
                      expandedCells.includes(index) && styles.ellipsisClickStyle
                    )}
                  >
                    {user.address}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.pageContainerStyle}>
        {pageNumbers.map((page) => (
          <span
            className={clsx(
              styles.pageLinkStyle,
              Number(currentPage) === page ? styles.currentPageStyle : {}
            )}
            key={page}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GetUsers;
