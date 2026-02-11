//
//  GalleryView.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import SwiftUI

struct GalleryView: View {
    let history: [EnhancementResult]
    @Environment(\.dismiss) var dismiss

    private let columns = [
        GridItem(.flexible(), spacing: Theme.Spacing.sm),
        GridItem(.flexible(), spacing: Theme.Spacing.sm)
    ]

    var body: some View {
        NavigationView {
            ZStack {
                Theme.Colors.gradientBackground
                    .ignoresSafeArea()

                if history.isEmpty {
                    emptyStateView
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: Theme.Spacing.sm) {
                            ForEach(history) { result in
                                NavigationLink {
                                    GalleryDetailView(result: result)
                                } label: {
                                    galleryItemView(result: result)
                                }
                            }
                        }
                        .padding(Theme.Spacing.md)
                    }
                }
            }
            .navigationTitle("Gallery")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Image(systemName: "photo.stack")
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.primary.opacity(0.3))

            Text("No Enhancements Yet")
                .font(Theme.Typography.title2)
                .foregroundColor(.primary)

            Text("Enhanced images will appear here")
                .font(Theme.Typography.callout)
                .foregroundColor(.secondary)
        }
    }

    private func galleryItemView(result: EnhancementResult) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
            Image(uiImage: result.enhancedImage)
                .resizable()
                .scaledToFill()
                .frame(height: 150)
                .clipped()
                .cornerRadius(Theme.CornerRadius.sm)

            Text(result.type.rawValue)
                .font(Theme.Typography.caption)
                .foregroundColor(.primary)
                .fontWeight(.semibold)

            Text(result.timestamp, style: .date)
                .font(Theme.Typography.caption)
                .foregroundColor(.secondary)
        }
        .padding(Theme.Spacing.xs)
        .background(Color(.systemBackground))
        .cornerRadius(Theme.CornerRadius.md)
        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Gallery Detail View
struct GalleryDetailView: View {
    let result: EnhancementResult

    var body: some View {
        ScrollView {
            VStack(spacing: Theme.Spacing.lg) {
                ResultCompareView(result: result)
                    .padding(Theme.Spacing.md)

                VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                    detailRow(label: "Type", value: result.type.rawValue)
                    detailRow(label: "Date", value: formatDate(result.timestamp))
                    detailRow(label: "Prompt", value: result.prompt)
                }
                .padding(Theme.Spacing.md)
                .background(Color(.systemBackground))
                .cornerRadius(Theme.CornerRadius.md)
                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                .padding(.horizontal, Theme.Spacing.md)
            }
            .padding(.vertical, Theme.Spacing.md)
        }
        .background(Theme.Colors.gradientBackground.ignoresSafeArea())
        .navigationTitle("Enhancement Details")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func detailRow(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(Theme.Typography.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(Theme.Typography.callout)
                .foregroundColor(.primary)
        }
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

#Preview {
    GalleryView(history: [
        EnhancementResult(
            originalImage: UIImage(systemName: "photo")!,
            enhancedImage: UIImage(systemName: "photo.fill")!,
            prompt: "Enhance this night photo",
            type: .night
        )
    ])
}
