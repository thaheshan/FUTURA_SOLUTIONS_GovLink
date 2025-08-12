# 🎨 Design System Architecture

This document outlines the design system used across the application, ensuring **consistency**, **accessibility**, and **brand alignment** with **Sri Lankan government standards**. The system supports **three official languages** (Sinhala, Tamil, English) and is built for **responsive**, **themed**, and **maintainable** UI development.

---

## 🗂️ Folder Structure
src/styles/
├── colors.ts
├── typography.ts
├── spacing.ts
├── globalStyles.ts
├── themes/
│ ├── lightTheme.ts
│ └── darkTheme.ts
└── index.ts



Each file exports **design tokens** used across components.

---


All design tokens are re-exported through `index.ts` for easy access across the app.

## 🎨 colors.ts – Semantic Color System

Defines all color values used throughout the application. Colors are named semantically to support branding, accessibility, and theming.

### Key Tokens
- `primary`: `#A7D5D7` – Main brand accent color (aqua/teal)
- `secondary`: `#9BDADC` – Secondary accent
- `black`: `#26303B`, `white`: `#FFFFFF`
- `gray`, `lightGray`: Neutral UI shades
- `textPrimary`: `#26303B`, `textSecondary`: `#626262`
- `backgroundPrimary`: `#FFFFFF`, `backgroundSecondary`: `#F8F8F8`
- `error`: `#FF5252`, `success`: `#4CAF50`
- `transparent`: Transparent placeholder

### Usage
```ts
import { colors } from '@/styles';

// Example
<View style={{ backgroundColor: colors.primary }} />
<Text style={{ color: colors.textPrimary }}>Hello</Text>

```

💡 Note: While the current palette uses a modern aqua theme, consider aligning with official Sri Lankan government branding (#003366 for deep blue, #FFCC00 for golden yellow) to strengthen national identity and trust.

## 🔠 typography.ts – Multi-Language Typography System

Manages font families, sizes, weights, line heights, and predefined text variants for **Sinhala**, **Tamil**, and **English**.

### Font Families
- `primary`: 'NotoSans' (English)
- `sinhala`: 'IskoolaPota' (Sinhala – ensure it's bundled)
- `tamil`: 'NotoSansTamil' (Tamil)

Fonts are platform-safe using `Platform.select()` for iOS and Android.

### Font Sizes
- `xs`: 12
- `sm`: 14
- `base`: 16
- `md`: 18
- `lg`: 20
- `xl`: 24
- `2xl`: 30
- `3xl`: 36
- `4xl`: 48
- `5xl`: 60
- `6xl`: 72

### Text Variants
Predefined styles for consistent typography:
- `title`, `heading`, `subtitle`
- `body`, `bodySinhala`, `bodyTamil` (language-specific)
- `button`, `caption`, `label`

Sinhala and Tamil use slightly larger font sizes (`md: 18`) and relaxed line height for better readability.

### Usage
```ts
import { typography } from '@/styles';

// Example
<Text style={typography.textVariants.bodySinhala}>සුභ දිනයක්</Text>
<Text style={typography.textVariants.bodyTamil}>நல்ல நாள்</Text>

```

💡 Tip: For better reliability, consider switching IskoolaPota to NotoSansSinhala (Google Fonts) and preloading it.

## 📏 spacing.ts – Consistent Spacing Scale

A 4px-based spacing system to ensure visual rhythm and consistency across layouts.

### Scale
- `none`: 0
- `xs`: 4
- `sm`: 8
- `md`: 8
- `lg`: 16
- `xl`: 24
- `2xl`: 32
- `3xl`: 40
- `4xl`: 48
- `5xl`: 64

This scale is used for margins, padding, gaps, and layout spacing.

### Usage
```ts
import { spacing } from '@/styles';

// Example
<View style={{ padding: spacing.lg, marginBottom: spacing.md }} />

```
✅ All spacing values are in density-independent pixels (dp), making them responsive across devices.

## 🧱 globalStyles.ts – Reusable Component Styles

Contains pre-styled, reusable React Native styles for common UI elements. Built using tokens from `colors`, `spacing`, and `typography`.

### Key Styles

#### Layout
- `container`: Full flex, white background, padding
- `row`: Horizontal flex layout
- `rowSpaceBetween`: Row with space-between
- `center`: Centered content

#### Typography
- `title`, `heading`, `subtitle`
- `body`, `bodySinhala`, `bodyTamil`
- `buttonText`, `label`, `caption`

#### Buttons
- `button`: Primary filled button
- `buttonSecondary`: Secondary filled
- `buttonOutline`: Outlined button

#### Inputs & Cards
- `input`: Standard input field
- `inputError`: Input with error styling
- `card`: Standard card with padding and border radius
- `cardElevated`: Card with shadow for depth
- `section`: Section container with margin
- `sectionTitle`: Styled title for sections

#### Utilities
- `textCenter`: Text alignment center
- `textRight`: Text alignment right
- `divider`: Horizontal line separator
- `errorText`: Red caption for error messages

### Usage
```ts
import { globalStyles } from '@/styles';

// Example
<View style={globalStyles.card}>
  <Text style={globalStyles.heading}>Profile</Text>
</View>

```

💡 This file acts as your component foundation — avoid duplicating styles in components.

## 🌞 themes/lightTheme.ts – Light Mode Theme

The default theme with high contrast and clean visuals.

### Key Values
- `mode`: 'light'
- `background.primary`: `#FFFFFF`
- `text.primary`: `#26303B`
- `primary.main`: `#A7D5D7`
- `card.backgroundColor`: `#FFFFFF` (with subtle shadow)

### Component Styles
- **Buttons**: Solid colors with white text
- **Inputs**: Light gray borders on white background
- **Shadows**: Soft elevation (`shadowOpacity: 0.1`)

### Usage
```ts
import { lightTheme } from '@/styles';
```


## 🌙 themes/darkTheme.ts – Dark Mode Theme

A dark interface for reduced eye strain in low-light environments.

### Key Values
- `mode`: 'dark'
- `background.primary`: `#26303B` (dark blue-gray)
- `text.primary`: `#FFFFFF`
- `shadowColor`: `#FFFFFF` with higher opacity
- `card.backgroundColor`: `#2D2D2D`

### Component Styles
- **Cards & Inputs**: Dark surfaces with soft elevation
- **Text**: High contrast for readability
- **Buttons**: Assume primary is light; text is dark

### Usage
```ts
import { darkTheme } from '@/styles
```

💡 **Note**: Ensure all components adapt to both themes. Avoid hardcoded colors.

## 📦 index.ts – Unified Design System Export

Central entry point for all design tokens and themes.

### Exports
```ts
export {
  colors,
  spacing,
  typography,
  globalStyles,
  lightTheme,
  darkTheme,
};
```

## Usage

Import everything in one line:

```ts
import { colors, spacing, typography, globalStyles, lightTheme } from '@/styles';
```

This enables consistent, clean access across the app and reduces import clutter.

## ✅ Best Practices
- ✅ Never hardcode colors or spacing — always use tokens.
- ✅ Use `globalStyles` for common patterns (buttons, cards).
- ✅ Support all three languages with correct fonts and sizing.
- ✅ Test in both themes — ensure text is readable and components render correctly.
- ✅ Rename files to lowercase:
  - `Colors.ts` → `colors.ts`
  - `Typography.ts` → `typography.ts`
  - `Spacing.ts` → `spacing.ts`
  - `GlobalStyles.ts` → `globalStyles.ts`
  - `Theme/LightTheme.ts` → `themes/lightTheme.ts`
- ✅ Update imports in `index.ts` accordingly.

## 🛠 Future Improvements
- Add `ThemeProvider` and `useTheme()` hook for dynamic theme switching
- Preload `Noto Sans Sinhala` and `Noto Sans Tamil` using `expo-font`
- Create a Storybook library to visualize components
- Define a `Theme` TypeScript type for autocomplete

## 📞 Contact
For design system questions or updates, contact the development team at:  
📧 admin@futuracareers.tech

📅 Last Updated: May 2025

---

### ✅ How to Use This

1. **Copy everything** from the first `# 🎨 Design System Documentation` to the end (including all lines).
2. Open a text editor (VS Code, Notepad++, etc.).
3. Paste and save as:  
   `docs/design-system/README.md`
4. Commit to your repo.

✅ No broken blocks.  
✅ No overflow.  
✅ Ready to use.

Let me know if you want this as a downloadable `.md` file or need help setting up the folder structure!

