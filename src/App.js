import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import GroupList from './components/GroupList';
import GroupDetailPage from './pages/GroupDetailPage';
import LoginPage from './pages/LoginPage';

function RequireAuth({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = userData => {
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/groups" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/groups"
          element={
            <RequireAuth user={user}>
              <GroupList onLogout={handleLogout} />
            </RequireAuth>
          }
        />
        <Route
          path="/group/:id"
          element={
            <RequireAuth user={user}>
              <GroupDetailPage onLogout={handleLogout} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={user ? '/groups' : '/'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
