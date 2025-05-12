"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, FlipHorizontal, ImagePlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [hasCamera, setHasCamera] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Update the CameraCapture component to better handle camera permission issues

  // First, add a new state to track permission status
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt")

  // Then, modify the initCamera function to better handle permissions
  const initCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // Check if permissions are already granted
      if (navigator.mediaDevices && navigator.permissions) {
        try {
          const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName })
          setPermissionState(cameraPermission.state as "prompt" | "granted" | "denied")

          // If already denied, don't even try to request
          if (cameraPermission.state === "denied") {
            setHasCamera(false)
            throw new Error("Camera permission denied")
          }
        } catch (permError) {
          // Some browsers don't support permission query for camera
          console.log("Permission query not supported, will try direct access")
        }
      }

      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode,
        },
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia(constraints)
        setStream(newStream)

        if (videoRef.current) {
          videoRef.current.srcObject = newStream
        }

        setHasCamera(true)
        setPermissionState("granted")
      } catch (streamError: any) {
        console.error("Error accessing camera:", streamError)

        // Set more specific error states based on the error
        if (streamError.name === "NotAllowedError") {
          setPermissionState("denied")
        }

        setHasCamera(false)
        throw streamError
      }
    } catch (error) {
      console.error("Camera initialization error:", error)
      setHasCamera(false)
    }
  }

  useEffect(() => {
    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to the canvas
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg")
      onCapture(dataUrl)
    }

    setIsCapturing(false)
  }

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onCapture(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Reset the input value to allow selecting the same file again
    e.target.value = ""
  }

  return (
    <Card className="overflow-hidden border-primary/20 shadow-md">
      <CardContent className="p-0 relative">
        {hasCamera ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover bg-black" />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity shadow-lg pulse-animation"
                onClick={captureImage}
                disabled={isCapturing}
              >
                <Camera className="h-7 w-7" />
              </Button>

              {isMobile && (
                <Button
                  size="icon"
                  variant="outline"
                  className="w-12 h-12 rounded-full bg-white/80 border-primary/20 hover:bg-primary/10"
                  onClick={switchCamera}
                >
                  <FlipHorizontal className="h-5 w-5 text-primary" />
                </Button>
              )}
            </div>
          </>
        ) : (
          // Replace the "Camera not available" message with a more helpful UI
          // Replace the existing fallback UI in the return statement with this:
          !hasCamera && (
            <div className="flex flex-col items-center justify-center p-8 min-h-[300px] bg-gradient-bg-light">
              <div className="mb-6 text-center">
                {permissionState === "denied" ? (
                  <>
                    <h3 className="text-lg font-medium mb-2 text-primary">Camera Permission Denied</h3>
                    <p className="text-muted-foreground mb-4">
                      To use the camera feature, you'll need to allow camera access in your browser settings.
                    </p>
                    <div className="bg-white p-4 rounded-md text-sm mb-4 shadow-md border border-primary/20">
                      <p className="font-medium text-primary">How to enable camera access:</p>
                      <ol className="list-decimal list-inside text-left mt-2 space-y-1">
                        <li>Click the camera or lock icon in your browser's address bar</li>
                        <li>Select "Allow" for camera access</li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2 text-primary">Camera Not Available</h3>
                    <p className="text-muted-foreground">
                      We couldn't access your camera. This could be due to hardware issues or another app using your
                      camera.
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-2 shadow-md hover:opacity-90 transition-opacity">
                    <ImagePlus className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-center text-sm font-medium text-primary">Upload an image instead</p>
                  <p className="text-center text-xs text-muted-foreground mt-1">
                    You can still enhance photos by uploading them
                  </p>
                </label>
                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>
          )
        )}

        {/* Upload button for all users, even those with camera */}
        {hasCamera && (
          <div className="absolute top-4 right-4">
            <label htmlFor="camera-image-upload" className="cursor-pointer">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 hover:opacity-90 transition-opacity shadow-md">
                <ImagePlus className="h-5 w-5 text-white" />
              </div>
            </label>
            <input
              id="camera-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

