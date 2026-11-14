import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { CATEGORIES, toInputValue } from '../utils.js';

const empty = {
  title: '',
  description: '',
  location: '',
  category: 'Other',
  startTime: '',
  endTime: '',
  capacity: 50,
  imageUrl: '',
};

export default function AdminEventForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .event(id)
      .then((e) =>
        setForm({
          title: e.title,
          description: e.description,
          location: e.location,
          category: e.category,
          startTime: toInputValue(e.startTime),
          endTime: toInputValue(e.endTime),
          capacity: e.capacity,
          imageUrl: e.imageUrl || '',
        })
      )
      .catch((err) => setError(err.message));
  }, [id, editing]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = { ...form, capacity: Number(form.capacity), imageUrl: form.imageUrl || null };
    try {
      if (editing) await api.updateEvent(id, payload);
      else await api.createEvent(payload);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card card-body form" onSubmit={submit}>
      <h2>{editing ? 'Edit event' : 'Create event'}</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <label>
        Title
        <input value={form.title} onChange={set('title')} required />
      </label>
      <label>
        Description
        <textarea rows={4} value={form.description} onChange={set('description')} />
      </label>

      <div className="row">
        <label>
          Location
          <input value={form.location} onChange={set('location')} required />
        </label>
        <label>
          Category
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="row">
        <label>
          Starts
          <input type="datetime-local" value={form.startTime} onChange={set('startTime')} required />
        </label>
        <label>
          Ends
          <input type="datetime-local" value={form.endTime} onChange={set('endTime')} required />
        </label>
      </div>

      <div className="row">
        <label>
          Capacity
          <input type="number" min={1} value={form.capacity} onChange={set('capacity')} required />
        </label>
        <label>
          Image URL (optional)
          <input type="url" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
        </label>
      </div>

      <div className="row-actions">
        <button className="btn" disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Create event'}
        </button>
        <Link className="btn btn-ghost" to="/admin">
          Cancel
        </Link>
      </div>
    </form>
  );
}
