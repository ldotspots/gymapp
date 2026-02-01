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
      <div className="animate-pulse text-6xl">💪</div>
    </div>
  );
}
