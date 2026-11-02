# 🎨 MiX - Design System

Complete design system for the music streaming app with color palette, typography, components, and styling guidelines.

---

## 🎨 Color Palette

### Primary Colors

| Name | Color | Hex | Usage |
|------|-------|-----|-------|
| **Yellow** | 🟨 | `#FFED4E` | Buttons, active states, primary accents |
| **Purple** | 🟣 | `#9D4EDD` | Secondary accents, gradients |
| **Cyan** | 🔵 | `#00D9FF` | Hover states, interactive elements |
| **Lime** | 🟢 | `#39FF14` | Highlights, special accents |

### Background Colors

| Name | Color | Hex | Usage |
|------|-------|-----|-------|
| **Dark BG** | ⚫ | `#0A0A0A` | Main background |
| **Dark Secondary** | ⚫ | `#0F0F0F` | Card backgrounds |
| **Dark Tertiary** | ⚫ | `#1A1A1A` | Borders, inactive states |

### Neutral Colors

| Name | Color | Hex | Usage |
|------|-------|-----|-------|
| **White** | ⚪ | `#FFFFFF` | Text, icons |
| **Gray 300** | Gray | `#D1D5DB` | Secondary text |
| **Gray 400** | Gray | `#9CA3AF` | Tertiary text |

---

## 📝 Typography

### Font Family
- **Primary:** Geist (Google Font)
- **Monospace:** Geist Mono
- **Fallback:** system-ui, sans-serif

### Font Weights
- **Regular:** 400 (body text)
- **Medium:** 500 (labels, captions)
- **Semibold:** 600 (subheadings)
- **Bold:** 700 (headings)

### Font Sizes

| Scale | Size | Line Height | Usage |
|-------|------|-------------|-------|
| **xs** | 12px | 16px | Captions, small text |
| **sm** | 14px | 20px | Body text, labels |
| **base** | 16px | 24px | Default body |
| **lg** | 18px | 28px | Large text |
| **xl** | 20px | 28px | Section headers |
| **2xl** | 24px | 32px | Page headers |
| **3xl** | 30px | 36px | Large headers |
| **4xl** | 36px | 40px | Hero headers |
| **5xl** | 48px | 48px | Major headings |
| **6xl** | 60px | 60px | Hero titles |

---

## 🎯 Components

### Buttons

#### Primary Button (Yellow)
```tsx
className="bg-accent-yellow hover:bg-accent-cyan text-black font-semibold rounded-full px-6 py-2 transition-all duration-200 shadow-lg hover:shadow-glow"
```
- **Background:** Yellow
- **Hover:** Cyan
- **Text Color:** Black
- **Border Radius:** Full
- **Padding:** px-6 py-2

#### Secondary Button (Dark)
```tsx
className="bg-dark-tertiary hover:bg-dark-tertiary/60 text-white font-medium rounded-full px-6 py-2 transition-colors"
```
- **Background:** Dark Gray
- **Hover:** Lighter Gray
- **Text Color:** White
- **Use:** Cancel, secondary actions

#### Icon Button (Yellow Active)
```tsx
className="p-2 rounded-full text-accent-yellow hover:text-accent-cyan transition-colors"
```
- **Padding:** 2
- **Text Color:** Yellow (if active)
- **Hover:** Cyan
- **Use:** Player controls, toggles

### Cards

#### Song Card
```tsx
className="relative overflow-hidden rounded-xl bg-dark-tertiary/40 backdrop-blur-sm transition-all duration-300 hover:bg-dark-tertiary/60 hover:shadow-lg"
```
- **Border Radius:** xl (16px)
- **Background:** Transparent dark
- **Backdropfilter:** Blur
- **Hover:** Darker background, shadow

#### Playlist Card
```tsx
className="rounded-xl bg-gradient-to-br from-accent-yellow/20 to-accent-purple/20 border border-white/10 p-6 hover:border-accent-yellow transition-all"
```
- **Gradient:** Yellow to Purple
- **Border:** White with opacity
- **Hover Border:** Yellow

### Inputs

#### Search Input
```tsx
className="w-full rounded-full bg-dark-tertiary/60 pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:bg-dark-tertiary transition-all"
```
- **Border Radius:** Full
- **Background:** Transparent dark
- **Focus Ring:** Yellow
- **Placeholder:** Gray

#### Range Slider
```tsx
className="w-full h-1 bg-dark-tertiary rounded-lg appearance-none cursor-pointer accent-accent-yellow"
style={{
  background: `linear-gradient(to right, #FFED4E 0%, #FFED4E ${progress}%, #1A1A1A ${progress}%, #1A1A1A 100%)`
}}
```
- **Height:** 4px (h-1)
- **Color:** Yellow with gradient
- **Border Radius:** lg

### Navigation

#### Active Link
```tsx
className="flex items-center gap-3 rounded-lg px-4 py-3 bg-accent-yellow text-black shadow-lg font-medium transition-all duration-200"
```
- **Background:** Yellow
- **Text:** Black (high contrast)
- **Shadow:** Subtle shadow
- **Radius:** lg

#### Inactive Link
```tsx
className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-tertiary/50 transition-all duration-200"
```
- **Text:** Gray
- **Hover:** White text, dark background
- **Transition:** Smooth 200ms

---

## 🌈 Gradients

### Heading Gradient
```css
background: linear-gradient(to right, #FFED4E, #00D9FF, #39FF14);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```
**Colors:** Yellow → Cyan → Lime
**Use:** Major headings, hero text

### Logo Gradient
```css
background: linear-gradient(to bottom right, #FFED4E, #9D4EDD);
```
**Colors:** Yellow → Purple
**Use:** App logo, icons

### Button Gradient (Hover)
```css
background: linear-gradient(135deg, #FFED4E, #00D9FF);
```
**Colors:** Yellow → Cyan
**Use:** Button hover states

---

## 🎵 Component Library

### Player Bar

**Layout:**
```
[Track Info] [Controls] [Shuffle/Repeat/Volume]
```

**Colors:**
- **Play Button:** Yellow → Cyan on hover
- **Progress:** Yellow gradient
- **Text:** White primary, gray secondary
- **Icons:** Gray (white on hover)

**States:**
- **Playing:** Yellow button, animated
- **Paused:** Yellow button, static
- **Loading:** Yellow spinner

### Sidebar

**Structure:**
```
[Logo]
[Menu Links]
[Library Links]
[Playlists]
```

**Colors:**
- **Active Link:** Yellow background, black text
- **Hover Link:** Gray background
- **Logo:** Yellow-purple gradient
- **Text:** White/gray

### Song Grid

**Card Layout:**
```
[Album Art]
[Title]
[Artist]
[Hover Overlay with Controls]
```

**Hover Effects:**
- **Scale:** Slight zoom
- **Overlay:** Semi-transparent black
- **Buttons:** Yellow with cyan hover
- **Blur:** Backdrop blur effect

---

## 📐 Spacing & Sizing

### Padding
- **xs:** 2px (px-0.5)
- **sm:** 4px (px-1)
- **md:** 8px (px-2)
- **lg:** 12px (px-3)
- **xl:** 16px (px-4)
- **2xl:** 24px (px-6)
- **3xl:** 32px (px-8)

### Margins
- Same scale as padding
- Used for component spacing

### Border Radius
- **sm:** 4px (rounded)
- **md:** 8px (rounded-lg)
- **lg:** 12px (rounded-xl)
- **xl:** 16px (rounded-2xl)
- **full:** 9999px (rounded-full)

### Gaps
- Component spacing: 4px, 8px, 12px, 16px, 24px
- Grid gaps: 16px (gap-4)

---

## 🎨 Dark Mode (Default)

The entire app uses dark mode by default:
- **Text:** White on dark background
- **Backgrounds:** Black variations
- **Borders:** Subtle white borders with opacity
- **Shadows:** Subtle dark shadows

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Columns | Use Case |
|-----------|-------|---------|----------|
| **Mobile** | < 640px | 1 | Phones |
| **Tablet** | 640-1024px | 2 | Tablets |
| **Desktop** | 1024-1280px | 4 | Desktops |
| **Large** | > 1280px | 5 | Large screens |

---

## ✨ Effects & Animations

### Transitions
```css
transition: all 200ms ease-out;
transition: colors 300ms ease-in-out;
transition: transform 150ms cubic-bezier(0.4, 0, 0.6, 1);
```

### Shadows
- **Subtle:** `shadow` (0 1px 2px 0 rgba(0,0,0,0.05))
- **Light:** `shadow-lg` (0 10px 15px -3px rgba(0,0,0,0.1))
- **Glow:** Custom pink glow for hover
- **Glass:** `shadow-glass` for glassmorphism

### Hover Effects
- **Buttons:** Slight lift + color change
- **Cards:** Scale + shadow
- **Links:** Color change + underline (if applicable)
- **Icons:** Color change + slight rotation (on interactive icons)

### Loading Animation
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Shimmer Skeleton
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 🎯 Component Examples

### Yellow Button (Primary Action)
```tsx
<button className="bg-accent-yellow hover:bg-accent-cyan text-black font-semibold rounded-full px-6 py-2 transition-all">
  Play
</button>
```

### Active Navigation
```tsx
<a href="/home" className="bg-accent-yellow text-black px-4 py-3 rounded-lg font-medium">
  Home
</a>
```

### Gradient Text Heading
```tsx
<h1 className="bg-gradient-to-r from-accent-yellow via-accent-cyan to-accent-lime bg-clip-text text-transparent text-6xl font-bold">
  Discover Music
</h1>
```

### Song Card
```tsx
<div className="rounded-xl bg-dark-tertiary/40 hover:bg-dark-tertiary/60 p-4 transition-all">
  <img src="..." className="w-full rounded-lg" />
  <h3 className="text-white font-semibold mt-2">Song Title</h3>
  <p className="text-gray-400 text-sm">Artist Name</p>
</div>
```

### Progress Bar
```tsx
<input
  type="range"
  className="w-full accent-accent-yellow"
  style={{
    background: `linear-gradient(to right, #FFED4E 0%, #FFED4E 50%, #1A1A1A 50%, #1A1A1A 100%)`
  }}
/>
```

---

## 🎯 Best Practices

1. **Color Usage:**
   - Use yellow for primary actions
   - Use cyan for hover/interactive states
   - Use purple for secondary branding
   - Use lime for special highlights

2. **Typography:**
   - Headings: Bold (700) Geist
   - Body: Regular (400) Geist
   - Labels: Medium (500) Geist
   - Consistency in sizing

3. **Spacing:**
   - Consistent 4px grid
   - Generous padding on cards
   - Good breathing room between elements

4. **Components:**
   - Rounded corners for modern feel
   - Subtle shadows for depth
   - Backdrop blur for glassmorphism
   - Smooth transitions

5. **Accessibility:**
   - High contrast (yellow on black)
   - Clear focus states (yellow ring)
   - Readable font sizes
   - Proper button sizes (minimum 44px touch)

---

## 📦 Implementation Checklist

- [x] Color palette defined
- [x] Typography system set up
- [x] Component library documented
- [x] Responsive design tested
- [x] Dark mode implemented
- [x] Animations smooth
- [x] Accessibility checked
- [x] All files updated with new design
- [x] Build verified
- [x] Production ready

---

**Design System Version:** 1.0  
**Last Updated:** November 2, 2026  
**Status:** ✅ Production Ready
