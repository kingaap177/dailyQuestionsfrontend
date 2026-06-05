import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupViewModel from '../models/groupViewModel';
import '../styles/GroupList.css';

function GroupList({ onLogout }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const navigate = useNavigate();

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
          const id = item?.id ?? item?.idgroups ?? item?.groupid ?? item?.groupId ?? null;
          return new GroupViewModel(name, id);
        });

        setGroups(viewModels);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load groups.');
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const handleGroupClick = (group) => {
    const groupId = group.id;
    if (!groupId) {
      console.error('Cannot open group detail page because group has no id', group);
      return;
    }
    navigate(`/group/${groupId}`);
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setPostError('Voer een groepnaam in');
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
      setPostError(err.message || 'Fout bij het aanmaken van groep');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <p>Groepen laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <p>Fout: {error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Groepen</h2>
        {onLogout && (
          <button type="button" onClick={onLogout}>
            Uitloggen
          </button>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setShowAddModal(true)}>
          Groep toevoegen
        </button>
      </div>
      {groups.length === 0 ? (
        <p>Geen groepen beschikbaar.</p>
      ) : (
        <div className="group-buttons">
          {groups.map((group, index) => (
            <button
              key={`${group.name}-${index}`}
              type="button"
              className="group-button"
              onClick={() => handleGroupClick(group)}
            >
              {group.name}
            </button>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Voeg een groep toe</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Groepnaam"
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
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleAddGroup}
                disabled={posting}
              >
                {posting ? 'Bezig...' : 'Toevoegen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupList;
