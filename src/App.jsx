import './App.css';
import UserElections from './UserElections/UserElections';
import UserLists from './UserElections/UserLists'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserElections/> } />
        <Route path="/lists" element={<UserLists />} />
      </Routes>
    </Router>
  );
}

export default App;
