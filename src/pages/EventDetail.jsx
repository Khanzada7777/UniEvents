import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { CapacityBar } from '../components/EventCard.jsx';
import { fmtDate } from '../utils.js';

export default function EventDetail() {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const [event, setEvent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { type, text }
  const [error, setError] = useState('');

  const load = () =>
    api
      .event(id)
      .then(setEvent)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [id, user]);

  const act = async (fn, okText) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn(event.id);
      setMsg({ type: 'success', text: okText });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      await load();
      setBusy(false);
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!event) return <p className="muted">Loading…</p>;

  const ended = new Date(event.endTime) < new Date();

  return (
    <div className="detail">
      <Link to="/" className="muted small">
        ← All events
      </Link>

      <div
        className="detail-cover"
        style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
      />

      <div className="detail-grid">
        <div>
          <span className="badge">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="description">{event.description || 'No description provided.'}</p>
        </div>

        <aside className="card card-body">
          <p>
            <strong>When</strong>
            <br />
            {fmtDate(event.startTime)}
            <br />
            <span className="muted small">until {fmtDate(event.endTime)}</span>
          </p>
          <p>
            <strong>Where</strong>
            <br />
            {event.location}
          </p>
          <CapacityBar registered={event.registeredCount} capacity={event.capacity} />
          <p className="muted small">
            {event.isFull ? 'No spots left' : `${event.spotsLeft} spot${event.spotsLeft === 1 ? '' : 's'} left`}
          </p>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          {!user && (
            <Link className="btn btn-block" to="/login">
              Log in to register
            </Link>
          )}
          {user && !isStudent && <p className="muted small">Admin accounts can't register for events.</p>}
          {isStudent &&
            (ended ? (
              <button className="btn btn-block" disabled>
                Event ended
              </button>
            ) : event.isRegistered ? (
              <button
                className="btn btn-danger btn-block"
                disabled={busy}
                onClick={() => act(api.cancel, 'Your registration was cancelled.')}
              >
                Cancel registration
              </button>
            ) : (
              <button
                className="btn btn-block"
                disabled={busy || event.isFull}
                onClick={() => act(api.register, "You're registered! Check your email for confirmation.")}
              >
                {event.isFull ? 'Event full' : busy ? 'Registering…' : 'Register now'}
              </button>
            ))}
        </aside>
      </div>
    </div>
  );
}
