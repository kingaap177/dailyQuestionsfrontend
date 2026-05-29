import './App.css';
import { useEffect, useState } from 'react';
import GroupViewModel from './models/groupViewModel';

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    setLoading(true);

    fetch(`${apiUrl}/api/group`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.groups)
            ? data.groups
            : [];

        const viewModels = list.map(item => {
          const name = item?.groupname ?? item?.name ?? item;
          const id = item?.idgroups ?? item?.id ?? null;
          return new GroupViewModel(name, id);
        });

        setGroups(viewModels);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load groups.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="App">
        <p>Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      {groups.length === 0 ? (
        <p>No groups available.</p>
      ) : (
        <>
          <div className="group-buttons">
            {groups.map((group, index) => (
              <button
                key={`${group.name}-${index}`}
                type="button"
                onClick={() => setSelectedGroup(group)}
              >
                {group.name}
              </button>
            ))}
          </div>

          {selectedGroup && (
            <div className="group-details">
              <h2>Selected group</h2>
              <p>{selectedGroup.name}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;