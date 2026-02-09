//
//  EnhancementStateView.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import SwiftUI

struct EnhancementStateView: View {
    let state: EnhancementState
    let isLoading: Bool
    let errorMessage: String?

    var body: some View {
        Group {
            switch state {
            case .idle:
                EmptyView()

            case .loading:
                loadingView

            case .success:
                EmptyView()

            case .error:
                if let error = errorMessage {
                    errorView(message: error)
                }
            }
        }
    }

    private var loadingView: some View {
        VStack(spacing: Theme.Spacing.md) {
            ProgressView()
                .scaleEffect(1.5)
                .progressViewStyle(CircularProgressViewStyle(tint: Theme.Colors.primary))

            Text("Enhancing your image...")
                .font(Theme.Typography.headline)
                .foregroundColor(Theme.Colors.primary)

            Text("This may take a few moments")
                .font(Theme.Typography.caption)
                .foregroundColor(.secondary)
        }
        .padding(Theme.Spacing.xl)
        .frame(maxWidth: .infinity)
        .background(Color(.systemBackground))
        .cornerRadius(Theme.CornerRadius.md)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
    }

    private func errorView(message: String) -> some View {
        VStack(spacing: Theme.Spacing.md) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 40))
                .foregroundColor(Theme.Colors.error)

            Text("Enhancement Failed")
                .font(Theme.Typography.headline)
                .foregroundColor(.primary)

            Text(message)
                .font(Theme.Typography.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(Theme.Spacing.xl)
        .frame(maxWidth: .infinity)
        .background(Theme.Colors.error.opacity(0.1))
        .cornerRadius(Theme.CornerRadius.md)
        .overlay(
            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                .stroke(Theme.Colors.error.opacity(0.3), lineWidth: 1)
        )
    }
}

#Preview {
    VStack(spacing: 20) {
        EnhancementStateView(
            state: .loading,
            isLoading: true,
            errorMessage: nil
        )

        EnhancementStateView(
            state: .error("Network connection failed"),
            isLoading: false,
            errorMessage: "Network connection failed"
        )
    }
    .padding()
}
