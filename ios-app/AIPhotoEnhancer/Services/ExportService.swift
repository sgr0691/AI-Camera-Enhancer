//
//  ExportService.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import Foundation
import UIKit
import Photos

class ExportService {
    static let shared = ExportService()

    private init() {}

    // MARK: - Save to Photos Library
    func saveToPhotos(image: UIImage) async throws {
        let status = PHPhotoLibrary.authorizationStatus(for: .addOnly)

        switch status {
        case .notDetermined:
            let newStatus = await PHPhotoLibrary.requestAuthorization(for: .addOnly)
            if newStatus != .authorized {
                throw ExportError.photoLibraryAccessDenied
            }
        case .denied, .restricted:
            throw ExportError.photoLibraryAccessDenied
        case .authorized, .limited:
            break
        @unknown default:
            break
        }

        try await PHPhotoLibrary.shared().performChanges {
            PHAssetChangeRequest.creationRequestForAsset(from: image)
        }
    }

    // MARK: - Create Shareable Item
    func createShareItem(image: UIImage) -> [Any] {
        return [image]
    }

    // MARK: - Get Image Data for Download
    func getImageData(image: UIImage, format: ImageFormat = .jpeg, quality: CGFloat = 0.9) -> Data? {
        switch format {
        case .jpeg:
            return image.jpegData(compressionQuality: quality)
        case .png:
            return image.pngData()
        }
    }

    // MARK: - Generate Filename
    func generateFilename(prefix: String = "ai-enhanced", format: ImageFormat = .jpeg) -> String {
        let timestamp = Int(Date().timeIntervalSince1970)
        let ext = format == .jpeg ? "jpg" : "png"
        return "\(prefix)-\(timestamp).\(ext)"
    }
}

// MARK: - Image Format
enum ImageFormat {
    case jpeg
    case png
}

// MARK: - Export Errors
enum ExportError: LocalizedError {
    case photoLibraryAccessDenied
    case saveFailed
    case invalidImageData

    var errorDescription: String? {
        switch self {
        case .photoLibraryAccessDenied:
            return "Photo library access denied. Please enable in Settings."
        case .saveFailed:
            return "Failed to save image"
        case .invalidImageData:
            return "Invalid image data"
        }
    }
}
