# AI-Camera-Enhancer

An AI-powered camera application that enhances photos in real-time. Perfect for improving challenging shots like night photography, full moon captures, fireworks, and poorly lit scenes.

## Features

📸 Real-time camera access - Capture photos directly or upload existing images
🤖 AI-powered enhancements - Improve photos with specialized AI models
🌙 Scene-specific presets - Optimized for challenging scenarios like night shots and full moon photography
🖌️ Localized adjustments - Brush tool for targeted enhancements to specific areas
🔄 Before/after comparison - Interactive slider to compare original and enhanced images
📱 Responsive design - Works on desktop and mobile devices
🌐 Web-based - No installation required, runs in the browser

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
gh repo clone sgr0691/AI-Camera-Enhancer
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm run dev
```

4. Access the application:
```bash
http://localhost:3000
```

## 🔧 Usage

### Capturing Photos

1. Grant camera permissions when prompted
2. Use the camera interface to capture a photo
3. Alternatively, upload an existing image using the upload button


### Enhancing Images

1. After capturing or uploading an image, you'll be taken to the enhancement screen
2. Choose a preset or write a custom prompt describing the desired enhancement
3. Click "Enhance Image" to generate AI-enhanced versions
4. Use the comparison slider to see the before/after results


### Using the Brush Tool

1. Select the "Brush Tool" tab in the enhancement controls
2. Choose a brush type (brighten, contrast, sharpen, or blur)
3. Adjust the brush size using the slider
4. Paint over specific areas of the image that need enhancement
5. Click "Apply" to process the localized adjustments


### Saving and Sharing

1. Select your preferred enhanced version
2. Click the "Save" button to download to your device
3. Use the "Share" button to share directly to social media or messaging apps

## 🛠️ Technologies Used

- **Next.js** - React framework for the frontend
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **AI SDK** - For connecting to AI image enhancement models
- **Web APIs** - Camera access and file handling

## 🧠 AI Enhancement Models

The application is designed to work with various AI image enhancement models. By default, it's set up to integrate with:

- **Fal AI** - For real-time image enhancements
- **Together AI** - For specialized photo improvements


You can extend the application to work with other AI providers by modifying the `lib/ai-enhancement.ts` file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


Please make sure to update tests as appropriate and adhere to the existing coding style.

### Development Guidelines

- Follow the existing code style and organization
- Write meaningful commit messages
- Add appropriate documentation for new features
- Test your changes thoroughly before submitting a PR

## License

MIT License

## 🛠️ Tools Used

- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Fal AI](https://fal.ai/) for the AI image enhancement capabilities
- [Vercel](https://vercel.com/) for hosting and deployment