# Quick Start Guide - AI Photo Enhancer iOS

## 🚀 Get Started in 5 Minutes

### 1. Open the Project
```bash
cd ios-app
open AIPhotoEnhancer.xcodeproj
```

### 2. Configure Code Signing
1. Click on the project in the left sidebar
2. Select the "AIPhotoEnhancer" target
3. Go to "Signing & Capabilities"
4. Choose your Team from the dropdown
5. Xcode will automatically generate a bundle identifier

### 3. Run on Device
1. Connect your iPhone via USB
2. Select your device from the device dropdown (top toolbar)
3. Press `⌘ + R` to build and run

### 4. Grant Permissions
When the app launches, you'll be asked for:
- ✅ Camera access
- ✅ Photo Library access
- ✅ Microphone access
- ✅ Speech Recognition access

Tap "Allow" for all to unlock full functionality!

## 📱 Using the App

### Basic Flow
1. **Capture/Select Photo**
   - Tap the camera button to take a photo
   - Or tap "Choose from Library" to select existing photo

2. **Add Enhancement Prompt**
   - Select a preset (Night, HDR, etc.) OR
   - Type your own prompt OR
   - Tap the microphone and speak your prompt

3. **Enhance**
   - Tap "Enhance Image" button
   - Wait for processing (currently 2 seconds simulated)

4. **View Results**
   - Swipe between Original and Enhanced tabs
   - Or tap "Compare" for side-by-side slider

5. **Save/Share**
   - Tap "Save" to add to Photos
   - Tap "Share" to share via any app

### Features to Try

**📸 Camera Mode**
- Take live photos with front or back camera
- Automatic permission handling

**🎤 Voice Dictation**
- Tap microphone icon while typing prompt
- Speak naturally - it transcribes in real-time
- Tap again to stop recording

**🔄 Before/After Comparison**
- Tap "Compare" button on results
- Drag slider left/right to compare
- See exact differences in detail

**📚 Gallery**
- Tap photo stack icon (top right)
- View all your enhancements
- Tap any item for full detail view

**🎨 Presets**
- Night Scene - for low-light photos
- HDR - for high dynamic range
- Clarity - for sharpness
- Moon Shot - for moon photography
- Fireworks - for vibrant colors
- Landmark - for architectural shots

## ⚙️ Backend Setup (For Developers)

The app currently uses a **placeholder** enhancement that applies basic filters. To connect to your AI backend:

### Option 1: Quick Test with Mock API
```swift
// Services/EnhancementAPIService.swift
private let baseURL = "http://localhost:3000/api/enhance"
```

### Option 2: Production API
```swift
// Services/EnhancementAPIService.swift
private let baseURL = "https://your-api.com/enhance"

// Uncomment the implementation in enhanceImage()
// Add your API key and authentication
```

### API Contract
Your backend should accept:
```
POST /api/enhance
Content-Type: multipart/form-data

Fields:
- image: file (JPEG)
- prompt: string
- strength: float (0.0 - 1.0)

Response:
- Enhanced image (JPEG binary)
```

## 🐛 Troubleshooting

### App Won't Run
- ✅ Check you selected a device (not "Any iOS Device")
- ✅ Clean build folder: `⌘ + Shift + K`
- ✅ Restart Xcode

### Camera Not Working
- ✅ You MUST test on a real device (simulator has no camera)
- ✅ Grant camera permission in Settings > Privacy
- ✅ Check Info.plist has NSCameraUsageDescription

### Voice Not Working
- ✅ Grant microphone + speech recognition permissions
- ✅ Test on real device (simulator support is limited)
- ✅ Check internet connection (required for speech recognition)

### Images Not Saving
- ✅ Grant photo library permission
- ✅ Check Settings > Privacy > Photos
- ✅ Ensure device has storage space

### Build Errors
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean build folder in Xcode
⌘ + Shift + K

# Rebuild
⌘ + B
```

## 📋 Requirements

- **macOS**: 13.0+ (Ventura or later)
- **Xcode**: 15.0+
- **iOS Device**: 17.0+
- **Apple ID**: For code signing

## 🎯 Key Files to Know

```
AIPhotoEnhancer/
├── 📱 AIPhotoEnhancerApp.swift     # App entry point
├── 📋 Info.plist                   # Permissions config
├── 🎨 ContentView.swift            # Main screen
├── 📸 ImageInputView.swift         # Camera/Photo picker
├── 🎤 PromptComposerView.swift     # Text/Voice input
├── ⚡️ EnhancementAPIService.swift  # API integration (EDIT THIS)
└── 🎨 Theme.swift                  # Colors and styling
```

## 💡 Pro Tips

1. **Testing on Simulator**: Most features work, but camera and some voice features require a real device

2. **Debugging**: Use `print()` statements or set breakpoints to debug

3. **Customizing**: Edit `Theme.swift` to change colors and styling

4. **Adding Presets**: Edit `EnhancementModels.swift` to add custom presets

5. **Performance**: Large images (>12MP) may be slow - consider downscaling before upload

## 🚢 Next Steps

### For Users
- Start enhancing photos!
- Try different presets
- Experiment with voice prompts
- Build your enhancement gallery

### For Developers
1. Integrate your AI backend API
2. Add persistent storage (Core Data)
3. Implement image preprocessing
4. Add more presets
5. Submit to App Store!

## 📚 Documentation

- **Full Guide**: See `README.md`
- **Implementation Details**: See `IMPLEMENTATION_NOTES.md`
- **Apple Docs**: [developer.apple.com](https://developer.apple.com)

## 🆘 Need Help?

1. Check the README.md troubleshooting section
2. Review IMPLEMENTATION_NOTES.md for technical details
3. Check Xcode console for error messages
4. Google the error message
5. Check Apple Developer Forums

---

**Ready to enhance some photos? Let's go! 🎉**

Open Xcode, run the app, and start creating amazing images!
