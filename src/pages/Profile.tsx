import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { signOut, getCurrentUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b border-border bg-surface">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary mb-1">Email</div>
            <div className="font-medium">{user?.email}</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary mb-1">User ID</div>
            <div className="font-mono text-xs break-all">{user?.id}</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-sm text-text-secondary mb-1">Member Since</div>
            <div className="font-medium">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown'}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-danger hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Sign Out
          </button>

          <div className="text-center text-text-secondary text-sm mt-8">
            <p>GymSnap v1.0.0</p>
            <p className="mt-2">Photo-first workout tracking with AI</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
