import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', studentId: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card card-body form narrow" onSubmit={submit}>
      <h2>Create student account</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <label>
        Full name
        <input value={form.fullName} onChange={set('fullName')} required />
      </label>
      <label>
        University email
        <input type="email" value={form.email} onChange={set('email')} required />
      </label>
      <label>
        Student ID (optional)
        <input value={form.studentId} onChange={set('studentId')} />
      </label>
      <label>
        Password (min 6 characters)
        <input type="password" minLength={6} value={form.password} onChange={set('password')} required />
      </label>
      <button className="btn btn-block" disabled={busy}>
        {busy ? 'Creating…' : 'Sign up'}
      </button>
      <p className="muted small">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
