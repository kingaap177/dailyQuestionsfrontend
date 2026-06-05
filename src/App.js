import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupList from './components/GroupList';
import GroupDetailPage from './pages/GroupDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupList />} />
        <Route path="/group/:id" element={<GroupDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;