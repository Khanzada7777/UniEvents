import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'Admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card card-body form narrow" onSubmit={submit}>
      <h2>Log in</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button className="btn btn-block" disabled={busy}>
        {busy ? 'Signing in…' : 'Log in'}
      </button>
      <p className="muted small">
        New here? <Link to="/signup">Create a student account</Link>
      </p>
    </form>
  );
}
