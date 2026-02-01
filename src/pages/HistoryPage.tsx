import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import History from '../components/History';
import Layout from '../components/Layout';
import { supabase, getCurrentUser } from '../lib/supabase';
import type { WorkoutWithExercises } from '../lib/types';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: workoutsData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .not('ended_at', 'is', null)
        .order('started_at', { ascending: false });

      if (!workoutsData) {
        setLoading(false);
        return;
      }

      const workoutsWithExercises = await Promise.all(
        workoutsData.map(async (workout) => {
          const { data: exercisesData } = await supabase
            .from('exercises')
            .select('*')
            .eq('workout_id', workout.id)
            .order('created_at', { ascending: true });

          if (!exercisesData) {
            return { ...workout, exercises: [] };
          }

          const exercisesWithSets = await Promise.all(
            exercisesData.map(async (exercise) => {
              const { data: setsData } = await supabase
                .from('sets')
                .select('*')
                .eq('exercise_id', exercise.id)
                .order('set_number', { ascending: true });

              return {
                ...exercise,
                sets: setsData || [],
              };
            })
          );

          return {
            ...workout,
            exercises: exercisesWithSets,
          };
        })
      );

      setWorkouts(workoutsWithExercises);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <History workouts={workouts} loading={loading} />
    </Layout>
  );
}
