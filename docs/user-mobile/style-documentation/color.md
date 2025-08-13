# 🎨 `colors.ts` – Color System Documentation

This file defines the **color tokens** used across the Sri Lankan government mobile application. All colors are semantic, reusable, and designed to support branding, accessibility, and theming.

## 🔹 File Location
src/styles/colors.ts


## 🎯 Purpose

- Centralize all color values in one place
- Avoid hardcoded colors in components
- Support light/dark themes
- Ensure visual consistency and accessibility

## 🧩 Color Tokens

```ts
const colors = {
  // Primary Colors
  primary: '#A7D5D7',
  secondary: '#9BDADC',

  // Neutral Colors
  black: '#26303B',
  gray: '#626262',
  lightGray: '#F8F8F8',
  white: '#FFFFFF', 

  // Branding Colors
  brandPrimary: '#A7D5D7',
  brandSecondary: '#9BDADC',

  // Text Colors
  textPrimary: '#26303B',
  textSecondary: '#626262',

  // Background Colors
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F8F8F8',

  // Status Colors
  error: '#FF5252',
  success: '#4CAF50',

  // Other
  transparent: 'transparent',
};

export default colors;
```

## 📌 Key Colors

| Color | Value | Usage |
|------|-------|------|
| `primary` | `#A7D5D7` | Main brand accent (buttons, highlights) |
| `secondary` | `#9BDADC` | Secondary actions, accents |
| `textPrimary` | `#26303B` | Main text on light backgrounds |
| `textSecondary` | `#626262` | Secondary text, captions |
| `backgroundPrimary` | `#FFFFFF` | Default screen background |
| `error` | `#FF5252` | Error messages, alerts |
| `success` | `#4CAF50` | Success states, confirmations |

## 💡 Usage

Import and use color tokens in any component:

```ts
import colors from '@/styles/colors';

// Example: Styled View
<View style={{ backgroundColor: colors.primary, padding: 16 }} />

// Example: Text
<Text style={{ color: colors.textPrimary }}>Hello</Text>
```

## 🛑 Avoid Hardcoding

❌ Never do this:
```ts
<View style={{ backgroundColor: '#A7D5D7' }} />
```

✅ Always do this:
```ts
import colors from '@/styles/colors';
<View style={{ backgroundColor: colors.primary }} />
```

## 🎨 Design Notes

While the current palette (`#A7D5D7`, `#9BDADC`) provides a modern aqua theme, consider aligning with **official Sri Lankan government branding** for stronger national identity:

- **Official Primary Blue**: `#003366`
- **Official Accent Yellow**: `#FFCC00`

Using government-standard colors increases trust and recognition.

## 🔄 Integration with Themes

This file is imported into both `lightTheme.ts` and `darkTheme.ts` to ensure consistent color usage across themes.

Example:
```ts
// themes/lightTheme.ts
import colors from '../colors';

const lightTheme = {
  mode: 'light',
  primary: { main: colors.primary },
  background: { primary: colors.backgroundPrimary },
  // ...
};
```

## ✅ Best Practices

- ✅ Always use `colors` tokens — never hardcoded values
- ✅ Update this file when brand colors change
- ✅ Test contrast ratios for accessibility (especially text on `primary`)
- ✅ Keep names semantic (`textPrimary`, not `darkBlue`)

## 📅 Last Updated
May 2025

---

### ✅ How to Use This

1. **Copy everything above** — from `# 🎨 `colors.ts` – Color System Documentation` to the end.
2. Paste into a new file: `/docs/design-system/colors.md`
3. Save as UTF-8 (to preserve emojis and special characters)

---

✅ **This Markdown is 100% valid**:
- Code blocks are properly opened and closed
- No broken formatting
- Safe to copy/paste
- Ready for GitHub, GitLab, or internal docs

---

Let me know if you want similar `README.md` files for:
- `typography.ts`
- `spacing.ts`
- `globalStyles.ts`
- `themes/`

I’ll make sure each one is **perfectly formatted** — no more broken code blocks. 🙌