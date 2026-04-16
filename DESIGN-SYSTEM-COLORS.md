# VyapaarOS: Design System & Color Palette Guide

## 🎨 Complete Color System

### Primary Color Palette

#### Trust Blue (Primary Brand Color)
```
Trust Blue: #0061FF
├─ Hex: #0061FF
├─ RGB: 0, 97, 255
├─ HSL: 217°, 100%, 50%
├─ Usage: Primary buttons, active states, key actions
│
├─ Lighter shade (Background): #E3F2FD
│  ├─ Hex: #E3F2FD
│  ├─ RGB: 227, 242, 253
│  └─ Usage: Button hover, light backgrounds
│
├─ Darker shade (Hover): #0040CC
│  ├─ Hex: #0040CC
│  ├─ RGB: 0, 64, 204
│  └─ Usage: Button hover, interactive elements
│
└─ Darkest shade (Active/Press): #002B99
   ├─ Hex: #002B99
   ├─ RGB: 0, 43, 153
   └─ Usage: Button active/pressed state

CSS Variable: --color-primary: #0061FF
```

### Trust Score Segment Colors

#### Butterfly (High Trust: 80-100)
```
Butterfly Green: #10B981
├─ Hex: #10B981
├─ RGB: 16, 185, 129
├─ HSL: 160°, 84%, 40%
├─ Usage: High-trust clients, success states
│
├─ Light (Background): #D1FAE5
│  ├─ Hex: #D1FAE5
│  ├─ RGB: 209, 250, 229
│  └─ Usage: Butterfly segment background, status badge
│
└─ Dark (Text): #047857
   ├─ Hex: #047857
   ├─ RGB: 4, 120, 87
   └─ Usage: Text in green backgrounds

Emoji: 🦋
Icon: Check mark (lucide-react: check-circle)
CSS: --color-butterfly: #10B981
```

#### Loyal (Medium Trust: 60-79)
```
Loyalty Amber: #F59E0B
├─ Hex: #F59E0B
├─ RGB: 245, 158, 11
├─ HSL: 38°, 92%, 50%
├─ Usage: Standard clients, pending status
│
├─ Light (Background): #FEF3C7
│  ├─ Hex: #FEF3C7
│  ├─ RGB: 254, 243, 199
│  └─ Usage: Loyal segment background, warning states
│
└─ Dark (Text): #D97706
   ├─ Hex: #D97706
   ├─ RGB: 217, 119, 6
   └─ Usage: Text in amber backgrounds

Emoji: ⭐
Icon: Star (lucide-react: star)
CSS: --color-loyal: #F59E0B
```

#### One-Time (Low Trust: 40-59)
```
One-Time Indigo: #6366F1
├─ Hex: #6366F1
├─ RGB: 99, 102, 241
├─ HSL: 258°, 90%, 67%
├─ Usage: New clients, neutral status
│
├─ Light (Background): #E0E7FF
│  ├─ Hex: #E0E7FF
│  ├─ RGB: 224, 231, 255
│  └─ Usage: One-Time segment background
│
└─ Dark (Text): #4F46E5
   ├─ Hex: #4F46E5
   ├─ RGB: 79, 70, 229
   └─ Usage: Text in indigo backgrounds

Emoji: 💤
Icon: Eye off (lucide-react: eye-off)
CSS: --color-one-time: #6366F1
```

#### Risky (Needs Attention: 0-39)
```
Risk Red: #EF4444
├─ Hex: #EF4444
├─ RGB: 239, 68, 68
├─ HSL: 0°, 93%, 60%
├─ Usage: Problem clients, error states, urgent actions
│
├─ Light (Background): #FEE2E2
│  ├─ Hex: #FEE2E2
│  ├─ RGB: 254, 226, 226
│  └─ Usage: Risky segment background, error badges
│
└─ Dark (Text): #DC2626
   ├─ Hex: #DC2626
   ├─ RGB: 220, 38, 38
   └─ Usage: Text in red backgrounds

Emoji: ⚠️
Icon: Alert triangle (lucide-react: alert-triangle)
CSS: --color-risky: #EF4444
```

### Semantic Status Colors

#### Success (Payment Received)
```
Success Green: #10B981 (same as Butterfly)
├─ Dark green text: #047857
└─ Light green background: #D1FAE5

Usage:
├─ Invoice marked as "Paid"
├─ Successful operations
├─ Positive confirmations
└─ Trust score improved
```

#### Warning (Overdue Invoice)
```
Warning Amber: #F59E0B (same as Loyal)
├─ Dark amber text: #D97706
└─ Light amber background: #FEF3C7

Usage:
├─ Invoice 1-7 days overdue
├─ Pending actions
├─ Caution required
└─ Client needs attention soon
```

#### Danger (Very Overdue/Urgent)
```
Danger Red: #EF4444 (same as Risky)
├─ Dark red text: #DC2626
└─ Light red background: #FEE2E2

Usage:
├─ Invoice >7 days overdue
├─ Urgent actions required
├─ Error states
└─ Critical attention needed
```

#### Neutral (Pending)
```
Neutral Gray: #6B7280
├─ Hex: #6B7280
├─ RGB: 107, 114, 128
├─ HSL: 217°, 8%, 43%
└─ Usage:
   ├─ Pending invoices (no color)
   ├─ Default state
   ├─ Secondary information
   └─ Disabled states
```

### Grayscale Colors (Text & Backgrounds)

#### Text Colors
```
Primary Text (Headings, Important):
├─ Hex: #111827 (Dark gray)
├─ RGB: 17, 24, 39
└─ Used for: H1, H2, H3, important labels

Secondary Text (Body text):
├─ Hex: #374151 (Medium dark gray)
├─ RGB: 55, 65, 81
└─ Used for: Regular paragraphs, content

Tertiary Text (Metadata, hints):
├─ Hex: #6B7280 (Medium gray)
├─ RGB: 107, 114, 128
└─ Used for: Timestamps, small labels, placeholders

Quaternary Text (Disabled, very light):
├─ Hex: #9CA3AF (Light gray)
├─ RGB: 156, 163, 175
└─ Used for: Disabled buttons, secondary hints
```

#### Background Colors
```
Page Background:
├─ Hex: #F9FAFB (Off-white)
├─ RGB: 249, 250, 251
├─ Usage: Main page background, provides contrast
└─ Reason: Pure white (#FFFFFF) is harsh on eyes

Card/Component Background:
├─ Hex: #FFFFFF (Pure white)
├─ RGB: 255, 255, 255
├─ Usage: Cards, modals, containers
└─ Reason: Separates content from page background

Hover/Interactive Background:
├─ Hex: #F3F4F6 (Light gray)
├─ RGB: 243, 244, 246
├─ Usage: Hover states, selected rows, active tabs
└─ Reason: Provides feedback without being too dark

Divider/Border Color:
├─ Hex: #E5E7EB (Very light gray)
├─ RGB: 229, 231, 235
├─ Usage: Borders, dividers, section separators
└─ Reason: Just enough contrast, doesn't dominate
```

### Color Contrast Verification (WCAG AA)

```
Trust Blue (#0061FF) on white:
├─ Ratio: 8.6:1 ✅ EXCELLENT
└─ Meets: AAA (enhanced accessibility)

Butterfly Green (#10B981) on white:
├─ Ratio: 4.5:1 ✅ GOOD
└─ Meets: AA (standard accessibility)

Loyal Amber (#F59E0B) on white:
├─ Ratio: 3.2:1 ⚠️ NEEDS CARE
├─ Solution: Use dark text (#D97706) for small text
└─ Alternative: Use light background (#FEF3C7) + dark text

Risk Red (#EF4444) on white:
├─ Ratio: 3.6:1 ⚠️ NEEDS CARE
├─ Solution: Use dark text (#DC2626) for small text
└─ Alternative: Use light background (#FEE2E2) + dark text

Dark Gray (#111827) on white:
├─ Ratio: 16.4:1 ✅ EXCELLENT
└─ Perfect for headings and body text
```

---

## 🎨 Usage Guide by Component

### Buttons

```
Primary Button (Main CTA):
├─ Background: Trust Blue (#0061FF)
├─ Text: White (#FFFFFF)
├─ Hover: Darker Blue (#0040CC)
├─ Active: #002B99
├─ Disabled: Light Gray (#D1D5DB) with opacity 0.5
└─ Example: "Enter Dashboard", "Mark as Paid", "Send Reminder"

Secondary Button (Alternative CTA):
├─ Background: Light Gray (#F3F4F6)
├─ Border: 1px #D1D5DB
├─ Text: Dark Gray (#111827)
├─ Hover: #E5E7EB
└─ Example: "Cancel", "Skip", "Go Back"

Danger Button (Delete/Destructive):
├─ Background: Risk Red (#EF4444)
├─ Text: White (#FFFFFF)
├─ Hover: Dark Red (#DC2626)
└─ Example: "Delete Invoice", "Remove Client"

Success Button (Confirmation):
├─ Background: Butterfly Green (#10B981)
├─ Text: White (#FFFFFF)
├─ Hover: Dark Green (#047857)
└─ Example: "Confirm Payment", "Save Changes"
```

### Cards

```
Card Container:
├─ Background: White (#FFFFFF)
├─ Border: 1px solid #E5E7EB
├─ Border radius: 12px
├─ Padding: 20px
├─ Shadow: 0 1px 3px rgba(0,0,0,0.1)
├─ Hover Shadow: 0 4px 12px rgba(0,0,0,0.15)
└─ Used for: Dashboard metrics, client rows, conversations

Card Header:
├─ Background: #F9FAFB (off-white)
├─ Border-bottom: 1px solid #E5E7EB
├─ Padding: 16px 20px
├─ Font weight: 600
├─ Color: #111827
└─ Used for: "Clients", "Invoices", "Messages"

Card Body:
├─ Background: White (#FFFFFF)
├─ Padding: 20px
├─ Font size: 14px
└─ Color: #374151
```

### Forms & Inputs

```
Text Input:
├─ Background: White (#FFFFFF)
├─ Border: 1px solid #D1D5DB
├─ Border radius: 8px
├─ Padding: 12px 16px
├─ Focus border: 2px solid Trust Blue (#0061FF)
├─ Focus outline: 4px offset, rgba(0,97,255,0.1)
├─ Placeholder: #9CA3AF
└─ Height: 44px (touch-friendly)

Input Label:
├─ Font size: 12px
├─ Font weight: 600
├─ Color: #111827
├─ Margin bottom: 6px
└─ Required indicator: Red asterisk (#EF4444)

Input Validation:
├─ Valid (no changes): Normal blue border
├─ Invalid: Red border 2px solid #EF4444
├─ Error message: 12px, color #EF4444, margin-top 4px
└─ Success: Green border 2px solid #10B981
```

### Status Badges

```
Paid (Success):
├─ Background: #D1FAE5 (light green)
├─ Text: #047857 (dark green)
├─ Border: 1px solid #6EE7B7
└─ Usage: "Paid" status on invoices

Pending (Neutral):
├─ Background: #FEF3C7 (light yellow)
├─ Text: #D97706 (dark amber)
├─ Border: 1px solid #FCD34D
└─ Usage: "Pending" status on invoices

Overdue (Warning):
├─ Background: #FEE2E2 (light red)
├─ Text: #DC2626 (dark red)
├─ Border: 1px solid #FECACA
└─ Usage: "Overdue" status on invoices

Trust Score Badge (Segment):
├─ Butterfly: Green background, 🦋 emoji
├─ Loyal: Amber background, ⭐ emoji
├─ One-Time: Indigo background, 💤 emoji
└─ Risky: Red background, ⚠️ emoji
```

### Tables

```
Table Header Row:
├─ Background: #F9FAFB (off-white)
├─ Border-bottom: 1px solid #E5E7EB
├─ Font size: 12px
├─ Font weight: 600
├─ Color: #6B7280 (medium gray)
├─ Padding: 12px 16px
└─ Example: Invoice ID, Client, Amount, Status

Table Data Row:
├─ Background: White (#FFFFFF)
├─ Border-bottom: 1px solid #E5E7EB
├─ Font size: 14px
├─ Font weight: 400
├─ Color: #374151
├─ Padding: 16px
├─ Hover: Background #F9FAFB
└─ Used for: Invoice data, client list

Table Striped Rows (Optional):
├─ Alternate rows: #F9FAFB background
├─ Improves readability on wide tables
├─ Use for: Long invoice tables
└─ Skip for: Narrow tables (<3 columns)
```

### Navigation

```
Navigation Bar:
├─ Background: Trust Blue (#0061FF)
├─ Text: White (#FFFFFF)
├─ Padding: 16px 24px
├─ Shadow: 0 1px 3px rgba(0,0,0,0.1)
└─ Height: 60px

Active Tab:
├─ Background: Darker Blue (#0040CC) or underline
├─ Font weight: 600
├─ Color: White (#FFFFFF)
└─ Bottom border: 3px Trust Blue

Inactive Tab:
├─ Background: Transparent
├─ Font weight: 400
├─ Color: White (#FFFFFF) with 0.8 opacity
└─ Hover: Background #0040CC
```

### Empty States & Placeholders

```
Empty State:
├─ Icon: 64x64px, color #D1D5DB (light gray)
├─ Heading: 16px, weight 600, color #374151
├─ Description: 14px, weight 400, color #6B7280
├─ CTA Button: Primary button (Trust Blue)
├─ Background: #F9FAFB (off-white)
└─ Example: "No clients yet. Create one to get started."

Placeholder (Form):
├─ Text: #9CA3AF (light gray)
├─ Font style: normal (not italic)
└─ Example: "e.g., Rajesh Sharma"

Disabled State:
├─ Opacity: 0.5
├─ Cursor: not-allowed
├─ No hover effects
├─ Color: #D1D5DB (light gray)
└─ Used for: Disabled buttons, read-only fields
```

---

## 🌓 Dark Mode Color Mapping

```
If implementing dark mode (future):

Primary: Trust Blue (#0061FF) → Light Blue (#60A5FA)
Text Primary: Dark (#111827) → Light (#F3F4F6)
Text Secondary: Gray (#374151) → Light Gray (#D1D5DB)
Background: Off-white (#F9FAFB) → Dark (#1F2937)
Card Background: White (#FFFFFF) → Darker (#111827)

Status colors remain the same (adjust opacity if needed):
├─ Green (#10B981)
├─ Amber (#F59E0B)
├─ Red (#EF4444)
└─ Indigo (#6366F1)

Rule: Maintain 4.5:1 contrast ratio in dark mode too
```

---

## 🎨 Color Psychology for This Product

```
Trust Blue (#0061FF):
├─ Psychology: Trust, security, professionalism
├─ Why chosen: SMBs need to trust financial tool
├─ Banking industry standard
└─ High visibility, accessible

Butterfly Green (#10B981):
├─ Psychology: Growth, success, positivity
├─ Why chosen: Celebrate good payment clients
├─ Natural, calming color
└─ Clear contrast with blue

Loyalty Amber (#F59E0B):
├─ Psychology: Caution, attention, energy
├─ Why chosen: Moderate caution (not urgent)
├─ Distinct from green and red
└─ Warm, friendly tone

Risk Red (#EF4444):
├─ Psychology: Danger, urgency, attention
├─ Why chosen: Clear signal for problem clients
├─ Standard in finance (stop, sell, loss)
└─ High contrast, can't be missed

Gray Neutrals:
├─ Psychology: Balance, professionalism
├─ Why chosen: Subtle, non-threatening
├─ Reduces cognitive load
└─ Focus on colored elements
```

---

## 📱 Responsive Color Adjustments

```
Mobile Considerations:
├─ Colors appear brighter on small screens
├─ Slightly reduce saturation on mobile
├─ Increase contrast for small text
├─ Status badges larger on mobile

Desktop Considerations:
├─ Colors can be more saturated
├─ Tables use subtle stripe colors
├─ Hover states more pronounced
└─ More whitespace reduces color intensity

Print Considerations:
├─ Test color printing (may differ)
├─ Ensure black text readable if printed
├─ Use borders for distinction (not just color)
└─ Consider greyscale fallback
```

---

## ⚡ Performance Tips for Color Usage

```
✅ Use CSS variables for easy theme switching
❌ Avoid gradients (slower rendering)
✅ Use solid colors (faster)
❌ Avoid heavy shadows (GPU intensive)
✅ Minimal shadows only on hover
✅ Preload critical color states
✅ Batch color calculations in CSS
❌ Don't animate color changes (use opacity instead)
✅ Animate with opacity: 200ms ease-out
```

---

## CSS Implementation

```css
:root {
  /* Primary Colors */
  --color-primary: #0061FF;
  --color-primary-hover: #0040CC;
  --color-primary-active: #002B99;
  --color-primary-light: #E3F2FD;

  /* Status Colors */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;
  --color-success-dark: #047857;

  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-warning-dark: #D97706;

  --color-danger: #EF4444;
  --color-danger-light: #FEE2E2;
  --color-danger-dark: #DC2626;

  --color-info: #6366F1;
  --color-info-light: #E0E7FF;
  --color-info-dark: #4F46E5;

  /* Grayscale */
  --color-text-primary: #111827;
  --color-text-secondary: #374151;
  --color-text-tertiary: #6B7280;
  --color-text-disabled: #9CA3AF;

  --color-bg-primary: #F9FAFB;
  --color-bg-secondary: #FFFFFF;
  --color-bg-hover: #F3F4F6;

  --color-border: #E5E7EB;
  --color-border-light: #D1D5DB;
}
```

---

## 🎯 Quick Color Reference Card

```
┌─────────────┬──────────┬──────────────┬─────────────────┐
│ Element     │ Primary  │ State        │ Value           │
├─────────────┼──────────┼──────────────┼─────────────────┤
│ Trust Score │ Blue     │ Primary      │ #0061FF         │
│             │ Green    │ Butterfly    │ #10B981 (80-100)│
│             │ Amber    │ Loyal        │ #F59E0B (60-79) │
│             │ Indigo   │ One-Time     │ #6366F1 (40-59) │
│             │ Red      │ Risky        │ #EF4444 (0-39)  │
├─────────────┼──────────┼──────────────┼─────────────────┤
│ Invoice     │ Green    │ Paid         │ #D1FAE5 bg      │
│             │ Amber    │ Pending      │ #FEF3C7 bg      │
│             │ Red      │ Overdue      │ #FEE2E2 bg      │
├─────────────┼──────────┼──────────────┼─────────────────┤
│ Text        │ Dark     │ Primary      │ #111827         │
│             │ Medium   │ Secondary    │ #374151         │
│             │ Light    │ Tertiary     │ #6B7280         │
├─────────────┼──────────┼──────────────┼─────────────────┤
│ Background  │ Off-white│ Page         │ #F9FAFB         │
│             │ White    │ Card         │ #FFFFFF         │
│             │ Light    │ Hover        │ #F3F4F6         │
└─────────────┴──────────┴──────────────┴─────────────────┘
```

---

**This document is the single source of truth for all colors in VyapaarOS. Update here first, then propagate to codebase.**

**Version:** 1.0
**Last Updated:** January 13, 2026
