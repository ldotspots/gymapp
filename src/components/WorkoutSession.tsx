import type { ExerciseWithSets } from '../lib/types';

interface WorkoutSessionProps {
  exercises: ExerciseWithSets[];
  currentExercise: ExerciseWithSets | null;
  onEndWorkout: () => void;
}

export default function WorkoutSession({
  exercises,
  currentExercise,
  onEndWorkout,
}: WorkoutSessionProps) {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalExercises = exercises.length;

  if (!currentExercise && exercises.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border-b border-border p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm text-text-secondary">
            Current Workout
          </h3>
          <p className="text-sm">
            {totalExercises} {totalExercises === 1 ? 'exercise' : 'exercises'} • {totalSets} {totalSets === 1 ? 'set' : 'sets'}
          </p>
        </div>

        <button
          onClick={onEndWorkout}
          className="px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          End
        </button>
      </div>

      {exercises.length > 0 && (
        <div className="mt-4 space-y-2">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`p-3 rounded-lg border ${
                currentExercise?.id === exercise.id
                  ? 'bg-accent/10 border-accent'
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{exercise.name}</div>
                  <div className="text-xs text-text-secondary">
                    {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                  </div>
                </div>
                {currentExercise?.id === exercise.id && (
                  <span className="text-xs bg-accent text-white px-2 py-1 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
