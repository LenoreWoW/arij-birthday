# Audio Setup Instructions

## Required Audio File

The website requires a background music file to play during the intro and throughout the experience.

### File Location
Place your audio file here:
```
/public/audio/birthday-music.mp3
```

### Supported Formats
- **Recommended**: MP3 or M4A (AAC)
- File size: Keep under 5MB for fast loading
- Duration: 2-5 minutes (it will loop automatically)

### Where to Get Birthday Music

1. **Free Options:**
   - YouTube Audio Library (search "happy birthday instrumental")
   - Free Music Archive: https://freemusicarchive.org/
   - Incompetech: https://incompetech.com/music/royalty-free/

2. **Premium Options:**
   - Epidemic Sound
   - Artlist
   - AudioJungle

3. **Custom Option:**
   - Record a personal birthday message or create a custom mix

### Quick Setup Steps

1. Create the audio directory if it doesn't exist:
   ```bash
   mkdir -p public/audio
   ```

2. Add your music file:
   ```bash
   cp /path/to/your/music.mp3 public/audio/birthday-music.mp3
   ```

3. The website will automatically load and play it!

### Optional: Change the Audio File Path

If you want to use a different filename or location, edit `src/App.jsx` line 42:

```javascript
await audioManagerRef.current.init('/audio/birthday-music.mp3');
```

Change `/audio/birthday-music.mp3` to your desired path.

### Testing Without Audio

The website will work perfectly fine without audio - it will simply skip the music playback and continue with the visual experience. No errors will occur.

### Audio Requirements

- **Format**: MP3, M4A (AAC), or OGG
- **Bitrate**: 128-192 kbps recommended
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Channels**: Stereo preferred

### Troubleshooting

**Audio doesn't play?**
- Check browser console for errors
- Ensure the file path is correct
- Try a different browser (Chrome works best)
- Check file permissions

**Audio is too loud/quiet?**
- The website has built-in volume control
- Or adjust the source file volume before adding it

**Want to disable audio entirely?**
Comment out lines 40-47 in `src/App.jsx`
