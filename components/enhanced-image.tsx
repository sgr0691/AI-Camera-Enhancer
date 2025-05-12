"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface EnhancedImageProps {
  originalImage: string
  enhancedVersions: {
    id: string
    name: string
    dataUrl: string
    prompt?: string
  }[]
}

export function EnhancedImage({ originalImage, enhancedVersions }: EnhancedImageProps) {
  const [activeTab, setActiveTab] = useState("original")
  const [showComparison, setShowComparison] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    const activeImage =
      activeTab === "original"
        ? originalImage
        : enhancedVersions.find((v) => v.id === activeTab)?.dataUrl || originalImage

    setIsDownloading(true)

    // Simulate download progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)
        setIsDownloading(false)

        // Create an anchor element and trigger download
        const link = document.createElement("a")
        link.href = activeImage
        link.download = `ai-enhanced-image-${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Image downloaded",
          description: "Your enhanced image has been saved to your device",
        })
      }
    }, 100)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const activeImage =
          activeTab === "original"
            ? originalImage
            : enhancedVersions.find((v) => v.id === activeTab)?.dataUrl || originalImage

        // Convert base64 to blob for sharing
        const response = await fetch(activeImage)
        const blob = await response.blob()

        await navigator.share({
          title: "AI Enhanced Image",
          files: [new File([blob], "enhanced-image.jpg", { type: "image/jpeg" })],
        })

        toast({
          title: "Share initiated",
          description: "Opening share dialog for your image",
        })
      } else {
        toast({
          title: "Sharing not supported",
          description: "Your browser doesn't support the Web Share API",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing your image",
        variant: "destructive",
      })
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  return (
    <Card className="overflow-hidden border-primary/20 shadow-md">
      <div className="p-4">
        {enhancedVersions.length > 0 ? (
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-primary">Enhanced Images</h3>
              <p className="text-sm text-muted-foreground">Compare the original with AI enhancements</p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                className="border-primary/20 hover:bg-primary/10 text-primary"
              >
                {showComparison ? "Hide Comparison" : "Show Comparison"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h3 className="font-medium text-primary">Original Image</h3>
            <p className="text-sm text-muted-foreground">Use the enhance controls to generate AI improvements</p>
          </div>
        )}

        {enhancedVersions.length > 0 && !showComparison ? (
          <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex-wrap bg-muted/50">
              <TabsTrigger
                value="original"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 rounded-md"
              >
                Original
              </TabsTrigger>
              {enhancedVersions.map((version) => (
                <TabsTrigger
                  key={version.id}
                  value={version.id}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary/20 data-[state=active]:to-primary/20 rounded-md"
                >
                  {version.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="original" className="mt-2">
              <div className="relative aspect-[4/3] bg-black flex items-center justify-center rounded-md overflow-hidden">
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </TabsContent>

            {enhancedVersions.map((version) => (
              <TabsContent key={version.id} value={version.id} className="mt-2">
                <div className="relative aspect-[4/3] bg-black flex items-center justify-center rounded-md overflow-hidden">
                  <img
                    src={version.dataUrl || "/placeholder.svg"}
                    alt={version.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {version.prompt && (
                  <div className="mt-2 p-2 bg-gradient-bg-light rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-1 bg-primary/10 text-primary border-primary/20">
                        Prompt
                      </Badge>
                      {version.prompt}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : enhancedVersions.length > 0 && showComparison ? (
          <div className="relative aspect-[4/3] bg-black rounded-md overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <img src={originalImage || "/placeholder.svg"} alt="Original" className="w-full h-full object-contain" />
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <img
                src={enhancedVersions[0]?.dataUrl || originalImage}
                alt="Enhanced"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-0.5 bg-white opacity-80" style={{ left: `${sliderPosition}%` }}></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute bottom-4 left-0 right-0 mx-auto w-4/5 h-1 appearance-none bg-white rounded-full"
              style={{
                accentColor: "white",
              }}
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="opacity-70">
                Original
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="opacity-70">
                {enhancedVersions[0]?.name || "Enhanced"}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-black flex items-center justify-center rounded-md overflow-hidden">
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Original"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>

      <Separator className="bg-primary/10" />

      <div className="p-4 flex justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            {activeTab === "original"
              ? "Original Image"
              : enhancedVersions.find((v) => v.id === activeTab)?.name || "Enhanced"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={isDownloading}
            className="border-primary/20 hover:bg-primary/10"
          >
            <Share2 className="h-4 w-4 mr-1 text-primary" /> Share
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            {isDownloading ? (
              <>
                <Progress value={100} className="w-10 h-2 mr-2 bg-white/20" />
                Saving...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

