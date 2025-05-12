import { Toaster } from "@/components/ui/toaster"

export default function GalleryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container flex flex-col items-center py-4 md:py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Gallery</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-2xl">View your captured and enhanced photos.</p>
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">This page would display all your gallery images.</p>
            <p className="text-muted-foreground mt-2">For now, please use the Gallery tab in the camera view.</p>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

