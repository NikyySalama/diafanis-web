import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeadContent from './Pages/Home/JSX/HeadContent';
import { ClassNames } from '@emotion/react';
import Home from './Pages/Home/JSX/Home';
//import './index.css';
import Election from './Pages/Election/JSX/Election';

import PageTableInfo from './Pages/TableInfo/JSX/PageTableInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"  ClassNames='main' element={<Home/> } />
        <Route path="/election" element={<Election/>} />
        <Route path="/election/table" element={<PageTableInfo/>} />
      </Routes>
    </Router>
  );
}

export default App;
