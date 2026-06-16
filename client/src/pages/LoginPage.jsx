import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../context/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    clearError();
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch {
      // Store renders the API error.
    }
  };

  return (
    <div className="page-shell auth-page">
      <section className="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in with the backend httpOnly cookie session.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input className="field" name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input className="field" name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <p className="state-panel error" style={{ minHeight: 'auto', padding: 12 }}>{error}</p>}
          <button className="btn primary full" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="form-note">New here? <Link to="/signup">Create an account</Link></p>
      </section>
    </div>
  );
}
