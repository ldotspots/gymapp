import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../components/Camera';
import ExerciseConfirm from '../components/ExerciseConfirm';
import SetLogger from '../components/SetLogger';
import WorkoutSession from '../components/WorkoutSession';
import { identifyExercise } from '../lib/anthropic';
import { supabase, getCurrentUser } from '../lib/supabase';
import type {
  Workout,
  ExerciseWithSets,
  ExerciseIdentification,
} from '../lib/types';
import Layout from '../components/Layout';

type WorkoutState =
  | 'idle'
  | 'camera'
  | 'identifying'
  | 'confirming'
  | 'logging';

export default function WorkoutPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<WorkoutState>('idle');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseWithSets | null>(null);
  const [identification, setIdentification] = useState<ExerciseIdentification | null>(null);

  useEffect(() => {
    checkForActiveWorkout();
  }, []);

  const checkForActiveWorkout = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      if (workouts && workouts.length > 0) {
        setCurrentWorkout(workouts[0]);
        await loadWorkoutExercises(workouts[0].id);
      }
    } catch (error) {
      console.error('Error checking for active workout:', error);
    }
  };

  const loadWorkoutExercises = async (workoutId: string) => {
    try {
      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', workoutId)
        .order('created_at', { ascending: true });

      if (!exercisesData) return;

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

      setExercises(exercisesWithSets);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const startWorkout = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('workouts')
        .insert([{ user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setCurrentWorkout(data);
      setState('camera');
    } catch (error) {
      console.error('Error starting workout:', error);
      alert('Failed to start workout');
    }
  };

  const handleCapture = async (imageBase64: string, mediaType: string) => {
    setState('identifying');

    try {
      const result = await identifyExercise(imageBase64, mediaType);
      setIdentification(result);
      setState('confirming');
    } catch (error) {
      console.error('Error identifying exercise:', error);
      alert('Failed to identify exercise. Please try again.');
      setState('camera');
    }
  };

  const handleConfirmExercise = async (
    exerciseName: string,
    equipment: string,
    muscleGroup: string
  ) => {
    if (!currentWorkout) return;

    try {
      const { data: exerciseData, error } = await supabase
        .from('exercises')
        .insert([
          {
            workout_id: currentWorkout.id,
            name: exerciseName,
            equipment,
            muscle_group: muscleGroup,
            identified_by_ai: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newExercise: ExerciseWithSets = {
        ...exerciseData,
        sets: [],
      };

      setCurrentExercise(newExercise);
      setExercises([...exercises, newExercise]);
      setState('logging');
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Failed to save exercise');
    }
  };

  const handleAddSet = async (
    weight: number,
    reps: number,
    weightUnit: 'kg' | 'lbs',
    rpe?: number
  ) => {
    if (!currentExercise) return;

    const setNumber = currentExercise.sets.length + 1;

    try {
      const { data: setData, error } = await supabase
        .from('sets')
        .insert([
          {
            exercise_id: currentExercise.id,
            set_number: setNumber,
            weight,
            reps,
            weight_unit: weightUnit,
            rpe,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const updatedExercise = {
        ...currentExercise,
        sets: [...currentExercise.sets, setData],
      };

      setCurrentExercise(updatedExercise);
      setExercises(
        exercises.map((ex) =>
          ex.id === currentExercise.id ? updatedExercise : ex
        )
      );
    } catch (error) {
      console.error('Error adding set:', error);
      alert('Failed to add set');
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (!currentExercise) return;

    try {
      const { error } = await supabase.from('sets').delete().eq('id', setId);

      if (error) throw error;

      const updatedSets = currentExercise.sets.filter((s) => s.id !== setId);
      const updatedExercise = {
        ...currentExercise,
        sets: updatedSets,
      };

      setCurrentExercise(updatedExercise);
      setExercises(
        exercises.map((ex) =>
          ex.id === currentExercise.id ? updatedExercise : ex
        )
      );
    } catch (error) {
      console.error('Error deleting set:', error);
      alert('Failed to delete set');
    }
  };

  const handleDoneWithExercise = () => {
    setCurrentExercise(null);
    setState('camera');
  };

  const handleEndWorkout = async () => {
    if (!currentWorkout) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', currentWorkout.id);

      if (error) throw error;

      setCurrentWorkout(null);
      setExercises([]);
      setCurrentExercise(null);
      setState('idle');
      navigate('/history');
    } catch (error) {
      console.error('Error ending workout:', error);
      alert('Failed to end workout');
    }
  };

  if (state === 'idle') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <div className="text-center mb-8">
            <svg className="w-16 h-16 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h4l2 10h10m0 0l2-4H8m13 4a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z" />
              <rect x="1" y="8" width="3" height="8" rx="1" fill="currentColor" />
              <rect x="20" y="8" width="3" height="8" rx="1" fill="currentColor" />
              <rect x="7" y="6" width="10" height="2" rx="1" fill="currentColor" />
            </svg>
            <h1 className="text-3xl font-bold mb-2">GymSnap</h1>
            <p className="text-text-secondary">
              Photo-first workout tracking
            </p>
          </div>

          <button
            onClick={startWorkout}
            className="w-full max-w-md bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Start Workout
          </button>
        </div>
      </Layout>
    );
  }

  if (state === 'camera') {
    return (
      <Layout hideNav>
        {currentWorkout && (
          <WorkoutSession
            exercises={exercises}
            currentExercise={currentExercise}
            onEndWorkout={handleEndWorkout}
          />
        )}
        <Camera
          onCapture={handleCapture}
          onCancel={currentWorkout ? () => setState('idle') : undefined}
        />
      </Layout>
    );
  }

  if (state === 'identifying') {
    return (
      <Layout hideNav>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <svg className="w-16 h-16 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-text-secondary">Identifying exercise...</p>
        </div>
      </Layout>
    );
  }

  if (state === 'confirming' && identification) {
    return (
      <Layout hideNav>
        <ExerciseConfirm
          identification={identification}
          onConfirm={handleConfirmExercise}
          onRetake={() => setState('camera')}
        />
      </Layout>
    );
  }

  if (state === 'logging' && currentExercise) {
    return (
      <Layout hideNav>
        <SetLogger
          exerciseName={currentExercise.name}
          muscleGroup={currentExercise.muscle_group || ''}
          sets={currentExercise.sets}
          onAddSet={handleAddSet}
          onDeleteSet={handleDeleteSet}
          onDoneWithExercise={handleDoneWithExercise}
          onEndWorkout={handleEndWorkout}
        />
      </Layout>
    );
  }

  return null;
}
