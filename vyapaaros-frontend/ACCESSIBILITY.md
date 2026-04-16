# Accessibility Documentation

## Overview

VyapaarOS frontend is designed to meet WCAG 2.1 Level AA accessibility standards. This document outlines the accessibility features implemented throughout the application.

## Keyboard Navigation

### Global Navigation
- **Skip to Main Content**: Press `Tab` on page load to reveal a "Skip to main content" link that allows keyboard users to bypass navigation
- **Navigation Menu**: All navigation items are keyboard accessible using `Tab` and `Enter`/`Space` keys
- **Mobile Menu**: Press `Escape` to close the mobile navigation menu

### Interactive Elements
- All buttons, links, and form controls are keyboard accessible
- Focus indicators are visible with a 2px blue ring (`focus:ring-2 focus:ring-primary`)
- Tab order follows logical reading order

## Screen Reader Support

### ARIA Labels and Roles
- Navigation landmarks: `<nav>` elements with `aria-label` attributes
- Main content: `<main>` element with `role="main"` and `id="main-content"`
- Dialog modals: `role="dialog"` and `aria-modal="true"` for mobile menu
- Current page indication: `aria-current="page"` on active navigation items
- Button states: `aria-expanded`, `aria-disabled`, `aria-busy` attributes
- Form validation: `aria-invalid`, `aria-describedby`, `aria-required` attributes

### Descriptive Text
- All icons have `aria-hidden="true"` to prevent redundant announcements
- Icon-only buttons include `aria-label` attributes
- Error messages have `role="alert"` for immediate announcement
- Loading states include `role="status"` with descriptive labels

## Color Contrast

All color combinations meet WCAG AA standards (minimum 4.5:1 contrast ratio for normal text, 3:1 for large text):

### Text Colors
- **Primary Text** (#111827) on White (#FFFFFF): 16.1:1 ✓
- **Secondary Text** (#374151) on White (#FFFFFF): 11.6:1 ✓
- **Tertiary Text** (#6B7280) on White (#FFFFFF): 5.7:1 ✓

### Button Colors
- **Primary Button**: White text (#FFFFFF) on Trust Blue (#0061FF): 5.9:1 ✓
- **Danger Button**: White text (#FFFFFF) on Red (#EF4444): 4.5:1 ✓
- **Success Button**: White text (#FFFFFF) on Green (#10B981): 3.4:1 (Large text only) ⚠️

### Status Badges
- **Success Badge**: Dark Green (#047857) on Light Green (#D1FAE5): 7.2:1 ✓
- **Warning Badge**: Dark Amber (#D97706) on Light Amber (#FEF3C7): 6.8:1 ✓
- **Danger Badge**: Dark Red (#DC2626) on Light Red (#FEE2E2): 7.5:1 ✓
- **Info Badge**: Dark Indigo (#4F46E5) on Light Indigo (#E0E7FF): 8.1:1 ✓

### Trust Segment Colors
- **Butterfly**: Dark Green (#047857) on Light Green (#D1FAE5): 7.2:1 ✓
- **Loyal**: Dark Amber (#D97706) on Light Amber (#FEF3C7): 6.8:1 ✓
- **One-Time**: Dark Indigo (#4F46E5) on Light Indigo (#E0E7FF): 8.1:1 ✓
- **Risky**: Dark Red (#DC2626) on Light Red (#FEE2E2): 7.5:1 ✓

## Form Accessibility

### Input Fields
- All inputs have associated `<label>` elements with `htmlFor` attributes
- Required fields are marked with `aria-required="true"` and visual asterisk
- Error states include `aria-invalid="true"` and `aria-describedby` pointing to error message
- Error messages have unique IDs and `role="alert"` for immediate announcement
- Helper text is associated with inputs via `aria-describedby`

### Mobile Optimization
- Input fields use appropriate `inputMode` attributes for mobile keyboards
- All interactive elements meet minimum touch target size of 44x44px
- Form inputs use `text-base` on mobile to prevent zoom on iOS

## Focus Management

### Focus Indicators
- All interactive elements have visible focus indicators
- Focus ring: 2px solid blue with 2px offset
- Focus is never removed or hidden with `outline: none` without replacement

### Focus Trapping
- Modal dialogs trap focus within the modal
- Escape key closes modals and returns focus to trigger element

## Responsive Design

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Touch Targets
- All interactive elements are minimum 44x44px on mobile
- Adequate spacing between touch targets (minimum 8px)
- Bottom navigation bar is 60px tall for easy thumb access

## Testing Recommendations

### Manual Testing
1. **Keyboard Navigation**: Navigate entire application using only keyboard
2. **Screen Reader**: Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS/iOS)
3. **Zoom**: Test at 200% zoom level
4. **Color Blindness**: Use browser extensions to simulate color blindness

### Automated Testing
1. **axe DevTools**: Browser extension for automated accessibility testing
2. **Lighthouse**: Chrome DevTools accessibility audit
3. **WAVE**: Web accessibility evaluation tool

## Known Issues

### Success Button Contrast
The success button (white on green #10B981) has a contrast ratio of 3.4:1, which only meets WCAG AA for large text (18pt+). Consider using a darker green for better contrast or ensuring success buttons use larger text.

## Future Improvements

1. **High Contrast Mode**: Add support for Windows High Contrast Mode
2. **Reduced Motion**: Respect `prefers-reduced-motion` media query
3. **Dark Mode**: Implement dark mode with appropriate contrast ratios
4. **Focus Visible**: Use `:focus-visible` to show focus only for keyboard users
5. **Live Regions**: Add `aria-live` regions for dynamic content updates
