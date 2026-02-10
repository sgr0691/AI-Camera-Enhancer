//
//  ResultCompareView.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import SwiftUI
import UIKit

struct ResultCompareView: View {
    let result: EnhancementResult

    @State private var showComparison = false
    @State private var sliderPosition: CGFloat = 0.5
    @State private var showShareSheet = false
    @State private var showSaveConfirmation = false
    @State private var saveError: String?
    @State private var showSaveErrorAlert = false

    private let exportService = ExportService.shared

    var body: some View {
        VStack(spacing: Theme.Spacing.md) {
            // Header with comparison toggle
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Enhanced Result")
                        .font(Theme.Typography.headline)
                        .foregroundColor(.primary)

                    Text(result.prompt)
                        .font(Theme.Typography.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }

                Spacer()

                Button {
                    withAnimation {
                        showComparison.toggle()
                    }
                } label: {
                    Text(showComparison ? "Hide" : "Compare")
                        .font(Theme.Typography.caption)
                        .foregroundColor(Theme.Colors.primary)
                        .padding(.horizontal, Theme.Spacing.md)
                        .padding(.vertical, Theme.Spacing.sm)
                        .background(Theme.Colors.primary.opacity(0.1))
                        .cornerRadius(Theme.CornerRadius.round)
                }
            }

            // Image display
            if showComparison {
                comparisonView
            } else {
                tabView
            }

            // Action buttons
            HStack(spacing: Theme.Spacing.md) {
                Button {
                    showShareSheet = true
                } label: {
                    HStack {
                        Image(systemName: "square.and.arrow.up")
                        Text("Share")
                    }
                    .font(Theme.Typography.callout)
                    .foregroundColor(Theme.Colors.primary)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(Theme.CornerRadius.md)
                }

                Button {
                    saveToPhotos()
                } label: {
                    HStack {
                        Image(systemName: "arrow.down.circle.fill")
                        Text("Save")
                    }
                    .font(Theme.Typography.callout)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Theme.Colors.gradientPrimary)
                    .cornerRadius(Theme.CornerRadius.md)
                }
            }
        }
        .padding(Theme.Spacing.md)
        .background(Color(.systemBackground))
        .cornerRadius(Theme.CornerRadius.md)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
        .sheet(isPresented: $showShareSheet) {
            ShareSheet(items: exportService.createShareItem(image: result.enhancedImage))
        }
        .alert("Saved Successfully", isPresented: $showSaveConfirmation) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Your enhanced image has been saved to Photos")
        }
        .alert("Save Failed", isPresented: $showSaveErrorAlert) {
            Button("OK", role: .cancel) {
                saveError = nil
                showSaveErrorAlert = false
            }
        } message: {
            Text(saveError ?? "Unknown error")
        }
    }

    // MARK: - Tab View
    private var tabView: some View {
        TabView {
            imageView(image: result.originalImage, label: "Original")
                .tag(0)

            imageView(image: result.enhancedImage, label: "Enhanced")
                .tag(1)
        }
        .tabViewStyle(.page(indexDisplayMode: .always))
        .frame(height: 400)
        .cornerRadius(Theme.CornerRadius.md)
    }

    private func imageView(image: UIImage, label: String) -> some View {
        ZStack(alignment: .topLeading) {
            Image(uiImage: image)
                .resizable()
                .scaledToFit()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.black)

            Text(label)
                .font(Theme.Typography.caption)
                .foregroundColor(.white)
                .padding(.horizontal, Theme.Spacing.sm)
                .padding(.vertical, 4)
                .background(Color.black.opacity(0.6))
                .cornerRadius(Theme.CornerRadius.sm)
                .padding(Theme.Spacing.sm)
        }
    }

    // MARK: - Comparison View
    private var comparisonView: some View {
        GeometryReader { geometry in
            ZStack {
                // Original image (background)
                Image(uiImage: result.originalImage)
                    .resizable()
                    .scaledToFit()
                    .frame(width: geometry.size.width, height: geometry.size.height)

                // Enhanced image (clipped by slider)
                Image(uiImage: result.enhancedImage)
                    .resizable()
                    .scaledToFit()
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .mask(
                        Rectangle()
                            .frame(width: geometry.size.width * sliderPosition)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    )

                // Slider line
                Rectangle()
                    .fill(Color.white)
                    .frame(width: 2)
                    .shadow(color: .black.opacity(0.3), radius: 2)
                    .position(x: geometry.size.width * sliderPosition, y: geometry.size.height / 2)

                // Labels
                VStack {
                    HStack {
                        Text("Original")
                            .font(Theme.Typography.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, Theme.Spacing.sm)
                            .padding(.vertical, 4)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(Theme.CornerRadius.sm)
                            .padding(Theme.Spacing.sm)

                        Spacer()

                        Text("Enhanced")
                            .font(Theme.Typography.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, Theme.Spacing.sm)
                            .padding(.vertical, 4)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(Theme.CornerRadius.sm)
                            .padding(Theme.Spacing.sm)
                    }
                    Spacer()
                }
            }
            .background(Color.black)
            .cornerRadius(Theme.CornerRadius.md)
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        sliderPosition = min(max(value.location.x / geometry.size.width, 0), 1)
                    }
            )
        }
        .frame(height: 400)
    }

    // MARK: - Save to Photos
    private func saveToPhotos() {
        Task {
            do {
                try await exportService.saveToPhotos(image: result.enhancedImage)
                showSaveConfirmation = true
            } catch {
                saveError = error.localizedDescription
                showSaveErrorAlert = true
            }
        }
    }
}

// MARK: - Share Sheet
struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    ResultCompareView(
        result: EnhancementResult(
            originalImage: UIImage(systemName: "photo")!,
            enhancedImage: UIImage(systemName: "photo.fill")!,
            prompt: "Enhance this night photo to show more detail",
            type: .night
        )
    )
    .padding()
}
