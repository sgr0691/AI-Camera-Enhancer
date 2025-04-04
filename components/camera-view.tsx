"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraCapture } from "./camera-capture"
import { EnhanceControls } from "./enhance-controls"
import { EnhancedImage } from "./enhanced-image"
import { ImageGallery } from "./image-gallery"
import { useToast } from "@/components/ui/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"

type CapturedImage = {
  id: string
  dataUrl: string
  enhancedVersions: {
    id: string
    name: string
    dataUrl: string
    prompt?: string
  }[]
}

export function CameraView() {
  const [activeTab, setActiveTab] = useState("camera")
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // First, modify the handleCapture function to handle file uploads better
  const handleCapture = (dataUrl: string) => {
    const newImage: CapturedImage = {
      id: `img-${Date.now()}`,
      dataUrl,
      enhancedVersions: [],
    }
    setCapturedImages((prev) => [newImage, ...prev])
    setSelectedImage(newImage)
    setActiveTab("enhance")

    toast({
      title: "Image captured!",
      description: "You can now enhance your photo",
    })
  }

  // Add a new function to handle direct file uploads from the main UI
  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        handleCapture(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Reset the input value to allow selecting the same file again
    e.target.value = ""
  }

  const handleGenerateEnhancements = async (prompt: string, imageId: string) => {
    setIsEnhancing(true)

    try {
      // Simulate AI processing with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Find the image to enhance
      const imageToEnhance = capturedImages.find((img) => img.id === imageId)
      if (!imageToEnhance) throw new Error("Image not found")

      // Create enhanced versions (in a real app, these would come from an AI model)
      const enhancedVersions = [
        {
          id: `enhanced-${Date.now()}-1`,
          name: "Night Mode",
          dataUrl: await simulateEnhancement(imageToEnhance.dataUrl, "night"),
          prompt,
        },
        {
          id: `enhanced-${Date.now()}-2`,
          name: "HDR",
          dataUrl: await simulateEnhancement(imageToEnhance.dataUrl, "hdr"),
          prompt,
        },
        {
          id: `enhanced-${Date.now()}-3`,
          name: "Clarity",
          dataUrl: await simulateEnhancement(imageToEnhance.dataUrl, "clarity"),
          prompt,
        },
      ]

      // Update the image with enhanced versions
      const updatedImages = capturedImages.map((img) => {
        if (img.id === imageId) {
          return {
            ...img,
            enhancedVersions: [...enhancedVersions, ...img.enhancedVersions],
          }
        }
        return img
      })

      setCapturedImages(updatedImages)
      setSelectedImage(updatedImages.find((img) => img.id === imageId) || null)

      toast({
        title: "Enhancement complete!",
        description: "Your image has been enhanced with AI",
      })
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "There was an error enhancing your image",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSelectImage = (image: CapturedImage) => {
    setSelectedImage(image)
    setActiveTab("enhance")
  }

  // Simple simulation of image enhancement effects
  const simulateEnhancement = async (dataUrl: string, type: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        if (!ctx) return resolve(dataUrl)

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Apply filter based on type
        switch (type) {
          case "night":
            // Brighten dark areas, increase contrast
            ctx.filter = "brightness(1.2) contrast(1.3) saturate(0.8)"
            ctx.drawImage(img, 0, 0)
            break
          case "hdr":
            // Increase saturation and contrast
            ctx.filter = "contrast(1.4) saturate(1.3)"
            ctx.drawImage(img, 0, 0)
            break
          case "clarity":
            // Sharpen and increase clarity
            ctx.filter = "contrast(1.2) brightness(1.1) saturate(1.1)"
            ctx.drawImage(img, 0, 0)
            break
        }

        resolve(canvas.toDataURL("image/jpeg"))
      }
      img.src = dataUrl
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-1 bg-muted rounded-none">
          <TabsTrigger
            value="camera"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white rounded-lg"
          >
            Camera
          </TabsTrigger>
          <TabsTrigger
            value="enhance"
            disabled={!selectedImage}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-white rounded-lg"
          >
            Enhance
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            disabled={capturedImages.length === 0}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white rounded-lg"
          >
            Gallery {capturedImages.length > 0 && `(${capturedImages.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="mt-0">
          <CameraCapture onCapture={handleCapture} />
          {activeTab === "camera" && capturedImages.length === 0 && (
            <div className="mt-4 text-center p-4 bg-gradient-bg-light rounded-b-lg">
              <p className="text-sm text-muted-foreground mb-2">You can also upload an image directly:</p>
              <label
                htmlFor="direct-image-upload"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 h-10 px-6 py-2 cursor-pointer shadow-md"
              >
                Upload Image
              </label>
              <input
                id="direct-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDirectFileUpload}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="enhance" className="mt-0 p-4">
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <EnhancedImage
                  originalImage={selectedImage.dataUrl}
                  enhancedVersions={selectedImage.enhancedVersions}
                />
              </div>
              <div className="md:col-span-1">
                <EnhanceControls
                  onEnhance={(prompt) => handleGenerateEnhancements(prompt, selectedImage.id)}
                  isLoading={isEnhancing}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="mt-0 p-4">
          <ImageGallery images={capturedImages} onSelectImage={handleSelectImage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

