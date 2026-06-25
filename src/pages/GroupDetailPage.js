import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/GroupDetailPage.css';

function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [editName, setEditName] = useState('');
  const [messages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiUrl}/api/group/${id}`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setGroup(data);
        setEditName(data?.name || data?.groupname || '');
      } catch (err) {
        console.error(err);
        setError(err.message || 'Fout bij ophalen van groepdetails');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id, apiUrl]);

  const handleUpdateGroup = async () => {
    if (!editName.trim()) {
      setSaveError('Groepsnaam mag niet leeg zijn');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`${apiUrl}/api/group/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${res.status}`);
      }

      const updatedGroup = await res.json();
      setGroup(updatedGroup);
    } catch (err) {
      console.error(err);
      setSaveError(err.message || 'Fout bij bijwerken van groep');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Weet je zeker dat je deze groep wilt verwijderen?')) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`${apiUrl}/api/group/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 204) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${res.status}`);
      }

      navigate('/groups');
    } catch (err) {
      console.error(err);
      setDeleteError(err.message || 'Fout bij verwijderen van groep');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <button onClick={() => navigate('/')} className="back-button">
          ← Terug
        </button>
        <p>Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <button onClick={() => navigate('/')} className="back-button">
          ← Terug
        </button>
        <p className="error">Fout: {error}</p>
        <p className="error">Opgezocht: {`${apiUrl}/api/group/${id}`}</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="detail-page">
        <button onClick={() => navigate('/')} className="back-button">
          ← Terug
        </button>
        <p>Groep niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div
        className="detail-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <button onClick={() => navigate('/groups')} className="back-button">
          ← Terug
        </button>
      </div>

      <div className="group-header">
        <div className="question-mark-icon">?</div>
        <div className="header-info">
          <div className="group-name-field">
            <label htmlFor="groupName">Groepsnaam</label>
            <input
              id="groupName"
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="group-name-input"
            />
          </div>
          <p className="question">[vraag hier]</p>
        </div>
      </div>

      <div className="group-actions">
        {saveError && <p className="error">{saveError}</p>}
        {deleteError && <p className="error">{deleteError}</p>}
        <button
          type="button"
          className="save-button"
          onClick={handleUpdateGroup}
          disabled={saving || deleting}
        >
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={handleDeleteGroup}
          disabled={saving || deleting}
        >
          {deleting ? 'Verwijderen...' : 'Verwijderen'}
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Nog geen berichten</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="message-item">
              <img src="https://via.placeholder.com/40" alt="Avatar" className="avatar" />
              <div className="message-content">
                <span className="message-text">{msg.text}</span>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GroupDetailPage;
