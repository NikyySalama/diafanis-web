import './App.css';
import UserElections from './UserElections/UserElections';
import UserElection from './UserElections/Election/UserElection';
import Home from './Pages/Home/JSX/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Election from './Pages/Election/JSX/Election';
import PageTableInfo from './Pages/TableInfo/JSX/PageTableInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/> } />
        <Route path="/userElections" element={<UserElections/>} />
        <Route path="/userElections/election" element={<UserElection />} />
        <Route path="/election" element={<Election/>} />
        <Route path="/election/table" element={<PageTableInfo/>} />
      </Routes>
    </Router>
  );
}

export default App;