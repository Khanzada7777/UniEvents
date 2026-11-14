import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { CapacityBar } from '../components/EventCard.jsx';
import { fmtDate } from '../utils.js';

export default function AdminParticipants() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.event(id), api.participants(id)])
      .then(([ev, list]) => {
        setEvent(ev);
        setRows(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const exportCsv = async () => {
    try {
      const blob = await api.exportParticipants(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants-event-${id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <>
      <Link to="/admin" className="muted small">
        ← Back to events
      </Link>
      {error && <div className="alert alert-error">{error}</div>}
      {event && (
        <div className="page-head">
          <div>
            <h1>{event.title}</h1>
            <p className="muted">
              {fmtDate(event.startTime)} · {event.location}
            </p>
            <CapacityBar registered={event.registeredCount} capacity={event.capacity} />
          </div>
          <button className="btn" onClick={exportCsv} disabled={rows.length === 0}>
            Export CSV
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="muted empty">No participants yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.registrationId}>
                  <td>{i + 1}</td>
                  <td>{p.fullName}</td>
                  <td>{p.email}</td>
                  <td>{p.studentId || '—'}</td>
                  <td>{fmtDate(p.registeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
