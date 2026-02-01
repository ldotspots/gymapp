import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Workout from './pages/Workout';
import HistoryPage from './pages/HistoryPage';
import Profile from './pages/Profile';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-6xl">💪</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/workout" /> : <Login />}
        />
        <Route
          path="/workout"
          element={session ? <Workout /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={session ? <HistoryPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={session ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
