import { CameraView } from "@/components/camera-view"
import { Toaster } from "@/components/ui/toaster"
import { Camera, Wand2, Download } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-background to-muted">
      <div className="container flex flex-col items-center py-4 md:py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            AI Camera Enhancer
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Capture and enhance photos with AI. Perfect for challenging scenes like night photography, full moon shots,
            fireworks, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-primary/10">
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mb-3">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-medium mb-1 text-lg">Capture or Upload</h3>
            <p className="text-sm text-muted-foreground">Take a photo or upload an existing one</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-secondary/10">
            <div className="w-14 h-14 rounded-full gradient-bg-secondary flex items-center justify-center mb-3">
              <Wand2 className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-medium mb-1 text-lg">AI Enhancement</h3>
            <p className="text-sm text-muted-foreground">Let AI improve your photos automatically</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-accent/10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center mb-3">
              <Download className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-medium mb-1 text-lg">Save & Share</h3>
            <p className="text-sm text-muted-foreground">Download or share your enhanced photos</p>
          </div>
        </div>

        <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-primary/10">
          <CameraView />
        </div>
      </div>
      <Toaster />
    </main>
  )
}

