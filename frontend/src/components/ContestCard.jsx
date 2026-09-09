import './ContestCard.css';

const platformColors = {
  codeforces: 'var(--codeforces)',
  leetcode: 'var(--leetcode)',
  codechef: 'var(--codechef)',
  atcoder: 'var(--atcoder)',
};

export default function ContestCard({ contest, onSetReminder, reminderLoading }) {
  const start = new Date(contest.startTime);
  const platformColor = platformColors[contest.platform] || varPrimaryFallback();

  return (
    <article className="card contest-card">
      <div className="contest-card-top">
        <span className="platform-tag" style={{ background: platformColor }}>
          {contest.platform}
        </span>
        <span className={`badge badge-${contest.status}`}>{contest.status}</span>
      </div>
      <h3>{contest.name}</h3>
      <div className="contest-meta">
        <p>
          <strong>Starts:</strong> {start.toLocaleString()}
        </p>
        {contest.durationMinutes ? (
          <p>
            <strong>Duration:</strong> {contest.durationMinutes} min
          </p>
        ) : null}
      </div>
      <div className="contest-actions">
        <a href={contest.url} target="_blank" rel="noreferrer" className="btn btn-secondary">
          Open
        </a>
        {onSetReminder && (
          <button
            className="btn btn-primary"
            onClick={() => onSetReminder(contest)}
            disabled={reminderLoading}
          >
            Set Reminder
          </button>
        )}
      </div>
    </article>
  );
}

function varPrimaryFallback() {
  return '#6366f1';
}
