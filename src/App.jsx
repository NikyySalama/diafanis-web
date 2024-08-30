import './App.css';
import UserElections from './UserElections/UserElections';
import Election from './UserElections/Election/Election';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserElections/> } />
        <Route path="/election" element={<Election />} />
      </Routes>
    </Router>
  );
}

export default App;
