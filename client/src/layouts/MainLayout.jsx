import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../context/authStore';
import './MainLayout.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/matches', label: 'Matches' },
  { to: '/series', label: 'Series' },
  { to: '/teams', label: 'Teams' },
  { to: '/players', label: 'Players' },
  { to: '/squads', label: 'Squads' },
  { to: '/search', label: 'Search' },
];

export const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="app-frame">
      <header className="site-header">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">CB</span>
          <span>
            <strong>CricBuzz</strong>
            <small>Live cricket center</small>
          </span>
        </Link>

        <button
          className="icon-button menu-button"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`primary-nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={`account-actions ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link className="profile-pill" to="/dashboard" onClick={() => setMenuOpen(false)}>
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                <b>{user?.name || 'Profile'}</b>
              </Link>
              <button className="btn ghost" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link className="btn primary" to="/signup" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div>
          <Link className="footer-brand" to="/">
            <span className="brand-mark">CB</span>
            <span>
              <strong>CricBuzz</strong>
              <small>Premium cricket operations and live scores</small>
            </span>
          </Link>
          <p>
            Follow live matches, squads, series, scorecards and ball-by-ball commentary from one polished cricket hub.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/matches">Matches</Link>
          <Link to="/series">Series</Link>
          <Link to="/teams">Teams</Link>
          <Link to="/players">Players</Link>
          <Link to="/squads">Squads</Link>
        </nav>
        <div className="footer-meta">
          <span>Local product build</span>
          <span>Live API: localhost:3000</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
