"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ImageGalleryProps {
  images: {
    id: string
    dataUrl: string
    enhancedVersions: {
      id: string
      name: string
      dataUrl: string
    }[]
  }[]
  onSelectImage: (image: any) => void
}

export function ImageGallery({ images, onSelectImage }: ImageGalleryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Photos</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden group relative border-primary/20 shadow-md hover:shadow-lg transition-shadow"
          >
            <button onClick={() => onSelectImage(image)} className="w-full h-full p-0 border-0">
              <div className="aspect-square relative">
                <img
                  src={image.dataUrl || "/placeholder.svg"}
                  alt="Captured"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {image.enhancedVersions.length > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-3 py-1 rounded-full shadow-sm">
                      {image.enhancedVersions.length} enhanced
                    </span>
                  </div>
                )}
              </div>
            </button>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-lg bg-gradient-bg-light">
          <p className="text-muted-foreground">No images captured yet</p>
        </div>
      )}
    </div>
  )
}

