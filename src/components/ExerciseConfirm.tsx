import { useState } from 'react';
import type { ExerciseIdentification } from '../lib/types';
import { COMMON_EXERCISES } from '../lib/types';

interface ExerciseConfirmProps {
  identification: ExerciseIdentification;
  onConfirm: (exerciseName: string, equipment: string, muscleGroup: string) => void;
  onRetake?: () => void;
}

export default function ExerciseConfirm({
  identification,
  onConfirm,
  onRetake,
}: ExerciseConfirmProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(identification.exercise_name);
  const [searchQuery, setSearchQuery] = useState('');

  const confidenceColor = {
    high: 'bg-confidence-high',
    medium: 'bg-confidence-medium',
    low: 'bg-confidence-low',
  }[identification.confidence];

  const handleConfirm = () => {
    if (isEditing) {
      const exercise = COMMON_EXERCISES.find(ex => ex.name === selectedExercise);
      if (exercise) {
        onConfirm(exercise.name, exercise.equipment, exercise.muscle_group);
      }
    } else {
      onConfirm(
        identification.exercise_name,
        identification.equipment,
        identification.muscle_group
      );
    }
  };

  const handleSelectAlternative = (alternative: string) => {
    const exercise = COMMON_EXERCISES.find(ex => ex.name === alternative);
    if (exercise) {
      onConfirm(exercise.name, exercise.equipment, exercise.muscle_group);
    }
  };

  const filteredExercises = COMMON_EXERCISES.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <h2 className="text-2xl font-bold mb-4">Edit Exercise</h2>

        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 mb-4 bg-surface border border-border rounded-lg text-white focus:border-accent focus:outline-none"
        />

        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.name}
              onClick={() => setSelectedExercise(exercise.name)}
              className={`w-full p-4 rounded-lg border transition-colors text-left ${
                selectedExercise === exercise.name
                  ? 'bg-accent border-accent text-white'
                  : 'bg-surface border-border text-white hover:bg-border'
              }`}
            >
              <div className="font-semibold">{exercise.name}</div>
              <div className="text-sm text-text-secondary">
                {exercise.muscle_group} • {exercise.equipment}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-surface hover:bg-border text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedExercise}
            className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Confirm Exercise
        </h2>

        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{identification.exercise_name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${confidenceColor}`}
            >
              {identification.confidence}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-text-secondary">Muscle Group:</span>{' '}
              <span className="text-white font-medium">{identification.muscle_group}</span>
            </div>
            <div>
              <span className="text-text-secondary">Equipment:</span>{' '}
              <span className="text-white font-medium">{identification.equipment}</span>
            </div>
          </div>
        </div>

        {identification.alternatives.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-text-secondary mb-3">
              Or did you mean:
            </p>
            <div className="flex flex-wrap gap-2">
              {identification.alternatives.map((alt) => (
                <button
                  key={alt}
                  onClick={() => handleSelectAlternative(alt)}
                  className="px-4 py-2 bg-surface hover:bg-border border border-border rounded-lg text-sm transition-colors"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            ✓ Correct
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-surface hover:bg-border text-white font-semibold py-4 px-6 rounded-lg border border-border transition-colors"
          >
            ✎ Edit
          </button>

          {onRetake && (
            <button
              onClick={onRetake}
              className="w-full bg-transparent hover:bg-surface text-text-secondary font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Retake Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
