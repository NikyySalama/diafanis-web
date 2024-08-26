import './App.css';
import UserElections from './UserElections/UserElections';
import ElectionRegistration from './UserElections/ElectionRegistration';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserElections/> } />
        <Route path='/election-registration' element={<ElectionRegistration/>} />
      </Routes>
    </Router>
  );
}

export default App;
