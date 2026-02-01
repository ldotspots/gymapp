import { useState } from 'react';
import { signInWithEmail } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✉️</div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-text-secondary">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-text-secondary mt-2">
              Click the link in the email to sign in
            </p>
          </div>

          <button
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            className="w-full bg-surface hover:bg-border text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">GymSnap</h1>
          <p className="text-text-secondary">
            Photo-first workout tracking with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full p-3 bg-surface border border-border rounded-lg text-white focus:border-accent focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger text-white p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-xs text-text-secondary text-center mt-6">
          No password needed. We'll send you a secure login link.
        </p>
      </div>
    </div>
  );
}
