import './App.css';
import UserElections from './UserElections/UserElections';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserElections/> } />
      </Routes>
    </Router>
  );
}

export default App;
