// Database types matching Supabase schema

export interface Workout {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  notes?: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  workout_id: string;
  name: string;
  equipment?: string;
  muscle_group?: string;
  photo_url?: string;
  identified_by_ai: boolean;
  created_at: string;
}

export interface Set {
  id: string;
  exercise_id: string;
  set_number: number;
  reps?: number;
  weight?: number;
  weight_unit: 'kg' | 'lbs';
  rpe?: number;
  notes?: string;
  created_at: string;
}

// AI identification response
export interface ExerciseIdentification {
  exercise_name: string;
  equipment: string;
  muscle_group: string;
  confidence: 'high' | 'medium' | 'low';
  alternatives: string[];
}

// Combined types for UI
export interface ExerciseWithSets extends Exercise {
  sets: Set[];
}

export interface WorkoutWithExercises extends Workout {
  exercises: ExerciseWithSets[];
}

// Common exercise list for fallback/editing
export const COMMON_EXERCISES = [
  // Chest
  { name: 'Bench Press', equipment: 'Barbell', muscle_group: 'Chest' },
  { name: 'Incline Bench Press', equipment: 'Barbell', muscle_group: 'Chest' },
  { name: 'Dumbbell Press', equipment: 'Dumbbell', muscle_group: 'Chest' },
  { name: 'Chest Fly', equipment: 'Cable Machine', muscle_group: 'Chest' },
  { name: 'Push-ups', equipment: 'Bodyweight', muscle_group: 'Chest' },

  // Back
  { name: 'Lat Pulldown', equipment: 'Cable Machine', muscle_group: 'Back' },
  { name: 'Pull-ups', equipment: 'Bodyweight', muscle_group: 'Back' },
  { name: 'Barbell Row', equipment: 'Barbell', muscle_group: 'Back' },
  { name: 'Dumbbell Row', equipment: 'Dumbbell', muscle_group: 'Back' },
  { name: 'Seated Cable Row', equipment: 'Cable Machine', muscle_group: 'Back' },
  { name: 'Deadlift', equipment: 'Barbell', muscle_group: 'Back' },

  // Legs
  { name: 'Squat', equipment: 'Barbell', muscle_group: 'Legs' },
  { name: 'Leg Press', equipment: 'Machine', muscle_group: 'Legs' },
  { name: 'Leg Extension', equipment: 'Machine', muscle_group: 'Legs' },
  { name: 'Leg Curl', equipment: 'Machine', muscle_group: 'Legs' },
  { name: 'Lunges', equipment: 'Dumbbell', muscle_group: 'Legs' },
  { name: 'Calf Raise', equipment: 'Machine', muscle_group: 'Legs' },

  // Shoulders
  { name: 'Overhead Press', equipment: 'Barbell', muscle_group: 'Shoulders' },
  { name: 'Dumbbell Shoulder Press', equipment: 'Dumbbell', muscle_group: 'Shoulders' },
  { name: 'Lateral Raise', equipment: 'Dumbbell', muscle_group: 'Shoulders' },
  { name: 'Front Raise', equipment: 'Dumbbell', muscle_group: 'Shoulders' },
  { name: 'Face Pull', equipment: 'Cable Machine', muscle_group: 'Shoulders' },

  // Arms
  { name: 'Bicep Curl', equipment: 'Dumbbell', muscle_group: 'Arms' },
  { name: 'Hammer Curl', equipment: 'Dumbbell', muscle_group: 'Arms' },
  { name: 'Tricep Extension', equipment: 'Cable Machine', muscle_group: 'Arms' },
  { name: 'Tricep Dips', equipment: 'Bodyweight', muscle_group: 'Arms' },
  { name: 'Cable Curl', equipment: 'Cable Machine', muscle_group: 'Arms' },

  // Core
  { name: 'Plank', equipment: 'Bodyweight', muscle_group: 'Core' },
  { name: 'Crunches', equipment: 'Bodyweight', muscle_group: 'Core' },
  { name: 'Russian Twist', equipment: 'Bodyweight', muscle_group: 'Core' },
  { name: 'Cable Crunch', equipment: 'Cable Machine', muscle_group: 'Core' },
  { name: 'Leg Raises', equipment: 'Bodyweight', muscle_group: 'Core' },
];
