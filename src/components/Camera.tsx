import { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string, mediaType: string) => void;
  onCancel?: () => void;
}

export default function Camera({ onCapture, onCancel }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use rear camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or use the gallery option.');
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to JPEG with compression (aim for ~200KB)
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Remove the data:image/jpeg;base64, prefix
          const base64 = base64data.split(',')[1];

          // Stop camera
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          onCapture(base64, 'image/jpeg');
        };
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      0.8 // Quality (0-1), adjust for file size
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64 = base64data.split(',')[1];
      const mediaType = file.type;

      onCapture(base64, mediaType);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {!cameraActive && !error && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">
            Capture Exercise
          </h2>

          <button
            onClick={startCamera}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open Camera
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-surface hover:bg-border text-white font-semibold py-4 px-6 rounded-lg border border-border transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose from Gallery
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-transparent hover:bg-surface text-text-secondary font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="bg-danger/10 border border-danger text-white p-4 rounded-lg">
            <p className="font-semibold mb-2">Camera Error</p>
            <p className="text-sm">{error}</p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose from Gallery
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-transparent hover:bg-surface text-text-secondary font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {cameraActive && (
        <div className="relative w-full max-w-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-colors text-lg flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              Capture
            </button>

            {onCancel && (
              <button
                onClick={() => {
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                  }
                  setCameraActive(false);
                  onCancel();
                }}
                className="bg-surface hover:bg-border text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden canvas for capturing photo */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
