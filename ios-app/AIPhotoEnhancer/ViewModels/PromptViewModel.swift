//
//  PromptViewModel.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import Foundation
import Combine
import Speech

@MainActor
class PromptViewModel: ObservableObject {
    @Published var promptText: String = ""
    @Published var selectedPreset: EnhancementType = .custom
    @Published var isRecording: Bool = false

    private let speechService = SpeechRecognitionService()
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupBindings()
    }

    private func setupBindings() {
        // Sync recording state
        speechService.$isRecording
            .assign(to: &$isRecording)

        // Sync transcribed text
        speechService.$transcribedText
            .sink { [weak self] text in
                if !text.isEmpty {
                    self?.promptText = text
                }
            }
            .store(in: &cancellables)

        // Update prompt when preset changes
        $selectedPreset
            .sink { [weak self] preset in
                if preset != .custom {
                    self?.promptText = preset.defaultPrompt
                }
            }
            .store(in: &cancellables)
    }

    // MARK: - Voice Input
    func startVoiceInput() {
        speechService.startRecording()
    }

    func stopVoiceInput() {
        speechService.stopRecording()
    }

    func toggleVoiceInput() {
        if isRecording {
            stopVoiceInput()
        } else {
            startVoiceInput()
        }
    }

    func requestSpeechAuthorization() {
        speechService.requestAuthorization()
    }

    var speechAuthorizationStatus: SFSpeechRecognizerAuthorizationStatus {
        speechService.authorizationStatus
    }

    // MARK: - Preset Selection
    func selectPreset(_ preset: EnhancementType) {
        selectedPreset = preset
        if preset != .custom {
            promptText = preset.defaultPrompt
        }
    }

    // MARK: - Reset
    func reset() {
        promptText = ""
        selectedPreset = .custom
        if isRecording {
            stopVoiceInput()
        }
        speechService.reset()
    }
}
