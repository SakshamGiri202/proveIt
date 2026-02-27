'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploadWidgetProps {
  onPhotoCapture: (file: File, preview: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PhotoUploadWidget({
  onPhotoCapture,
  loading = false,
  disabled = false,
}: PhotoUploadWidgetProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadType, setUploadType] = useState<'camera' | 'file' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setUploadType('camera');
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access denied. Please allow camera access and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setUploadType(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setPreview(dataUrl);

        // Convert to File
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            onPhotoCapture(file, dataUrl);
          }
        }, 'image/jpeg', 0.95);

        stopCamera();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPreview(dataUrl);
        onPhotoCapture(file, dataUrl);
        setUploadType('file');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setUploadType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Photo</CardTitle>
        <CardDescription>
          Take a photo with your camera or upload from your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img
              src={preview}
              alt="Photo preview"
              className="w-full h-auto aspect-square object-cover"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Camera View */}
        {cameraActive && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                className="flex-1 gap-2"
                disabled={loading || !cameraActive}
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </Button>
              <Button
                variant="outline"
                onClick={stopCamera}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Upload Options */}
        {!cameraActive && !preview && (
          <div className="space-y-3">
            <Button
              onClick={startCamera}
              className="w-full gap-2"
              disabled={disabled || loading}
              variant="default"
            >
              <Camera className="w-4 h-4" />
              Use Camera
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
              disabled={disabled || loading}
              variant="outline"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || loading}
            />

            <p className="text-xs text-muted-foreground text-center">
              JPG, PNG, or WebP • Max 10MB
            </p>
          </div>
        )}

        {/* Hidden Canvas for Image Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
