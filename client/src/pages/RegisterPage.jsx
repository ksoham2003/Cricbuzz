import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../context/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    clearError();
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch {
      // Store renders the API error.
    }
  };

  return (
    <div className="page-shell auth-page">
      <section className="auth-card">
        <h1>Create account</h1>
        <p>Signup creates a cookie session through the existing auth API.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Name
            <input className="field" name="name" value={form.name} onChange={handleChange} required />
          </label>
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
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="form-note">Already have an account? <Link to="/login">Login</Link></p>
      </section>
    </div>
  );
}
