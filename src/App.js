import './App.css';
import { useEffect, useState } from 'react';
import GroupViewModel from './models/groupViewModel';

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

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
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setShowAddModal(true)}>Add Group</button>
      </div>
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

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add a new group</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Group name"
            />
            {postError && <p className="error">{postError}</p>}
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setNewGroupName('');
                  setPostError(null);
                }}
                disabled={posting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!newGroupName.trim()) {
                    setPostError('Please enter a group name');
                    return;
                  }
                  setPosting(true);
                  setPostError(null);
                  try {
                    const res = await fetch(`${apiUrl}/api/group`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: newGroupName.trim() }),
                    });

                    if (!res.ok) {
                      const err = await res.json().catch(() => ({}));
                      throw new Error(err.error || `HTTP ${res.status}`);
                    }

                    const created = await res.json();
                    const name = created?.groupname ?? created?.name ?? newGroupName.trim();
                    const id = created?.idgroups ?? created?.id ?? null;
                    const vm = new GroupViewModel(name, id);
                    setGroups(prev => [...prev, vm]);
                    setShowAddModal(false);
                    setNewGroupName('');
                  } catch (err) {
                    console.error(err);
                    setPostError(err.message || 'Failed to create group');
                  } finally {
                    setPosting(false);
                  }
                }}
                disabled={posting}
              >
                {posting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;