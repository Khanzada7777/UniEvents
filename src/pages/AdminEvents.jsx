import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { fmtDate } from '../utils.js';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () =>
    api
      .events({ scope: 'all' })
      .then((list) => setEvents([...list].sort((a, b) => new Date(b.startTime) - new Date(a.startTime))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const remove = async (ev) => {
    if (!confirm(`Delete "${ev.title}" and all of its registrations?`)) return;
    try {
      await api.deleteEvent(ev.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Manage events</h1>
        <Link className="btn" to="/admin/events/new">
          + New event
        </Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : events.length === 0 ? (
        <p className="muted empty">No events yet. Create the first one.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Starts</th>
                <th>Location</th>
                <th>Registered</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    <Link to={`/events/${e.id}`}>{e.title}</Link>
                  </td>
                  <td>{fmtDate(e.startTime)}</td>
                  <td>{e.location}</td>
                  <td>
                    {e.registeredCount} / {e.capacity}
                  </td>
                  <td>
                    {new Date(e.endTime) < new Date() ? (
                      <span className="badge">Ended</span>
                    ) : e.isFull ? (
                      <span className="badge badge-red">Full</span>
                    ) : (
                      <span className="badge badge-green">Open</span>
                    )}
                  </td>
                  <td className="actions">
                    <Link className="btn btn-small btn-ghost" to={`/admin/events/${e.id}/participants`}>
                      Participants
                    </Link>
                    <Link className="btn btn-small btn-ghost" to={`/admin/events/${e.id}/edit`}>
                      Edit
                    </Link>
                    <button className="btn btn-small btn-danger" onClick={() => remove(e)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
