import { useState } from 'react';
import type { Set } from '../lib/types';

interface SetLoggerProps {
  exerciseName: string;
  muscleGroup: string;
  sets: Set[];
  onAddSet: (weight: number, reps: number, weightUnit: 'kg' | 'lbs', rpe?: number) => void;
  onDeleteSet: (setId: string) => void;
  onDoneWithExercise: () => void;
  onEndWorkout: () => void;
}

export default function SetLogger({
  exerciseName,
  muscleGroup,
  sets,
  onAddSet,
  onDeleteSet,
  onDoneWithExercise,
  onEndWorkout,
}: SetLoggerProps) {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [rpe, setRpe] = useState<string>('');
  const [showRpe, setShowRpe] = useState(false);

  const handleAddSet = () => {
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);
    const rpeNum = rpe ? parseFloat(rpe) : undefined;

    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      alert('Please enter valid reps');
      return;
    }

    if (rpeNum !== undefined && (isNaN(rpeNum) || rpeNum < 1 || rpeNum > 10)) {
      alert('RPE must be between 1 and 10');
      return;
    }

    onAddSet(weightNum, repsNum, weightUnit, rpeNum);

    // Keep weight but clear reps for next set
    setReps('');
    setRpe('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border p-4">
        <h2 className="text-2xl font-bold">{exerciseName}</h2>
        <p className="text-sm text-text-secondary">{muscleGroup}</p>
      </div>

      {/* Sets List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sets.length > 0 && (
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">
              Completed Sets
            </h3>
            {sets.map((set) => (
              <div
                key={set.id}
                className="flex items-center justify-between bg-surface border border-border rounded-lg p-4"
              >
                <div>
                  <span className="font-semibold">Set {set.set_number}</span>
                  <span className="text-text-secondary mx-2">•</span>
                  <span className="text-accent font-medium">
                    {set.weight}{set.weight_unit} × {set.reps}
                  </span>
                  {set.rpe && (
                    <>
                      <span className="text-text-secondary mx-2">•</span>
                      <span className="text-sm text-text-secondary">
                        RPE {set.rpe}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => onDeleteSet(set.id)}
                  className="text-danger hover:text-red-400 p-2"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Set Form */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">
            {sets.length === 0 ? 'First Set' : `Set ${sets.length + 1}`}
          </h3>

          {/* Weight Input */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 p-3 bg-background border border-border rounded-lg text-white focus:border-accent focus:outline-none"
              />
              <div className="flex bg-background border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-4 py-3 transition-colors ${
                    weightUnit === 'kg'
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-4 py-3 transition-colors ${
                    weightUnit === 'lbs'
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>

          {/* Reps Input */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Reps
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-lg text-white focus:border-accent focus:outline-none"
            />
          </div>

          {/* RPE Input (Optional) */}
          {showRpe && (
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                RPE (1-10, optional)
              </label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Rate of Perceived Exertion"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                min="1"
                max="10"
                step="0.5"
                className="w-full p-3 bg-background border border-border rounded-lg text-white focus:border-accent focus:outline-none"
              />
            </div>
          )}

          {!showRpe && (
            <button
              onClick={() => setShowRpe(true)}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              + Add RPE
            </button>
          )}

          <button
            onClick={handleAddSet}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-lg transition-colors"
          >
            Add Set
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border p-4 space-y-3">
        <button
          onClick={onDoneWithExercise}
          className="w-full bg-surface hover:bg-border text-white font-semibold py-4 rounded-lg border border-border transition-colors"
        >
          Done with Exercise
        </button>
        <button
          onClick={onEndWorkout}
          className="w-full bg-transparent hover:bg-surface text-text-secondary font-semibold py-4 rounded-lg transition-colors"
        >
          End Workout
        </button>
      </div>
    </div>
  );
}
