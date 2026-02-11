//
//  ContentView.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var enhancementViewModel = EnhancementViewModel()
    @StateObject private var promptViewModel = PromptViewModel()
    @State private var showGallery = false

    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                Theme.Colors.gradientBackground
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: Theme.Spacing.lg) {
                        // Header
                        headerView

                        // Image Input Section
                        ImageInputView(
                            selectedImage: $enhancementViewModel.selectedImage,
                            onImageSelected: { image in
                                enhancementViewModel.selectImage(image)
                            }
                        )
                        .padding(.horizontal, Theme.Spacing.md)

                        // Prompt Composer (only show if image is selected)
                        if enhancementViewModel.selectedImage != nil {
                            PromptComposerView(
                                viewModel: promptViewModel,
                                onEnhance: {
                                    enhancementViewModel.currentPrompt = promptViewModel.promptText
                                    enhancementViewModel.selectedPreset = promptViewModel.selectedPreset
                                    enhancementViewModel.enhanceImage()
                                }
                            )
                            .padding(.horizontal, Theme.Spacing.md)
                        }

                        // Enhancement State View
                        EnhancementStateView(
                            state: enhancementViewModel.enhancementState,
                            isLoading: enhancementViewModel.isLoading,
                            errorMessage: enhancementViewModel.errorMessage
                        )
                        .padding(.horizontal, Theme.Spacing.md)

                        // Result View (when enhancement is successful)
                        if case .success(let result) = enhancementViewModel.enhancementState {
                            ResultCompareView(result: result)
                                .padding(.horizontal, Theme.Spacing.md)
                        }
                    }
                    .padding(.vertical, Theme.Spacing.md)
                }
            }
            .navigationTitle("AI Photo Enhancer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showGallery.toggle()
                    } label: {
                        Image(systemName: "photo.stack")
                            .foregroundColor(Theme.Colors.primary)
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        enhancementViewModel.reset()
                        promptViewModel.reset()
                    } label: {
                        Image(systemName: "arrow.clockwise")
                            .foregroundColor(Theme.Colors.primary)
                    }
                }
            }
            .sheet(isPresented: $showGallery) {
                GalleryView(history: enhancementViewModel.enhancementHistory)
            }
        }
    }

    private var headerView: some View {
        VStack(spacing: Theme.Spacing.sm) {
            HStack {
                Image(systemName: "wand.and.stars")
                    .font(.title)
                    .foregroundColor(Theme.Colors.primary)
                Text("Enhance Your Photos")
                    .font(Theme.Typography.title2)
                    .foregroundColor(.primary)
            }

            Text("Capture or upload a photo, describe the enhancement you want, and let AI do the magic!")
                .font(Theme.Typography.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, Theme.Spacing.xl)
        }
        .padding(.top, Theme.Spacing.md)
    }
}

#Preview {
    ContentView()
}
