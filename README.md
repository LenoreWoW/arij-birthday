# 🎉 Happy Birthday Arij - Immersive Web Experience

A stunning, artistic 3D birthday website created for Arij, featuring immersive Three.js visualizations, smooth animations, and an elegant design inspired by Immersive Gardens.

![Birthday Website Preview](https://img.shields.io/badge/Built%20with-React%20%2B%20Three.js-61dafb?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=for-the-badge)

## ✨ Features

### 🎨 Visual Design
- **Immersive Gardens Inspired** - Gallery-like aesthetic with elegant typography
- **3D Animations** - Audio-reactive visualizations using Three.js
- **Smooth Scrolling** - Butter-smooth scroll experience with Lenis
- **Parallax Effects** - Multi-layer depth throughout the site
- **Responsive Design** - Perfect on mobile, tablet, and desktop

### 🎵 Audio Experience
- **Music Intro** - Engaging audio-driven introduction
- **Audio Visualization** - 3D elements react to music frequencies
- **Beat Detection** - Animations sync with music beats
- **Web Audio API** - Professional-grade audio analysis

### 🎭 Sections
1. **Intro Screen** - Click-to-enter with particle background
2. **Hero Section** - Dramatic 3D sculpture with elegant typography
3. **Photo Gallery** - Masonry grid with parallax scrolling
4. **Message Section** - Heartfelt birthday message
5. **Timeline** - Memories and milestones with animations
6. **Celebration** - Confetti animation and final wishes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (currently you have v18.20.8)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd arij-birthday

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The site will open at `http://localhost:5173`

## 🎵 Audio Setup

**IMPORTANT:** Add a birthday music file before deploying!

1. Create the audio directory:
   ```bash
   mkdir -p public/audio
   ```

2. Add your music file:
   ```bash
   cp /path/to/your/music.mp3 public/audio/birthday-music.mp3
   ```

See [AUDIO_SETUP.md](AUDIO_SETUP.md) for detailed audio configuration.

## 🛠️ Tech Stack

### Core
- **React 18** - UI framework
- **Vite** - Build tool and dev server

### 3D & Animation
- **Three.js** - WebGL 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects (bloom, etc.)

### Animation & Scroll
- **GSAP** - Professional animation library
- **Lenis** - Smooth scroll library
- **ScrollTrigger** - Scroll-based animations

### Styling
- **CSS3** - Custom styles with variables
- **Google Fonts** - Playfair Display, Inter, Dancing Script

## 📁 Project Structure

```
arij-birthday/
├── public/
│   ├── audio/                    # Audio files go here
│   │   └── birthday-music.mp3    # Main background music
│   └── images/                   # Image assets
├── src/
│   ├── components/
│   │   ├── intro/                # Intro screen components
│   │   │   ├── IntroScreen.jsx
│   │   │   └── ParticleBackground.jsx
│   │   ├── three/                # Three.js 3D components
│   │   │   ├── Scene.jsx
│   │   │   ├── AudioVisualizer.jsx
│   │   │   └── HeroSculpture.jsx
│   │   ├── sections/             # Content sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── PhotoGallery.jsx
│   │   │   ├── MessageSection.jsx
│   │   │   ├── Timeline.jsx
│   │   │   └── CelebrationSection.jsx
│   │   └── MainContent.jsx       # Main content wrapper
│   ├── utils/
│   │   ├── AudioManager.js       # Web Audio API manager
│   │   └── SmoothScroll.js       # Lenis scroll integration
│   ├── shaders/
│   │   └── audioReactive.js      # Custom GLSL shaders
│   ├── styles/                   # CSS files
│   │   ├── global.css
│   │   ├── IntroScreen.css
│   │   ├── HeroSection.css
│   │   ├── PhotoGallery.css
│   │   ├── MessageSection.css
│   │   ├── Timeline.css
│   │   ├── CelebrationSection.css
│   │   └── index.css
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global imports
├── index.html                    # HTML template
├── package.json                  # Dependencies
└── vite.config.js               # Vite configuration
```

## 🎨 Customization

### Colors
Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --color-cream: #ebe9e5;
  --color-dark: #1a1a1a;
  --color-gold: #d4af37;
  --color-blush: #e8b4b8;
  --color-purple: #8338ec;
}
```

### Fonts
Current fonts are defined in `index.html`. Change the Google Fonts link to use different fonts.

### Content

#### Edit Personal Message
File: `src/components/sections/MessageSection.jsx`

#### Edit Timeline Milestones
File: `src/components/sections/Timeline.jsx`

#### Add Photos
1. Place images in `public/images/`
2. Update image paths in `src/components/sections/PhotoGallery.jsx`

## 🏗️ Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

Build output will be in the `dist/` directory.

## 🌐 Deployment

### Option 1: Netlify (Recommended)

1. Push your code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

**Netlify drag-and-drop:**
```bash
npm run build
# Drag the 'dist' folder to Netlify
```

### Option 2: Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will auto-detect Vite settings.

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/arij-birthday",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/arij-birthday/',
     plugins: [react()]
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Any Static Host

After running `npm run build`, upload the `dist/` folder to:
- Firebase Hosting
- AWS S3
- Cloudflare Pages
- Render
- Surge.sh

## 🐛 Troubleshooting

### Build Warnings About Node Version
You're on Node v18.20.8. The project works fine but Vite recommends Node 20+. You can ignore these warnings.

### Audio Not Playing
1. Check that `public/audio/birthday-music.mp3` exists
2. Check browser console for errors
3. Try a different browser (Chrome recommended)
4. Ensure user clicked "Click to Begin" (browsers block autoplay)

### Three.js Performance Issues
1. Reduce particle count in `AudioVisualizer.jsx`
2. Lower quality settings in `Scene.jsx`
3. Disable post-processing effects
4. Test on a different device

### Smooth Scroll Not Working
- Clear browser cache
- Check that Lenis is properly initialized
- Ensure no conflicting scroll libraries

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note:** Best experience on desktop Chrome with hardware acceleration enabled.

## 🎯 Performance Tips

1. **Optimize Images**: Use WebP format, max 1920px width
2. **Compress Audio**: Use 128-192 kbps MP3 or AAC
3. **Enable Gzip**: Most hosts do this automatically
4. **Use CDN**: For faster global loading

## 📄 License

This is a personal birthday gift. Feel free to use as inspiration for your own projects!

## 🙏 Credits

**Design Inspiration:**
- Immersive Gardens (https://immersive-g.com/)

**Technologies:**
- React Team
- Three.js Community
- GSAP by GreenSock
- Lenis by Studio Freight

**Created with ❤️ for Arij's Birthday**

---

## 🎁 Final Steps Before Sending

- [ ] Add birthday music to `public/audio/birthday-music.mp3`
- [ ] Replace placeholder photos in gallery (optional)
- [ ] Customize the personal message
- [ ] Update timeline with real memories
- [ ] Test on mobile device
- [ ] Build and deploy
- [ ] Send the link to Arij! 🎉

---

**Happy Birthday, Arij!** 🎂✨

May this website bring a smile to your face and celebrate the amazing art director you are!
