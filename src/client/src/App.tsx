import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetUsers from './GetUsers';
import GetPosts from './GetPosts';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/posts/1" element={<GetPosts />} />
        <Route path="/" element={<GetUsers />} />
      </Routes>
    </Router>
    // <div>
    //   <GetUsers />
    // </div>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
