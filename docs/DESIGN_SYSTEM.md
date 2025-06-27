# Design System Documentation

**AI News Scraper - Custom CSS Design System**  
**Version**: 3.0  
**Last Updated**: June 27, 2025

## 🎨 **Overview**

The AI News Scraper uses a modern, custom CSS design system built without any build tool dependencies. This approach provides better performance, easier maintenance, and faster development cycles while delivering a professional, responsive user experience.

## 🏗️ **Architecture**

### **Core Principles**
- **No Build Tools**: Pure CSS without PostCSS, Tailwind, or complex build steps
- **CSS Custom Properties**: Centralized design tokens for consistency
- **Mobile-First**: Responsive design starting from mobile devices
- **Component-Based**: Reusable CSS classes for common UI patterns
- **Performance-Focused**: Optimized CSS bundle without framework overhead
- **Maintainable**: Clear naming conventions and organized structure

### **File Structure**
```
pwa/src/index.css          # Complete design system
├── CSS Custom Properties  # Design tokens
├── Reset & Base Styles    # Normalize and base styles
├── Layout Components      # Container, grid, flex utilities
├── Component Classes      # Buttons, cards, navigation
├── Typography System      # Text sizing and styling
├── Theme System          # Dark/light mode variables
├── Responsive Utilities   # Breakpoint-specific styles
└── Animations            # Smooth transitions and effects
```

## 🎯 **Design Tokens**

### **CSS Custom Properties**
All design tokens are defined as CSS custom properties in the `:root` selector:

```css
:root {
  /* Colors - Light Theme */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-light: #dbeafe;
  
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-surface-hover: #f3f4f6;
  
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  
  --color-border: #e5e7eb;
  --color-border-hover: #d1d5db;
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem;  /* 36px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Border Radius */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Fully rounded */
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### **Dark Theme Override**
Dark theme is implemented by overriding specific CSS custom properties:

```css
[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-surface-hover: #374151;
  
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;
  
  --color-border: #374151;
  --color-border-hover: #4b5563;
  
  --color-primary-light: rgba(59, 130, 246, 0.1);
}
```

## 📐 **Layout System**

### **Container**
Centered container with responsive padding:

```css
.container {
  max-width: 72rem;        /* 1152px */
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 640px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--spacing-xl);
  }
}
```

### **Grid System**
CSS Grid with responsive breakpoints:

```css
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive Grid */
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

### **Flexbox Utilities**
Common flexbox patterns:

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }
```

## 🎨 **Component System**

### **Button Components**
Comprehensive button system with variants:

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  outline: none;
}

.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
}

.btn-icon {
  padding: var(--spacing-sm);
  width: 2.5rem;
  height: 2.5rem;
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
}
```

### **Card Components**
Flexible card system for content containers:

```css
.card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card-hover:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-body-lg {
  padding: var(--spacing-xl);
}
```

### **Navigation Components**
Header and navigation styling:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-normal);
  cursor: pointer;
  border: none;
  background: none;
}

.nav-item:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.nav-item.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}
```

## 📱 **Responsive Design**

### **Breakpoints**
Mobile-first responsive breakpoints:

```css
/* Mobile: Default (< 640px) */
/* Tablet: 640px - 1024px */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### **Responsive Utilities**
Hide/show elements at different breakpoints:

```css
.hidden { display: none; }

.nav-desktop {
  display: none;
}

@media (min-width: 768px) {
  .nav-desktop {
    display: flex;
  }
}

.nav-mobile {
  display: flex;
}

@media (min-width: 768px) {
  .nav-mobile {
    display: none;
  }
}
```

### **Responsive Typography**
Text sizing that adapts to screen size:

```css
.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
}
```

## 🎭 **Theme System**

### **Theme Implementation**
Theme switching is handled via data attributes:

```javascript
// Theme switching logic
const toggleTheme = () => {
  const newTheme = !isDarkMode;
  setIsDarkMode(newTheme);
  
  if (newTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  localStorage.setItem('theme', newTheme ? 'dark' : 'light');
};
```

### **Theme-Aware Components**
Components automatically adapt to theme changes:

```css
.badge-business {
  background-color: #dcfce7;
  color: #166534;
}

[data-theme="dark"] .badge-business {
  background-color: rgba(22, 101, 52, 0.2);
  color: #86efac;
}
```

## ✨ **Animations**

### **Keyframe Animations**
Smooth animations for enhanced UX:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
```

### **Loading Spinner**
CSS-only loading animation:

```css
.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 🎯 **Specialized Components**

### **Article Cards**
Custom styling for news article display:

```css
.article-card {
  cursor: pointer;
  transition: all var(--transition-normal);
}

.article-card:hover .article-title {
  color: var(--color-primary);
}

.article-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
  transition: color var(--transition-normal);
}

.read-more {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-top: var(--spacing-md);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.article-card:hover .read-more {
  opacity: 1;
}
```

### **Filter Tabs**
Interactive filter system:

```css
.filter-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.filter-tab.active {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.filter-tab:not(.active) {
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
}
```

## 🔧 **Utility Classes**

### **Spacing Utilities**
Consistent spacing throughout the app:

```css
.space-y > * + * {
  margin-top: var(--spacing-xl);
}

.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.mb-xl { margin-bottom: var(--spacing-xl); }
```

### **Typography Utilities**
Text styling and sizing:

```css
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }
.text-4xl { font-size: var(--font-size-4xl); }

.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-center { text-align: center; }

.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-muted { color: var(--color-text-muted); }
.text-blue { color: var(--color-primary); }
```

## ♿ **Accessibility**

### **Focus Management**
Proper focus indicators for keyboard navigation:

```css
*:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:focus,
a:focus {
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 🚀 **Performance**

### **Optimization Strategies**
- **No Framework Overhead**: Pure CSS without external dependencies
- **CSS Custom Properties**: Efficient theme switching without JavaScript
- **Minimal Bundle**: Only the CSS that's actually used
- **Fast Builds**: No PostCSS or Tailwind compilation
- **Better Caching**: CSS can be cached independently

### **Best Practices**
- Use CSS custom properties for consistent theming
- Leverage CSS Grid and Flexbox for layouts
- Implement mobile-first responsive design
- Use semantic HTML with CSS classes for styling
- Maintain consistent naming conventions

## 🛠️ **Development Guidelines**

### **Adding New Components**
1. Define component-specific CSS classes
2. Use CSS custom properties for values
3. Include hover and focus states
4. Test across all breakpoints
5. Ensure dark theme compatibility

### **Naming Conventions**
- **Components**: `.component-name` (e.g., `.btn`, `.card`)
- **Modifiers**: `.component-modifier` (e.g., `.btn-primary`, `.card-hover`)
- **Utilities**: `.utility-name` (e.g., `.text-center`, `.flex`)
- **States**: `.component.state` (e.g., `.nav-item.active`)

### **CSS Organization**
1. CSS Custom Properties (design tokens)
2. Reset and base styles
3. Layout components
4. UI components
5. Utility classes
6. Responsive overrides
7. Animations and transitions

---

**Design System Status**: ✅ **Complete and Production Ready**  
**Performance**: ✅ **Optimized without build tool overhead**  
**Accessibility**: ✅ **WCAG compliant focus management**  
**Responsive**: ✅ **Mobile-first design with desktop enhancements**  
**Maintainable**: ✅ **Clear structure and naming conventions**
