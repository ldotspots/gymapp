import type { WorkoutWithExercises } from '../lib/types';

interface HistoryProps {
  workouts: WorkoutWithExercises[];
  loading: boolean;
}

export default function History({ workouts, loading }: HistoryProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-text-secondary">Loading workouts...</div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="1" y="8" width="3" height="8" rx="1" fill="currentColor" />
          <rect x="20" y="8" width="3" height="8" rx="1" fill="currentColor" />
          <rect x="7" y="6" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
        <h2 className="text-xl font-bold mb-2">No workouts yet</h2>
        <p className="text-text-secondary text-center">
          Start your first workout to see it here
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatDuration = (startedAt: string, endedAt?: string) => {
    if (!endedAt) return 'In progress';

    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) return `${diffMins}min`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b border-border bg-surface">
        <h1 className="text-2xl font-bold">Workout History</h1>
      </div>

      <div className="p-4 space-y-4">
        {workouts.map((workout) => {
          const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

          return (
            <div
              key={workout.id}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(workout.started_at)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatDuration(workout.started_at, workout.ended_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {workout.exercises.length} exercises
                  </div>
                  <div className="text-sm text-text-secondary">
                    {totalSets} sets
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {workout.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-background rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-xs text-text-secondary">
                          {exercise.muscle_group}
                        </div>
                      </div>
                      <div className="text-xs text-text-secondary">
                        {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {exercise.sets.map((set) => (
                        <div
                          key={set.id}
                          className="text-xs bg-surface border border-border rounded px-2 py-1"
                        >
                          {set.weight}
                          {set.weight_unit} × {set.reps}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {workout.notes && (
                <div className="mt-3 p-3 bg-background rounded-lg">
                  <div className="text-xs text-text-secondary mb-1">Notes</div>
                  <div className="text-sm">{workout.notes}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
