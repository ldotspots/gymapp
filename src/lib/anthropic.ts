import type { ExerciseIdentification } from './types';

export async function identifyExercise(
  imageBase64: string,
  mediaType: string = 'image/jpeg'
): Promise<ExerciseIdentification> {
  const response = await fetch('/api/identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mediaType,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to identify exercise');
  }

  const result = await response.json();
  return result as ExerciseIdentification;
}
