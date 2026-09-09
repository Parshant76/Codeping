import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-dot" />
            CodePing
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/reminders">My Reminders</NavLink>
            )}
          </nav>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-pill">Hi, {user?.name?.split(' ')[0]}</span>
                <button className="btn btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          Built by Parshant Garg · MERN Stack · Codeforces · LeetCode · CodeChef · AtCoder
        </div>
      </footer>
    </div>
  );
}
