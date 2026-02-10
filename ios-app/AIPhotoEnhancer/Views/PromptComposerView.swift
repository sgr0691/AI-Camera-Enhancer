//
//  PromptComposerView.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import Speech
import SwiftUI
import UIKit

struct PromptComposerView: View {
    @ObservedObject var viewModel: PromptViewModel
    var onEnhance: () -> Void

    @State private var showSpeechPermissionAlert = false

    var body: some View {
        VStack(spacing: Theme.Spacing.md) {
            // Preset selector
            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                Text("Quick Presets")
                    .font(Theme.Typography.footnote)
                    .foregroundColor(.secondary)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Theme.Spacing.sm) {
                        ForEach(EnhancementType.allCases) { preset in
                            PresetChip(
                                preset: preset,
                                isSelected: viewModel.selectedPreset == preset,
                                onTap: {
                                    viewModel.selectPreset(preset)
                                }
                            )
                        }
                    }
                }
            }

            // Prompt input area
            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                Text("Describe Enhancement")
                    .font(Theme.Typography.footnote)
                    .foregroundColor(.secondary)

                ZStack(alignment: .topTrailing) {
                    TextEditor(text: $viewModel.promptText)
                        .frame(height: 100)
                        .padding(Theme.Spacing.sm)
                        .background(Color(.systemBackground))
                        .cornerRadius(Theme.CornerRadius.sm)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.sm)
                                .stroke(Theme.Colors.primary.opacity(0.3), lineWidth: 1)
                        )

                    // Microphone button
                    Button {
                        handleMicrophoneTap()
                    } label: {
                        ZStack {
                            Circle()
                                .fill(viewModel.isRecording ? Theme.Colors.error : Theme.Colors.primary)
                                .frame(width: 44, height: 44)

                            Image(systemName: viewModel.isRecording ? "stop.circle.fill" : "mic.fill")
                                .foregroundColor(.white)
                                .font(.system(size: 20))
                        }
                    }
                    .padding(Theme.Spacing.sm)
                }

                if viewModel.isRecording {
                    HStack {
                        Circle()
                            .fill(Theme.Colors.error)
                            .frame(width: 8, height: 8)
                        Text("Recording...")
                            .font(Theme.Typography.caption)
                            .foregroundColor(Theme.Colors.error)
                    }
                }
            }

            // Enhance button
            Button {
                onEnhance()
            } label: {
                HStack {
                    Image(systemName: "wand.and.stars")
                    Text("Enhance Image")
                }
                .font(Theme.Typography.headline)
                .foregroundColor(.white)
                .padding()
                .frame(maxWidth: .infinity)
                .background(
                    viewModel.promptText.isEmpty ?
                    Color.gray : Theme.Colors.gradientPrimary
                )
                .cornerRadius(Theme.CornerRadius.md)
            }
            .disabled(viewModel.promptText.isEmpty)

            // Tips section
            VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                Text("Tips for better results:")
                    .font(Theme.Typography.caption)
                    .foregroundColor(Theme.Colors.primary)
                    .fontWeight(.semibold)

                VStack(alignment: .leading, spacing: 4) {
                    tipRow("Be specific about what you want to enhance")
                    tipRow("Mention problem areas (too dark, blurry, etc.)")
                    tipRow("Describe the desired outcome")
                }
            }
            .padding(Theme.Spacing.sm)
            .background(Theme.Colors.primary.opacity(0.1))
            .cornerRadius(Theme.CornerRadius.sm)
        }
        .padding(Theme.Spacing.md)
        .background(Color(.systemBackground))
        .cornerRadius(Theme.CornerRadius.md)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
        .alert("Speech Recognition Permission", isPresented: $showSpeechPermissionAlert) {
            Button("Open Settings") {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Speech recognition requires permission. Please enable it in Settings.")
        }
    }

    private func tipRow(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 4) {
            Text("•")
            Text(text)
        }
        .font(Theme.Typography.caption)
        .foregroundColor(.secondary)
    }

    private func handleMicrophoneTap() {
        let status = viewModel.speechAuthorizationStatus

        switch status {
        case .notDetermined:
            viewModel.requestSpeechAuthorization()
        case .authorized:
            viewModel.toggleVoiceInput()
        case .denied, .restricted:
            showSpeechPermissionAlert = true
        @unknown default:
            break
        }
    }
}

// MARK: - Preset Chip
struct PresetChip: View {
    let preset: EnhancementType
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            Text(preset.rawValue)
                .font(Theme.Typography.footnote)
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? .white : Theme.Colors.primary)
                .padding(.horizontal, Theme.Spacing.md)
                .padding(.vertical, Theme.Spacing.sm)
                .background(
                    isSelected ?
                    Theme.Colors.gradientPrimary :
                    LinearGradient(
                        gradient: Gradient(colors: [Theme.Colors.primary.opacity(0.1)]),
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(Theme.CornerRadius.round)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.round)
                        .stroke(Theme.Colors.primary.opacity(isSelected ? 0 : 0.3), lineWidth: 1)
                )
        }
    }
}

#Preview {
    PromptComposerView(
        viewModel: PromptViewModel(),
        onEnhance: {}
    )
    .padding()
}
