---
name: ClientPulse Professional
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747687'
  outline-variant: '#c4c5d8'
  surface-tint: '#184de6'
  primary: '#0038bd'
  on-primary: '#ffffff'
  primary-container: '#1b4fe8'
  on-primary-container: '#d3d9ff'
  inverse-primary: '#b8c4ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#77f2ba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#0037b9'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#7ff9c1'
  tertiary-fixed-dim: '#61dca6'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005237'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.5px
  headline-1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.3px
  headline-2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.2px
  headline-3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
---

## Brand & Style
The design system is engineered for a high-performance analytics SaaS environment, prioritizing clarity, data density, and institutional trust. It draws inspiration from the "utility-first" aesthetic of modern developer tools and financial platforms, balancing a technical edge with approachable usability.

The style is **Corporate / Modern**, characterized by a rigorous adherence to a 4px/8px grid, deliberate use of negative space to group information, and a refined "light-mode-first" interface that reduces cognitive load during deep data analysis. The emotional response should be one of "effortless control"—where the UI recedes to let the data lead.

## Colors
This design system utilizes a high-clarity palette centered around a deep digital blue. The color architecture is designed to facilitate quick "at-a-glance" health monitoring using a strict semantic scale.

- **Primary & Actions:** Use `#1B4FE8` for primary interactions. Hover states should consistently darken by 10% (`#1640CC`).
- **Surface Strategy:** The system uses a layered neutral approach. Use `Neutral 100` for the application background and `Neutral 50` for primary content containers/cards to create subtle contrast.
- **Data Visualization:** The Health Scale (Green, Amber, Red) is reserved strictly for status and performance metrics to prevent visual noise.
- **Muted Elements:** Use `Neutral 500` for non-essential information and `Neutral 300` for all structural borders.

## Typography
The typography system relies exclusively on **Inter** to maintain a systematic, utilitarian feel. 

- **Optical Sizing:** For large displays and headings, tight negative letter-spacing is applied to maintain visual density and professional tension.
- **Hierarchy:** Use `Label` (uppercase) for category headers in sidebars or small metadata descriptions above headings.
- **Data Tables:** Use the `body` (14px) style for primary data and `caption` (12px) for secondary supporting text within table cells.
- **Mobile Scaling:** For mobile viewports, the `display` style should scale down to `24px` to avoid excessive wrapping, while body sizes remain constant for legibility.

## Layout & Spacing
The system follows a **12-column fluid grid** for the main content area, while global navigation elements occupy fixed widths.

- **Sidebar:** Fixed at `240px` or `280px` depending on content density.
- **Spacing Rhythm:** All margins and paddings must be multiples of the `8px` base unit. Use `16px (md)` for standard component internal padding and `24px (lg)` for section gaps.
- **Consistency:** Align all dashboard cards to a vertical `24px` rhythm. Elements within cards (like headers and footers) should use `16px` padding to create a clear internal nested hierarchy.
- **Breakpoints:**
  - **Mobile (<768px):** Single column, `16px` outer margins.
  - **Tablet (768px - 1024px):** 6-column grid, sidebar collapses to icon-only.
  - **Desktop (>1024px):** 12-column grid, fixed sidebar.

## Elevation & Depth
Depth is signaled through a combination of **Tonal Layering** and **Ambient Shadows**. This design system avoids heavy shadows, opting instead for precise, low-opacity lifts that suggest physical stacking without cluttering the UI.

- **Surface Level (0):** Use `Neutral 100` background.
- **Flat/Card Level (1):** White or `Neutral 50` surfaces with a 1px border of `Neutral 300`. This is the default for dashboard cards.
- **Small Lift (sm):** Used for buttons and small dropdowns. `0 1px 3px rgba(15, 23, 42, 0.08)`.
- **Medium Lift (md):** Reserved for Modals and active Popovers. `0 4px 12px rgba(15, 23, 42, 0.12)`.
- **Large Lift (lg):** Exclusively for global notifications or drawers that sit above all other logic. `0 12px 32px rgba(15, 23, 42, 0.15)`.

## Shapes
The shape language is refined and professional. By using the `Rounded` preset (0.5rem base), the system avoids both the harshness of a "sharp" aesthetic and the playfulness of a "pill" aesthetic.

- **Buttons & Inputs:** Use `radius.sm` (6px) for a precise, crisp look.
- **Cards & Containers:** Use `radius.md` (10px) to define primary content areas.
- **Large Modals/Banners:** Use `radius.lg` (16px) to soften the impact of large overlay elements.
- **Charts:** Bar charts should use a slight `2px` top-corner radius to maintain the professional tone while softening the data visualization.

## Components

### Buttons
- **Primary:** Background `#1B4FE8`, Text White. High emphasis actions.
- **Secondary:** Background White, Border `Neutral 300`, Text `Neutral 700`. Standard actions.
- **Ghost:** No background/border, Text `Neutral 500`. Low emphasis/toolbar actions.
- **Danger:** Background `#DC2626`, Text White. Use only for destructive actions.

### Inputs & Selects
- **Height:** Standardized to `40px` for desktop.
- **State:** On focus, use a 2px ring of `Primary Light` and a border color of `Primary`.
- **Search:** Include a leading icon (Neutral 400) and a "clear" button for active queries.

### Cards & Stats
- **Standard Card:** White background, `Neutral 300` border, `radius.md`.
- **Stats Card:** Feature a `Headline 2` for the metric, a `Caption` for the label, and a small Badge for the percentage change.

### Tables
- **Header:** `Neutral 100` background, `Label` typography, 1px bottom border.
- **Rows:** `48px` minimum height, hover state background `Neutral 50`.

### Badges & Status
- **Health Badges:** Use a light background (e.g., `Accent Light`) with high-contrast text (`Accent/Success`) for visibility.
- **Shapes:** Use a `12px` height for small badges and `20px` for standard status labels.

### Navigation
- **Sidebar:** Dark `Neutral 900` or clean `Neutral 50` background. Use active state markers (4px vertical line on the left edge).
- **Topbar:** `64px` height, blurred background effect if using glassmorphism, or solid white with a subtle bottom shadow (sm).

### Feedback (Modals & Toasts)
- **Modals:** Center-aligned, `md` elevation, `radius.lg`.
- **Toasts:** Bottom-right alignment, high-contrast background (Neutral 900), `lg` elevation.