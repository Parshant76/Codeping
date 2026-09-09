import { useEffect, useState } from 'react';
import ContestCard from '../components/ContestCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../components/ContestCard.css';
import './Dashboard.css';

const PLATFORMS = [
  { id: '', label: 'All Platforms' },
  { id: 'codeforces', label: 'Codeforces' },
  { id: 'leetcode', label: 'LeetCode' },
  { id: 'codechef', label: 'CodeChef' },
  { id: 'atcoder', label: 'AtCoder' },
];

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('');
  const [search, setSearch] = useState('');
  const [reminderLoading, setReminderLoading] = useState(false);

  const loadContests = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (platform) params.platform = platform;
      if (search) params.search = search;
      const data = await api.getContests(params);
      setContests(data.contests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContests();
  }, [platform]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadContests();
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');
    try {
      const data = await api.syncContests();
      setMessage(`Synced ${data.summary?.total || 0} contests`);
      await loadContests();
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSetReminder = async (contest) => {
    if (!isAuthenticated) {
      setError('Please login to set reminders');
      return;
    }

    setReminderLoading(true);
    setMessage('');
    setError('');
    try {
      await api.createReminder({ contestId: contest._id, remindBeforeMinutes: 60 });
      setMessage(`Reminder set for "${contest.name}" (60 min before start)`);
    } catch (err) {
      setError(err.message);
    } finally {
      setReminderLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <section className="hero card">
        <div>
          <h1>Coding Contest Aggregator</h1>
          <p>
            Discover upcoming contests from Codeforces, LeetCode, CodeChef, and AtCoder in one
            dashboard. Set email reminders so you never miss a contest.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSync} disabled={syncing}>
          {syncing ? 'Syncing...' : 'Refresh Contests'}
        </button>
      </section>

      <section className="filters card">
        <form onSubmit={handleSearch} className="filter-row">
          <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p.id || 'all'} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Search contest name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-secondary" type="submit">
            Search
          </button>
        </form>
      </section>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading contests...</p>
      ) : contests.length === 0 ? (
        <div className="card empty-state">
          <p>No contests found. Click &quot;Refresh Contests&quot; to fetch from platforms.</p>
        </div>
      ) : (
        <div className="grid grid-2 contest-grid">
          {contests.map((contest) => (
            <ContestCard
              key={contest._id}
              contest={contest}
              onSetReminder={isAuthenticated ? handleSetReminder : null}
              reminderLoading={reminderLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
