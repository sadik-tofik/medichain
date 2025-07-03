'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Camera, Flashlight } from 'lucide-react';

interface QrScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScan, onClose }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !isFlashOn }]
          });
          setIsFlashOn(!isFlashOn);
        } catch (error) {
          console.error('Flash toggle failed:', error);
        }
      }
    }
  };

  // Simulate QR code detection (in a real app, you'd use a QR code library)
  const simulateQrDetection = () => {
    const mockBatchId = `BTC-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    onScan(mockBatchId);
  };

  if (!hasCamera) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Camera Access Required
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Camera access is required to scan QR codes. Please enable camera permissions and try again.
            </p>
            <div className="flex space-x-2">
              <Button onClick={startCamera} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Enable Camera
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-4">
        <div className="flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Scanner Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Scanner Frame */}
          <div className="w-64 h-64 border-2 border-white rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            
            {/* Scanning Line */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary scan-animation"></div>
          </div>
          
          <p className="text-white text-center mt-4">
            Position QR code within the frame
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-center justify-center space-x-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleFlash}
            className="text-white hover:bg-white/10 rounded-full w-16 h-16"
          >
            <Flashlight className={`w-6 h-6 ${isFlashOn ? 'text-yellow-400' : ''}`} />
          </Button>
          
          {/* Demo: Simulate scan */}
          <Button
            onClick={simulateQrDetection}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Demo Scan
          </Button>
          
          <div className="w-16 h-16"></div> {/* Spacer for symmetry */}
        </div>
        
        <p className="text-white/70 text-center text-sm mt-4">
          Tap "Demo Scan" to simulate QR code detection
        </p>
      </div>
    </div>
  );
}