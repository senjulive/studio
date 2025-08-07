# AstralCore Hyperdrive - Static Deployment

## 🚀 Overview

This is a static HTML/CSS/JavaScript version of the AstralCore Hyperdrive trading platform, optimized for Netlify deployment via ZIP upload.

## ✨ Features

- **Advanced Particle System**: 80+ animated particles with different colors and behaviors
- **Neural Network Visualization**: SVG-based animated neural pathways with glowing effects
- **Hyperdrive Animations**: Smooth CSS animations including floating, spinning, and pulsing effects
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Interactive Elements**: Hover effects, click animations, and scroll-based parallax
- **Performance Optimized**: Intersection Observer for efficient animations
- **Accessibility Ready**: Keyboard navigation and reduced motion support

## 📁 File Structure

```
astralcore-hyperdrive/
├── index.html          # Main HTML file
├── styles.css          # Complete CSS with animations
├��─ script.js           # Interactive JavaScript functionality
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## 🚀 Deployment Instructions

### Option 1: Netlify Drag & Drop (Recommended)

1. **Create ZIP File**:
   - Select all files: `index.html`, `styles.css`, `script.js`, `netlify.toml`
   - Create a ZIP archive named `astralcore-hyperdrive.zip`

2. **Deploy to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the ZIP file to the deployment area
   - Your site will be live in seconds!

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir .
```

### Option 3: Git Repository

1. Push files to a Git repository
2. Connect the repository to Netlify
3. Set build command: (leave empty)
4. Set publish directory: `.` (root)

## 🎨 Customization

### Colors
The design uses a cyberpunk color palette:
- **Primary Blue**: `rgb(99, 102, 241)`
- **Purple**: `rgb(147, 51, 234)`
- **Cyan**: `rgb(6, 182, 212)`
- **Violet**: `rgb(139, 69, 219)`

### Animations
All animations use CSS custom properties and can be easily modified:
- `hyperdriveFloat`: Orbital particle movement
- `hyperdriveSpinSlow`: Rotating geometric shapes
- `neuralPulse`: Neural network pulsing
- `statusPulse`: Status indicator animations

### Particles
Modify particle count in `script.js`:
```javascript
const particleCount = 80; // Change this number
```

## 🔧 Technical Details

- **Framework**: Vanilla HTML/CSS/JavaScript (No dependencies)
- **Fonts**: Inter from Google Fonts
- **Icons**: Unicode emojis for maximum compatibility
- **Browser Support**: Modern browsers (ES6+)
- **Performance**: Optimized with Intersection Observer and requestAnimationFrame

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance Features

- Lazy-loaded animations
- Reduced motion support
- Optimized particle system
- Efficient scroll handling
- Minimal DOM manipulation

## 🔒 Security Headers

The included `netlify.toml` sets up security headers:
- Content Security Policy
- X-Frame-Options
- X-XSS-Protection
- Referrer Policy

## 🌟 Live Demo Features

- **Status Indicators**: Real-time simulation of system status
- **Interactive Metrics**: Dynamic performance statistics
- **Particle System**: Mouse interaction with floating particles
- **Theme Toggle**: Light/Dark mode switcher
- **Scroll Effects**: Parallax background movement

## 📊 Analytics Ready

The site is ready for analytics integration. Add your tracking code to `index.html` before the closing `</body>` tag.

## 🎨 Brand Consistency

All branding uses "Hyperdrive" terminology:
- ✅ Hyperdrive Neural AI
- ✅ Hyperdrive Trading Engine
- ✅ Hyperdrive Security Matrix
- ✅ Hyperdrive v5.0

## 📞 Support

For deployment issues or customizations, the static site includes:
- Error handling and console logging
- Performance monitoring
- Accessibility features
- Mobile optimization

---

**AstralCore Hyperdrive v5.0** - The Future of Trading Technology ⭐

Built with 💜 for the next generation of traders.
