import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/auth.store';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { accessToken } = await login(username, password);
      setToken(accessToken);
      navigate('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      <form onSubmit={handleSubmit} style={{ width: 320 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Ray CRM</h1>
        {error && <p style={{ color: '#ef4444', marginBottom: 12 }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #d1d5db' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 16, borderRadius: 6, border: '1px solid #d1d5db' }}
        />
        <button
          type="submit"
          style={{ width: '100%', padding: 10, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
