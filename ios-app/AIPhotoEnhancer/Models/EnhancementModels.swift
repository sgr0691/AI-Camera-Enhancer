//
//  EnhancementModels.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import Foundation
import UIKit

// MARK: - Enhancement Type
enum EnhancementType: String, CaseIterable, Identifiable {
    case night = "Night Scene"
    case hdr = "HDR"
    case clarity = "Clarity"
    case moonshot = "Moon Shot"
    case fireworks = "Fireworks"
    case landmark = "Landmark"
    case custom = "Custom"

    var id: String { rawValue }

    var defaultPrompt: String {
        switch self {
        case .night:
            return "Brighten this night scene while preserving the ambiance and reducing noise"
        case .hdr:
            return "Apply HDR effect to enhance colors and details"
        case .clarity:
            return "Increase clarity and sharpness of this image"
        case .moonshot:
            return "Enhance this moon photo to show more detail and reduce overexposure"
        case .fireworks:
            return "Make the colors of these fireworks more vibrant and clear"
        case .landmark:
            return "Enhance this landmark photo to look more professional and well-lit"
        case .custom:
            return ""
        }
    }
}

// MARK: - Enhancement Request
struct EnhancementRequest {
    let image: UIImage
    let prompt: String
    let type: EnhancementType
    let strength: Float

    init(image: UIImage, prompt: String, type: EnhancementType = .custom, strength: Float = 0.75) {
        self.image = image
        self.prompt = prompt
        self.type = type
        self.strength = strength
    }
}

// MARK: - Enhancement Result
struct EnhancementResult: Identifiable {
    let id: UUID
    let originalImage: UIImage
    let enhancedImage: UIImage
    let prompt: String
    let timestamp: Date
    let type: EnhancementType

    init(originalImage: UIImage, enhancedImage: UIImage, prompt: String, type: EnhancementType) {
        self.id = UUID()
        self.originalImage = originalImage
        self.enhancedImage = enhancedImage
        self.prompt = prompt
        self.timestamp = Date()
        self.type = type
    }
}

// MARK: - Enhancement State
enum EnhancementState: Equatable {
    case idle
    case loading
    case success(EnhancementResult)
    case error(String)

    static func == (lhs: EnhancementState, rhs: EnhancementState) -> Bool {
        switch (lhs, rhs) {
        case (.idle, .idle),
             (.loading, .loading):
            return true
        case let (.error(a), .error(b)):
            return a == b
        case let (.success(a), .success(b)):
            return a.id == b.id
        default:
            return false
        }
    }
}

// MARK: - Image Source
enum ImageSource {
    case camera
    case photoLibrary
}
