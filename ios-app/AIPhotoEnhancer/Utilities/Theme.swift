//
//  Theme.swift
//  AIPhotoEnhancer
//
//  Created on 2026-02-09.
//

import SwiftUI

struct Theme {
    // MARK: - Colors
    struct Colors {
        static let primary = Color(red: 0.4, green: 0.5, blue: 0.9)
        static let secondary = Color(red: 0.6, green: 0.4, blue: 0.9)
        static let accent = Color(red: 0.9, green: 0.5, blue: 0.4)
        static let background = Color(.systemBackground)
        static let secondaryBackground = Color(.secondarySystemBackground)
        static let success = Color.green
        static let error = Color.red
        static let warning = Color.orange

        static let gradientPrimary = LinearGradient(
            gradient: Gradient(colors: [primary, secondary]),
            startPoint: .leading,
            endPoint: .trailing
        )

        static let gradientBackground = LinearGradient(
            gradient: Gradient(colors: [
                primary.opacity(0.1),
                secondary.opacity(0.1)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    // MARK: - Typography
    struct Typography {
        static let largeTitle = Font.system(size: 34, weight: .bold)
        static let title = Font.system(size: 28, weight: .semibold)
        static let title2 = Font.system(size: 22, weight: .semibold)
        static let headline = Font.system(size: 17, weight: .semibold)
        static let body = Font.system(size: 17, weight: .regular)
        static let callout = Font.system(size: 16, weight: .regular)
        static let subheadline = Font.system(size: 15, weight: .regular)
        static let footnote = Font.system(size: 13, weight: .regular)
        static let caption = Font.system(size: 12, weight: .regular)
    }

    // MARK: - Spacing
    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }

    // MARK: - Corner Radius
    struct CornerRadius {
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
        static let round: CGFloat = 999
    }

    // MARK: - Shadow
    struct ShadowStyle {
        let color: Color
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
    }
    
    struct Shadow {
        static let sm = ShadowStyle(
            color: Color.black.opacity(0.1),
            radius: 4,
            x: 0,
            y: 2
        )
        
        static let md = ShadowStyle(
            color: Color.black.opacity(0.15),
            radius: 8,
            x: 0,
            y: 4
        )
        
        static let lg = ShadowStyle(
            color: Color.black.opacity(0.2),
            radius: 16,
            x: 0,
            y: 8
        )
    }
}

// MARK: - View Extensions
extension View {
    /// Apply a themed shadow preset.
    func themedShadow(_ style: Theme.ShadowStyle) -> some View {
        self.shadow(color: style.color, radius: style.radius, x: style.x, y: style.y)
    }
    
    func cardStyle() -> some View {
        self
            .background(Color(.systemBackground))
            .cornerRadius(Theme.CornerRadius.md)
            .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
    }

    func primaryButtonStyle() -> some View {
        self
            .font(Theme.Typography.headline)
            .foregroundColor(.white)
            .padding()
            .frame(maxWidth: .infinity)
            .background(Theme.Colors.gradientPrimary)
            .cornerRadius(Theme.CornerRadius.md)
    }

    func secondaryButtonStyle() -> some View {
        self
            .font(Theme.Typography.headline)
            .foregroundColor(Theme.Colors.primary)
            .padding()
            .frame(maxWidth: .infinity)
            .background(Theme.Colors.primary.opacity(0.1))
            .cornerRadius(Theme.CornerRadius.md)
    }
}
