# Saleel & Nishana — Online Muslim Wedding Invitation (React + Vite)

A mobile-first, responsive Muslim wedding invitation built with **React** and **Vite**.

## Getting Started

1. **Unzip** the project folder and open a terminal inside it.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run locally:**
   ```bash
   npm run dev
   ```
4. **Build for production (Vercel / Netlify / GitHub Pages):**
   ```bash
   npm run build
   ```
   The production files will be generated in the `dist/` folder.

## How to Customize

- **Names, Parents, Date, Venue, Map Link & Letters:** Edit `src/config.js`.
- **Music:** Put your `.mp3` file in a `public/` folder (e.g., `public/music.mp3`) and set `MUSIC_SRC: './music.mp3'` in `src/config.js` (or paste a base64 data URI). Leave `MUSIC_SRC: ''` to use the built-in soft ambient harp melody.
- **Background Template:** Replace `src/assets/template-bg.jpg` with any other image if desired.
- **Colors & Fonts:** Edit the CSS variables inside `:root` at the top of `src/styles.css`.
