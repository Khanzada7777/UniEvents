import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { fmtDate } from '../utils.js';

export default function MyRegistrations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () =>
    api
      .myRegistrations()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (eventId) => {
    if (!confirm('Cancel this registration?')) return;
    try {
      await api.cancel(eventId);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>Registration history</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="muted empty">
          You haven't registered for anything yet. <Link to="/">Browse events</Link>
        </p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>When</th>
                <th>Location</th>
                <th>Status</th>
                <th>Registered on</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const upcoming = new Date(r.endTime) >= new Date();
                return (
                  <tr key={r.registrationId}>
                    <td>
                      <Link to={`/events/${r.eventId}`}>{r.eventTitle}</Link>
                    </td>
                    <td>{fmtDate(r.startTime)}</td>
                    <td>{r.location}</td>
                    <td>
                      <span className={r.status === 'Registered' ? 'badge badge-green' : 'badge badge-red'}>
                        {r.status}
                      </span>
                    </td>
                    <td>{fmtDate(r.registeredAt)}</td>
                    <td>
                      {r.status === 'Registered' && upcoming && (
                        <button className="btn btn-small btn-danger" onClick={() => cancel(r.eventId)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
