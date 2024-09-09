import './App.css';
import UserElections from './UserElections/UserElections';
import Election from './UserElections/Election/UserElection';
import Home from './Pages/Home/JSX/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home/> } />
        <Route path="/" element={<UserElections/>} />
        <Route path="/userElections/election" element={<Election />} />
      </Routes>
    </Router>
  );
}

export default App;
