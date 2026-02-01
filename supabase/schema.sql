-- GymSnap Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workouts (a session at the gym)
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises logged within a workout
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                    -- e.g. "Lat Pulldown"
  equipment TEXT,                        -- e.g. "Cable Machine"
  muscle_group TEXT,                     -- e.g. "Back"
  photo_url TEXT,                        -- Supabase Storage URL of the photo
  identified_by_ai BOOLEAN DEFAULT TRUE, -- Was this ID'd by AI or manually entered
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual sets within an exercise
CREATE TABLE sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL,                        -- in kg
  weight_unit TEXT DEFAULT 'kg',         -- kg or lbs
  rpe DECIMAL,                           -- Rate of Perceived Exertion (1-10), optional
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

-- Policies for workouts
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for exercises
CREATE POLICY "Users can view own exercises" ON exercises
  FOR SELECT USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own exercises" ON exercises
  FOR INSERT WITH CHECK (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own exercises" ON exercises
  FOR UPDATE USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own exercises" ON exercises
  FOR DELETE USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

-- Policies for sets
CREATE POLICY "Users can view own sets" ON sets
  FOR SELECT USING (
    exercise_id IN (
      SELECT e.id FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sets" ON sets
  FOR INSERT WITH CHECK (
    exercise_id IN (
      SELECT e.id FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sets" ON sets
  FOR UPDATE USING (
    exercise_id IN (
      SELECT e.id FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sets" ON sets
  FOR DELETE USING (
    exercise_id IN (
      SELECT e.id FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Create storage bucket for exercise photos (run this in the Storage section)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-photos', 'exercise-photos', true);

-- Storage policies (run after creating the bucket)
-- CREATE POLICY "Users can upload own photos" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'exercise-photos' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Anyone can view photos" ON storage.objects
--   FOR SELECT USING (bucket_id = 'exercise-photos');
