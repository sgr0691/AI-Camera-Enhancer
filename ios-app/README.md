# AI Photo Enhancer - iOS App

A native Swift iOS application that allows users to capture or upload photos, describe enhancements via text or voice, and apply AI-powered image enhancement.

## Features

### Core Features
- **Photo Input**
  - Capture photos using device camera
  - Select photos from photo library
  - Permission handling with user-friendly fallbacks

- **AI Enhancement**
  - Text-based prompt input
  - Voice dictation support using Speech Recognition
  - Preset prompts for common scenarios (Night, HDR, Clarity, Moon Shot, Fireworks, Landmark)
  - Loading states and error handling

- **Results & Comparison**
  - Before/After tab view
  - Interactive slider comparison view
  - Save to Photos library
  - Share via system share sheet
  - Enhancement history gallery

### Technical Stack
- **Language**: Swift
- **UI Framework**: SwiftUI
- **Architecture**: MVVM (Model-View-ViewModel)
- **iOS Version**: iOS 17.0+
- **Frameworks**:
  - PhotosUI (photo selection)
  - Photos (save to library)
  - Speech & AVFoundation (voice dictation)
  - UIKit interop (camera picker)

## Project Structure

```
AIPhotoEnhancer/
├── AIPhotoEnhancerApp.swift          # App entry point
├── Info.plist                         # Permissions and configuration
├── Models/
│   └── EnhancementModels.swift        # Data models
├── Services/
│   ├── SpeechRecognitionService.swift # Voice dictation
│   ├── EnhancementAPIService.swift    # AI API integration
│   └── ExportService.swift            # Save/Share functionality
├── ViewModels/
│   ├── EnhancementViewModel.swift     # Main enhancement logic
│   └── PromptViewModel.swift          # Prompt input logic
├── Views/
│   ├── ContentView.swift              # Main app view
│   ├── ImageInputView.swift           # Camera/Photo picker
│   ├── PromptComposerView.swift       # Text/Voice input
│   ├── EnhancementStateView.swift     # Loading/Error states
│   ├── ResultCompareView.swift        # Before/After comparison
│   └── GalleryView.swift              # Enhancement history
└── Utilities/
    └── Theme.swift                    # App theme and styling
```

## Setup Instructions

### Prerequisites
- macOS with Xcode 15.0 or later
- iOS device or simulator running iOS 17.0+
- Apple Developer account (for device testing)

### Opening the Project

1. Navigate to the project directory:
   ```bash
   cd ios-app
   ```

2. Open the project in Xcode:
   ```bash
   open AIPhotoEnhancer.xcodeproj
   ```

3. Configure signing:
   - Select the project in Xcode
   - Go to "Signing & Capabilities"
   - Select your development team
   - Ensure "Automatically manage signing" is checked

### Building and Running

1. Select your target device or simulator from the device dropdown
2. Press `Cmd + R` or click the "Run" button
3. The app will build and launch on your selected device

### Testing on Physical Device

To test camera and voice features, you must use a physical device:

1. Connect your iOS device via USB
2. Select your device from the device dropdown
3. Build and run (`Cmd + R`)
4. On first launch, grant permissions when prompted:
   - Camera access
   - Photo Library access
   - Microphone access
   - Speech Recognition access

## Permissions

The app requires the following permissions (configured in `Info.plist`):

- **NSCameraUsageDescription**: Access camera to capture photos
- **NSPhotoLibraryUsageDescription**: Access photo library to select images
- **NSPhotoLibraryAddUsageDescription**: Save enhanced images to photo library
- **NSSpeechRecognitionUsageDescription**: Voice dictation for prompts
- **NSMicrophoneUsageDescription**: Microphone access for voice input

## Configuration

### Backend API Setup

The app currently uses a placeholder enhancement service that applies basic filters. To integrate with your AI backend:

1. Open `Services/EnhancementAPIService.swift`
2. Replace the `baseURL` with your actual API endpoint
3. Uncomment and implement the API call logic in `enhanceImage(request:)`
4. Configure authentication headers if needed

Example API integration:
```swift
private let baseURL = "https://your-backend-api.com/api/enhance"

func enhanceImage(request: EnhancementRequest) async throws -> UIImage {
    // Your API implementation
    // 1. Convert image to data
    // 2. Create multipart form request
    // 3. Send to backend
    // 4. Parse response
    // 5. Return enhanced image
}
```

### Customizing Presets

To add or modify enhancement presets:

1. Open `Models/EnhancementModels.swift`
2. Add new cases to the `EnhancementType` enum
3. Update the `defaultPrompt` computed property

Example:
```swift
enum EnhancementType: String, CaseIterable {
    case portrait = "Portrait"
    case landscape = "Landscape"
    // Add your custom presets here

    var defaultPrompt: String {
        switch self {
        case .portrait:
            return "Enhance portrait with better skin tones and clarity"
        case .landscape:
            return "Enhance landscape colors and details"
        }
    }
}
```

## User Flow

1. **Launch App**: User sees main screen with photo input options
2. **Select Image**: User takes photo or selects from library
3. **Enter Prompt**: User types or dictates enhancement description
4. **Enhance**: App sends request to backend and shows loading state
5. **View Results**: User sees before/after comparison
6. **Save/Share**: User can save to Photos or share via system sheet

## Key Features Implementation

### Voice Dictation
- Uses iOS Speech Recognition framework
- Handles permission requests gracefully
- Real-time transcription during recording
- Fallback to text input if permission denied

### Image Comparison
- Two modes: Tab view and slider comparison
- Interactive slider allows precise comparison
- Labels show which side is original vs. enhanced

### Export Options
- **Save to Photos**: Saves to user's photo library
- **Share Sheet**: Uses native iOS share sheet for flexibility
- Proper error handling and user feedback

### Enhancement History
- Local in-memory storage of enhancements
- Gallery grid view
- Detail view for each enhancement
- Shows timestamp, prompt, and type

## Development Phases

The implementation followed these phases:

### Phase A - Foundation ✅
- Project structure and scaffolding
- Info.plist permissions
- Theme and styling system

### Phase B - Models & Services ✅
- Data models
- API service (placeholder)
- Speech recognition service
- Export service

### Phase C - ViewModels ✅
- Enhancement logic
- Prompt handling
- State management

### Phase D - Views ✅
- Main app structure
- Image input (camera + picker)
- Prompt composer (text + voice)
- Enhancement states
- Results comparison
- Gallery

### Phase E - Integration ✅
- Connect ViewModels to Views
- Handle navigation
- Error states and user feedback

## Next Steps / Future Enhancements

### Backend Integration
- [ ] Implement actual API endpoint in `EnhancementAPIService`
- [ ] Add authentication and API key management
- [ ] Handle rate limiting and retries

### Features
- [ ] Persistent storage (Core Data or SwiftData)
- [ ] Image editing before enhancement
- [ ] Batch processing multiple images
- [ ] Custom enhancement strength slider
- [ ] Before/after video export
- [ ] iCloud sync for enhancement history

### Polish
- [ ] Onboarding flow
- [ ] App Store screenshots and metadata
- [ ] Localization for multiple languages
- [ ] Accessibility improvements (VoiceOver labels)
- [ ] Dark mode refinements
- [ ] iPad-specific layout optimizations

### Testing
- [ ] Unit tests for services
- [ ] UI tests for main flows
- [ ] Performance testing with large images
- [ ] TestFlight beta distribution

## Troubleshooting

### Camera not working
- Ensure you're testing on a physical device (simulators don't have cameras)
- Check that camera permission is granted in Settings > Privacy > Camera

### Voice dictation not working
- Grant microphone and speech recognition permissions
- Check internet connection (speech recognition requires network)
- Ensure language is supported (currently set to en-US)

### Image save failing
- Grant photo library access permission
- Check available storage space
- Ensure image data is valid

### Build errors
- Clean build folder: `Cmd + Shift + K`
- Reset package caches: `File > Packages > Reset Package Caches`
- Update Xcode to latest version
- Ensure iOS deployment target is set to 17.0+

## Architecture Decisions

### MVVM Pattern
- Separates business logic from UI
- Makes code testable and maintainable
- ViewModels handle all state and logic
- Views are purely presentational

### SwiftUI + Combine
- Reactive data binding with `@Published`
- Declarative UI reduces bugs
- Built-in animation and state management

### Service Layer
- Encapsulates external dependencies
- Makes testing easier with mocks
- Centralized error handling

### Theme System
- Consistent styling across app
- Easy to update colors and spacing
- Reusable view modifiers

## Performance Considerations

- Images are loaded and processed on background threads
- API calls use Swift concurrency (async/await)
- UI updates always on main thread (@MainActor)
- Large images are handled efficiently with UIImage

## Privacy & Security

- All permissions requested with clear descriptions
- Images never stored without user action
- API calls should use HTTPS
- No analytics or tracking (add if needed)

## License

This project is part of the AI Camera Enhancer application.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the inline code documentation
3. Check Xcode build logs for specific errors
4. Test on a physical device if simulator doesn't work

---

Built with ❤️ using Swift and SwiftUI
