//
//  ImageInputView.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import SwiftUI
import PhotosUI

struct ImageInputView: View {
    @Binding var selectedImage: UIImage?
    var onImageSelected: (UIImage) -> Void

    @State private var showingImagePicker = false
    @State private var showingCamera = false
    @State private var sourceType: ImageSource = .photoLibrary

    var body: some View {
        VStack(spacing: Theme.Spacing.md) {
            if let image = selectedImage {
                // Show selected image
                ZStack(alignment: .topTrailing) {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 300)
                        .cornerRadius(Theme.CornerRadius.md)
                        .shadow(color: Color.black.opacity(0.2), radius: 8, x: 0, y: 4)

                    // Replace button
                    Button {
                        showingImagePicker = true
                    } label: {
                        Image(systemName: "arrow.triangle.2.circlepath.circle.fill")
                            .font(.title2)
                            .foregroundColor(.white)
                            .background(
                                Circle()
                                    .fill(Theme.Colors.primary)
                                    .frame(width: 36, height: 36)
                            )
                    }
                    .padding(Theme.Spacing.sm)
                }
            } else {
                // Show image selection options
                VStack(spacing: Theme.Spacing.md) {
                    // Camera button
                    Button {
                        sourceType = .camera
                        showingCamera = true
                    } label: {
                        VStack(spacing: Theme.Spacing.sm) {
                            ZStack {
                                Circle()
                                    .fill(Theme.Colors.gradientPrimary)
                                    .frame(width: 80, height: 80)

                                Image(systemName: "camera.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(.white)
                            }

                            Text("Take Photo")
                                .font(Theme.Typography.headline)
                                .foregroundColor(Theme.Colors.primary)
                        }
                    }

                    Text("or")
                        .font(Theme.Typography.caption)
                        .foregroundColor(.secondary)

                    // Photo library button
                    Button {
                        sourceType = .photoLibrary
                        showingImagePicker = true
                    } label: {
                        HStack {
                            Image(systemName: "photo.on.rectangle")
                                .font(.title3)
                            Text("Choose from Library")
                                .font(Theme.Typography.headline)
                        }
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Theme.Colors.gradientPrimary)
                        .cornerRadius(Theme.CornerRadius.md)
                    }
                }
                .padding(Theme.Spacing.xl)
                .frame(maxWidth: .infinity)
                .background(Color(.systemBackground))
                .cornerRadius(Theme.CornerRadius.md)
                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
            }
        }
        .sheet(isPresented: $showingImagePicker) {
            ImagePicker(selectedImage: $selectedImage, sourceType: .photoLibrary) { image in
                onImageSelected(image)
            }
        }
        .fullScreenCover(isPresented: $showingCamera) {
            ImagePicker(selectedImage: $selectedImage, sourceType: .camera) { image in
                onImageSelected(image)
            }
        }
    }
}

// MARK: - Image Picker
struct ImagePicker: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    @Environment(\.dismiss) var dismiss
    let sourceType: UIImagePickerController.SourceType
    let onImageSelected: (UIImage) -> Void

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.selectedImage = image
                parent.onImageSelected(image)
            }
            parent.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}

#Preview {
    ImageInputView(
        selectedImage: .constant(nil),
        onImageSelected: { _ in }
    )
}
