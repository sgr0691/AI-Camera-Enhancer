# iOS Implementation Notes

## Mapping from Web App to iOS

This document shows how each component from the Next.js web app was translated to native iOS.

### Component Mapping

| Web Component | iOS Component | Notes |
|--------------|---------------|-------|
| `camera-capture.tsx` | `ImageInputView.swift` | Uses UIImagePickerController for camera & photo library |
| `enhance-controls.tsx` | `PromptComposerView.swift` | Added voice input with Speech framework |
| `enhanced-image.tsx` | `ResultCompareView.swift` | Native slider comparison using GeometryReader |
| `image-gallery.tsx` | `GalleryView.swift` | LazyVGrid for performance |
| `lib/ai-enhancement.ts` | `EnhancementAPIService.swift` | Async/await with URLSession |

### Key Differences from Web App

#### 1. Camera & Photo Access
**Web**: Uses `getUserMedia()` for camera and `<input type="file">` for uploads
**iOS**: Uses native `UIImagePickerController` and `PhotosUI` framework
- Better permission handling
- Native iOS camera interface
- Direct photo library integration

#### 2. Voice Input
**Web**: Would require Web Speech API (limited browser support)
**iOS**: Uses native `Speech` and `AVFoundation` frameworks
- Better accuracy
- Offline capability after initial download
- More reliable permission handling

#### 3. Image Processing
**Web**: Canvas API for image manipulation
**iOS**: `UIImage` and `CIImage` for native processing
- Hardware acceleration
- Better memory management
- More efficient for large images

#### 4. State Management
**Web**: React hooks (`useState`, `useEffect`)
**iOS**: SwiftUI property wrappers (`@State`, `@Published`)
- Similar reactive patterns
- `ObservableObject` for ViewModels
- `Combine` framework for data flow

#### 5. Navigation
**Web**: Next.js routing with pages
**iOS**: SwiftUI `NavigationView` and sheets
- Native iOS navigation patterns
- Modal presentations
- Tab-based navigation for gallery

### Architecture Comparison

#### Web App (React/Next.js)
```
app/
  page.tsx (main page)
components/
  camera-capture.tsx
  enhance-controls.tsx
  enhanced-image.tsx
lib/
  ai-enhancement.ts
```

#### iOS App (SwiftUI/MVVM)
```
Models/
  EnhancementModels.swift
Services/
  SpeechRecognitionService.swift
  EnhancementAPIService.swift
  ExportService.swift
ViewModels/
  EnhancementViewModel.swift
  PromptViewModel.swift
Views/
  ContentView.swift
  ImageInputView.swift
  PromptComposerView.swift
  ResultCompareView.swift
Utilities/
  Theme.swift
```

### iOS-Specific Features Added

1. **Voice Dictation**
   - Real-time speech-to-text
   - Permission handling
   - Recording indicator
   - Fallback to text input

2. **Native Photo Library Integration**
   - Save directly to Photos
   - Photo library permissions
   - Photo metadata preservation

3. **System Share Sheet**
   - Share to any iOS app
   - AirDrop support
   - Save to Files app

4. **Enhancement History**
   - In-memory storage
   - Gallery view
   - Detail view for each enhancement

5. **Before/After Comparison**
   - Interactive slider
   - Drag gesture handling
   - Smooth animations

6. **Permission Management**
   - Camera
   - Photo library (read/write)
   - Microphone
   - Speech recognition

### API Integration Notes

The web app has placeholder enhancement logic that returns the original image. The iOS app follows the same pattern but is structured for easy integration:

#### Current Implementation (Placeholder)
```swift
func enhanceImage(request: EnhancementRequest) async throws -> UIImage {
    // Simulate API delay
    try await Task.sleep(nanoseconds: 2_000_000_000)

    // Return simulated enhancement
    return simulateEnhancement(image: request.image)
}
```

#### Production Implementation (TODO)
```swift
func enhanceImage(request: EnhancementRequest) async throws -> UIImage {
    // 1. Convert UIImage to Data
    guard let imageData = request.image.jpegData(compressionQuality: 0.8) else {
        throw EnhancementError.imageConversionFailed
    }

    // 2. Create multipart form request
    var urlRequest = URLRequest(url: URL(string: baseURL)!)
    urlRequest.httpMethod = "POST"
    urlRequest.setValue("multipart/form-data", forHTTPHeaderField: "Content-Type")

    // 3. Build request body
    // 4. Make API call
    let (data, response) = try await URLSession.shared.data(for: urlRequest)

    // 5. Parse response
    guard let enhancedImage = UIImage(data: data) else {
        throw EnhancementError.invalidResponse
    }

    return enhancedImage
}
```

### Testing Recommendations

#### Unit Tests
- Service layer (API, Speech, Export)
- ViewModel logic
- Model transformations

#### UI Tests
- Main flow: capture → prompt → enhance → save
- Permission handling flows
- Error state handling
- Gallery navigation

#### Manual Testing Checklist
- [ ] Camera capture on real device
- [ ] Photo library selection
- [ ] Voice dictation (microphone permission)
- [ ] Text prompt input
- [ ] Preset selection
- [ ] Enhancement loading state
- [ ] Before/after comparison slider
- [ ] Tab view navigation
- [ ] Save to Photos
- [ ] Share sheet
- [ ] Gallery view
- [ ] Permission denial handling
- [ ] Error states
- [ ] Dark mode
- [ ] Different device sizes (iPhone SE, Pro Max, iPad)

### Performance Optimizations

1. **Image Handling**
   - Images loaded asynchronously
   - Proper memory management
   - Thumbnail generation for gallery

2. **UI Rendering**
   - LazyVGrid for gallery (loads on demand)
   - Efficient SwiftUI view updates
   - Proper use of @Published for minimal updates

3. **API Calls**
   - Async/await for non-blocking calls
   - Proper error handling
   - Timeout configuration

### Accessibility Considerations

To be implemented:
- VoiceOver labels for all interactive elements
- Dynamic Type support
- High contrast mode
- Reduce Motion support
- Screen reader announcements for state changes

### Localization

Currently English only. To add localization:
1. Add `Localizable.strings` files
2. Use `NSLocalizedString` for text
3. Test with different languages
4. Handle RTL languages (Arabic, Hebrew)

### Known Limitations

1. **Backend Integration**: Currently using placeholder enhancement
2. **Persistence**: Enhancement history is in-memory only
3. **Image Size**: No validation or compression before upload
4. **Rate Limiting**: No handling for API rate limits
5. **Offline Mode**: No offline functionality
6. **Error Recovery**: Basic error handling only

### Future Enhancement Ideas

1. **Advanced Features**
   - Brush tool for selective enhancement
   - Multiple enhancement passes
   - Undo/redo functionality
   - Export as video (showing transformation)

2. **Cloud Integration**
   - iCloud sync for history
   - CloudKit for user accounts
   - Server-side processing queue

3. **Social Features**
   - Share enhancements with community
   - Preset marketplace
   - Challenge/contest mode

4. **Monetization**
   - In-app purchases for advanced features
   - Subscription for unlimited enhancements
   - Ad-supported free tier

5. **Professional Features**
   - Batch processing
   - Export presets
   - Custom training data
   - API access for automation

### Code Quality Metrics

- Total Lines of Code: ~2,000
- Number of Files: 15
- Average File Size: ~150 lines
- Comments: Inline documentation throughout
- Architecture: Clean MVVM separation
- Dependencies: Zero external dependencies (only Apple frameworks)

### Build Configuration

#### Debug
- Optimization: None
- Assertions: Enabled
- Logging: Verbose

#### Release
- Optimization: Full
- Assertions: Disabled
- Logging: Errors only
- Bitcode: No (deprecated)
- App Thinning: Enabled

### Version History

#### v1.0.0 (Current - MVP)
- Camera and photo library input
- Text and voice prompt input
- AI enhancement (placeholder)
- Before/after comparison
- Save and share functionality
- Enhancement gallery

#### v1.1.0 (Planned)
- Backend API integration
- Persistent storage
- Push notifications for completed enhancements
- Settings screen

#### v2.0.0 (Future)
- Advanced editing tools
- Custom filters
- Social features
- Professional tier

---

## Getting Help

### Resources
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)
- [Speech Framework](https://developer.apple.com/documentation/speech/)
- [Photos Framework](https://developer.apple.com/documentation/photokit/)

### Common Issues & Solutions

**Issue**: "Module not found"
**Solution**: Clean build folder and rebuild

**Issue**: Permission denied errors
**Solution**: Check Info.plist has correct usage descriptions

**Issue**: Voice not working in simulator
**Solution**: Test on physical device

**Issue**: Images not saving
**Solution**: Grant photo library write permission

---

Last Updated: 2026-02-09
