import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetUsers from './GetUsers';
import GetPosts from './GetPosts';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="posts" element={<GetPosts />} />
        <Route path="/" element={<GetUsers />} />
      </Routes>
    </Router>
    // <div>
    //   <GetUsers />
    // </div>
  );
}

export default App;
