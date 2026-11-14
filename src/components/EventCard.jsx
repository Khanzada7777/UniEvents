import { Link } from 'react-router-dom';
import { fmtDate } from '../utils.js';

export function CapacityBar({ registered, capacity }) {
  const pct = Math.min(100, Math.round((registered / capacity) * 100));
  const level = pct >= 100 ? 'full' : pct >= 80 ? 'warn' : '';
  return (
    <div className="capacity">
      <div className="bar">
        <div className={`fill ${level}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="muted small">
        {registered} / {capacity} registered
      </span>
    </div>
  );
}

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="card event-card">
      <div
        className="event-cover"
        style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
      >
        <span className="badge">{event.category}</span>
        {event.isRegistered && <span className="badge badge-green">Registered</span>}
        {event.isFull && !event.isRegistered && <span className="badge badge-red">Full</span>}
      </div>
      <div className="card-body">
        <h3>{event.title}</h3>
        <p className="muted small">{fmtDate(event.startTime)}</p>
        <p className="muted small">📍 {event.location}</p>
        <CapacityBar registered={event.registeredCount} capacity={event.capacity} />
      </div>
    </Link>
  );
}
