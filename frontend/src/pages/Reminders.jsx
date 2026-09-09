import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './Reminders.css';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadReminders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getReminders();
      setReminders(data.reminders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteReminder(id);
      setMessage('Reminder removed');
      await loadReminders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="reminders-header">
        <div>
          <h1>My Reminders</h1>
          <p className="muted">Email reminders are sent automatically before each contest starts.</p>
        </div>
        <Link to="/" className="btn btn-primary">
          Browse Contests
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <div className="card empty-state">
          <p>No reminders yet. Set one from the dashboard.</p>
        </div>
      ) : (
        <div className="grid">
          {reminders.map((r) => (
            <div key={r._id} className="card reminder-item">
              <div>
                <h3>{r.contest?.name}</h3>
                <p className="muted">
                  {r.contest?.platform} · starts {new Date(r.contest?.startTime).toLocaleString()}
                </p>
                <p>
                  Remind {r.remindBeforeMinutes} min before ·{' '}
                  {r.emailSent ? 'Email sent' : 'Pending'}
                </p>
              </div>
              <div className="reminder-actions">
                <a
                  href={r.contest?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Open
                </a>
                <button className="btn btn-danger" onClick={() => handleDelete(r._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
