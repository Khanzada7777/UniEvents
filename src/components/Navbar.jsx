import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          Uni<span>Events</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Events
          </NavLink>
          {isStudent && <NavLink to="/my-registrations">My Registrations</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <span className="muted">
                {user.fullName} · {user.role}
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Log in
              </Link>
              <Link className="btn" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
