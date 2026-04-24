import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/group')
      .then(res => res.json())
      .then(data => setMessage(data.text))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;