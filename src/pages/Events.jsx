import { useEffect, useState } from 'react';
import { api } from '../api.js';
import EventCard from '../components/EventCard.jsx';
import { CATEGORIES } from '../utils.js';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [scope, setScope] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    // small debounce so we don't hit the API on every keystroke
    const t = setTimeout(() => {
      api
        .events({ search, category, scope })
        .then(setEvents)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, category, scope]);

  return (
    <>
      <section className="hero">
        <h1>Discover campus events</h1>
        <p>Browse what's happening at your university and reserve your spot in seconds.</p>
      </section>

      <div className="filters">
        <input
          type="search"
          placeholder="Search events, locations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="tabs">
          {['upcoming', 'past'].map((s) => (
            <button key={s} className={scope === s ? 'tab active' : 'tab'} onClick={() => setScope(s)}>
              {s === 'upcoming' ? 'Upcoming' : 'Past'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="muted">Loading events…</p>
      ) : events.length === 0 ? (
        <p className="muted empty">No events found.</p>
      ) : (
        <div className="grid">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </>
  );
}
