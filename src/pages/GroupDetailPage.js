import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/GroupDetailPage.css';

function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/group/${id}`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setGroup(data);

        // TODO: Voeg berichten/messages op door een API-call
        // const messagesRes = await fetch(`${apiUrl}/api/group/${id}/messages`);
        // const messagesData = await messagesRes.json();
        // setMessages(messagesData);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Fout bij ophalen van groepdetails');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id, apiUrl]);

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

  const groupName = group?.groupname || group?.name || 'Naamloze groep';

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
          <h1>{groupName}</h1>
          <p className="question">[vraag hier]</p>
        </div>
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
