import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate('/workout');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="1" y="8" width="3" height="8" rx="1" fill="currentColor" />
        <rect x="20" y="8" width="3" height="8" rx="1" fill="currentColor" />
        <rect x="7" y="6" width="10" height="2" rx="1" fill="currentColor" />
      </svg>
    </div>
  );
}
