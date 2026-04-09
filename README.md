# Calculator App

![Design preview for the Calculator app coding challenge](preview.jpg)

## About

A fully functional calculator app featuring three switchable color themes, built as a Frontend Mentor challenge. The calculator supports standard arithmetic operations with comma-formatted output, keyboard input, and persistent theme preferences via `localStorage`.

## Features

- **Three Color Themes** — switch between dark, light, and high-contrast purple themes with a custom toggle; preference persists across sessions
- **Full Arithmetic** — addition, subtraction, multiplication, and division with decimal support
- **Comma-Separated Formatting** — large numbers are automatically formatted with commas for readability
- **Keyboard Support** — use physical keyboard keys (`0-9`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape`) alongside the on-screen buttons
- **System Theme Detection** — initial theme respects the user's `prefers-color-scheme` preference
- **Responsive Layout** — adapts seamlessly from mobile to desktop viewports
- **Accessible** — semantic HTML, ARIA attributes, `role="radiogroup"` theme switcher, and `aria-live` display region

## Tech Stack

- **HTML** — semantic markup with accessibility-first structure
- **CSS** — Tailwind CSS v4 (CDN) using `@theme` for custom properties and `@apply` for utility composition
- **JavaScript** — vanilla JS handling calculator logic, keyboard events, and theme persistence
- **Font** — League Spartan 700 via Google Fonts

## Project Structure

```
calculator-app-main/
├── index.html        # Markup and Tailwind v4 CDN script
├── styles.css        # All styling via @theme + @apply
├── script.js         # Calculator logic, keyboard input, theme switching
├── preview.jpg       # Design preview
├── design/           # Reference designs (3 themes × desktop/mobile/active)
├── images/           # Favicon assets
└── style-guide.md    # Color palette and font reference
```

## Getting Started

1. Clone the repository
2. Open `index.html` directly in a browser, or serve via Live Server on port 5500

No build step required — the project uses static files with a CDN for Tailwind CSS.
