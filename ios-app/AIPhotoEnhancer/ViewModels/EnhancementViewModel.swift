//
//  EnhancementViewModel.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import Foundation
import UIKit
import Combine

@MainActor
class EnhancementViewModel: ObservableObject {
    @Published var selectedImage: UIImage?
    @Published var enhancementState: EnhancementState = .idle
    @Published var enhancementHistory: [EnhancementResult] = []
    @Published var currentPrompt: String = ""
    @Published var selectedPreset: EnhancementType = .custom
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?

    private let apiService = EnhancementAPIService.shared
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupBindings()
    }

    private func setupBindings() {
        $selectedPreset
            .sink { [weak self] preset in
                if preset != .custom {
                    self?.currentPrompt = preset.defaultPrompt
                }
            }
            .store(in: &cancellables)
    }

    // MARK: - Image Selection
    func selectImage(_ image: UIImage) {
        self.selectedImage = image
        self.enhancementState = .idle
        self.errorMessage = nil
    }

    // MARK: - Enhancement
    func enhanceImage(prompt: String? = nil) {
        guard let image = selectedImage else {
            errorMessage = "No image selected"
            return
        }

        let promptToUse = prompt ?? currentPrompt
        guard !promptToUse.isEmpty else {
            errorMessage = "Please enter a prompt or select a preset"
            return
        }

        isLoading = true
        enhancementState = .loading
        errorMessage = nil

        let request = EnhancementRequest(
            image: image,
            prompt: promptToUse,
            type: selectedPreset,
            strength: 0.75
        )

        Task {
            do {
                let enhancedImage = try await apiService.enhanceImage(request: request)

                let result = EnhancementResult(
                    originalImage: image,
                    enhancedImage: enhancedImage,
                    prompt: promptToUse,
                    type: selectedPreset
                )

                self.isLoading = false
                self.enhancementState = .success(result)
                self.enhancementHistory.insert(result, at: 0)

            } catch {
                self.isLoading = false
                self.errorMessage = error.localizedDescription
                self.enhancementState = .error(error.localizedDescription)
            }
        }
    }

    // MARK: - Reset
    func reset() {
        selectedImage = nil
        currentPrompt = ""
        selectedPreset = .custom
        enhancementState = .idle
        errorMessage = nil
        isLoading = false
    }

    // MARK: - Clear History
    func clearHistory() {
        enhancementHistory.removeAll()
    }
}
