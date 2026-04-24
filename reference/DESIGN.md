---
name: Transparency Framework
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d0'
  surface-tint: '#3f5f8e'
  primary: '#001835'
  on-primary: '#ffffff'
  primary-container: '#012d59'
  on-primary-container: '#7696c8'
  inverse-primary: '#a8c8fd'
  secondary: '#00677f'
  on-secondary: '#ffffff'
  secondary-container: '#66daff'
  on-secondary-container: '#005e74'
  tertiary: '#15191a'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a2d2f'
  on-tertiary-container: '#919496'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8fd'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#254775'
  secondary-fixed: '#b6ebff'
  secondary-fixed-dim: '#5fd5f9'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The core of this design system is **Radical Transparency**. For a platform like KAMPANYATAKİP, the UI must act as a silent, reliable witness to financial transactions and charitable impact. The brand personality is institutional yet accessible, combining the authoritative weight of a financial entity with the streamlined efficiency of a modern SaaS.

The visual style is **Corporate / Modern**. It prioritizes high legibility, data density without clutter, and a "high-tech" veneer that suggests sophisticated tracking and security. We utilize ample white space to evoke a sense of honesty and openness, while structured grid alignments reinforce the feeling of organized accountability. The aesthetic avoids unnecessary decoration, focusing instead on clear information architecture and status indicators that build user confidence.

## Colors

This design system utilizes a high-contrast palette to distinguish between structural authority and actionable items. 

- **Primary Navy (#012d59):** Used for global navigation, headers, and primary branding elements. It provides the "anchor" of trust and stability.
- **Accent Turquoise (#04a1c4):** Reserved for interaction points, Call-to-Action (CTA) buttons, and highlighting key progress metrics. It suggests forward momentum and innovation.
- **Neutrals & Grays:** A range of soft grays (from #f8fafc for backgrounds to #64748b for meta-text) is used to create subtle depth and hierarchy without introducing visual noise.
- **Semantic Colors:** Success states and verified badges utilize a crisp emerald to complement the Turquoise, while errors are handled with a professional, non-alarming muted red.

## Typography

The typography strategy relies exclusively on **Inter** to maintain a systematic and utilitarian feel. Inter’s tall x-height and excellent legibility make it ideal for data-heavy dashboards and financial tables.

- **Headlines:** Use tighter letter-spacing and bold weights to command attention and establish hierarchy.
- **Numerical Data:** For donation amounts and percentages, use Inter’s tabular lining features to ensure numbers align perfectly in lists and tables.
- **Labels:** Small caps or medium weights are used for data labels and metadata to distinguish them from primary body copy.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop views to maintain a structured, editorial feel, transitioning to a fluid model for tablet and mobile. 

- **Grid:** A 12-column grid with 24px gutters is the standard for dashboards and content pages. 
- **Rhythm:** An 8px base unit governs all padding and margin decisions, ensuring a consistent vertical rhythm.
- **Margins:** Large outer margins (80px+) are encouraged on content-heavy pages to drive focus toward the center and reduce cognitive load.

## Elevation & Depth

To maintain a "high-tech SaaS" aesthetic, depth is communicated through **Low-contrast outlines** and **Tonal layers** rather than heavy shadows. 

- **Surfaces:** We use a "Level 0" background (#FFFFFF) with "Level 1" containers (#F8FAFC) to separate sections.
- **Outlines:** Cards and input fields use a subtle 1px border (#E2E8F0). 
- **Shadows:** When necessary (e.g., for modals or floating menus), we use "Ambient Shadows"—extremely soft, diffused shadows with low opacity (4-8%) and no distinct direction, making elements appear to lift slightly off the page without casting dark silhouettes.

## Shapes

The shape language is disciplined and professional. We utilize a **Soft (ROUND_FOUR)** approach to provide a hint of approachability while maintaining a crisp, corporate edge.

- **Standard Elements:** Buttons, input fields, and small cards use a 4px (0.25rem) radius.
- **Large Containers:** Hero sections or main content cards may scale up to 8px (0.5rem) to feel more integrated.
- **Interactive Elements:** Checkboxes retain a slight 2px radius to avoid a harsh "sharp" look while staying distinct from rounded radio buttons.

## Components

- **Buttons:** Primary buttons use the Accent Turquoise with white text. Hover states shift to a slightly deeper teal. We use "ghost" buttons (Navy border, Navy text) for secondary actions to keep the hierarchy clear.
- **Input Fields:** Clean, white backgrounds with soft gray borders. Focus states utilize a 2px Turquoise ring to highlight the active area.
- **Transparency Chips:** Used to denote "Verified," "In Progress," or "Completed." These are pill-shaped with light tinted backgrounds and dark text of the same hue.
- **Progress Bars:** Essential for donation tracking. A thick, 8px bar using a light gray track and a Turquoise fill to show real-time progress.
- **Trust Badges:** Small, subtle icons paired with labels in Primary Navy to indicate secure transactions and verified non-profit status.
- **Data Cards:** Content containers that group donation stats. They use the Level 1 gray background to stand out against the white page body.