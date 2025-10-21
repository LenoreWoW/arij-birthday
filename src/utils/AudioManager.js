/**
 * AudioManager - Complete audio management class with Web Audio API
 * Handles audio playback, analysis, beat detection, and frequency bands
 */
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioElement = null;
    this.source = null;
    this.analyser = null;
    this.gainNode = null;

    // Analysis data
    this.dataArray = null;
    this.bufferLength = 0;

    // Beat detection
    this.beatThreshold = 1.3;
    this.beatDecayRate = 0.98;
    this.beatMinInterval = 200; // ms
    this.lastBeatTime = 0;
    this.beatHoldFrames = 0;
    this.beatCutoff = 0;
    this.beatAverage = 0;

    // Frequency bands (0-255 frequency bins)
    this.frequencyBands = {
      bass: { start: 0, end: 10 },      // 0-250Hz
      lowMid: { start: 10, end: 40 },   // 250-1kHz
      mid: { start: 40, end: 120 },     // 1kHz-3kHz
      highMid: { start: 120, end: 200 }, // 3kHz-6kHz
      treble: { start: 200, end: 255 }  // 6kHz+
    };

    // Loading state
    this.isLoaded = false;
    this.isPlaying = false;
    this.loadProgress = 0;

    // Animation frame
    this.animationFrameId = null;
  }

  /**
   * Initialize audio context and load audio file
   * @param {string} audioUrl - URL of the audio file to load
   * @returns {Promise} Resolves when audio is loaded
   */
  async init(audioUrl) {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create audio element
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.loop = true;

      // Track loading progress
      this.audioElement.addEventListener('progress', () => {
        if (this.audioElement.buffered.length > 0) {
          const buffered = this.audioElement.buffered.end(0);
          const duration = this.audioElement.duration;
          this.loadProgress = duration ? (buffered / duration) * 100 : 0;
        }
      });

      // Load audio file
      await new Promise((resolve, reject) => {
        this.audioElement.addEventListener('canplaythrough', resolve, { once: true });
        this.audioElement.addEventListener('error', reject, { once: true });
        this.audioElement.src = audioUrl;
        this.audioElement.load();
      });

      // Create audio nodes
      this.source = this.audioContext.createMediaElementSource(this.audioElement);
      this.analyser = this.audioContext.createAnalyser();
      this.gainNode = this.audioContext.createGain();

      // Configure analyser
      this.analyser.fftSize = 512; // 256 frequency bins
      this.analyser.smoothingTimeConstant = 0.8;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);

      // Connect audio graph: source -> analyser -> gain -> destination
      this.source.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Set initial volume
      this.gainNode.gain.value = 0.7;

      this.isLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  /**
   * Play audio
   * @returns {Promise}
   */
  async play() {
    if (!this.isLoaded) {
      throw new Error('Audio not loaded. Call init() first.');
    }

    try {
      // Resume audio context if suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      await this.audioElement.play();
      this.isPlaying = true;
      this.startAnalysis();
      return true;
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  /**
   * Pause audio
   */
  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
      this.stopAnalysis();
    }
  }

  /**
   * Stop audio and reset
   */
  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
      this.stopAnalysis();
    }
  }

  /**
   * Fade out audio
   * @param {number} duration - Fade duration in milliseconds
   * @returns {Promise}
   */
  async fadeOut(duration = 2000) {
    if (!this.gainNode) return;

    const startVolume = this.gainNode.gain.value;
    const startTime = this.audioContext.currentTime;
    const endTime = startTime + (duration / 1000);

    this.gainNode.gain.linearRampToValueAtTime(0, endTime);

    return new Promise(resolve => {
      setTimeout(() => {
        this.stop();
        this.gainNode.gain.value = startVolume;
        resolve();
      }, duration);
    });
  }

  /**
   * Fade in audio
   * @param {number} duration - Fade duration in milliseconds
   * @param {number} targetVolume - Target volume (0-1)
   * @returns {Promise}
   */
  async fadeIn(duration = 2000, targetVolume = 0.7) {
    if (!this.gainNode) return;

    this.gainNode.gain.value = 0;
    const startTime = this.audioContext.currentTime;
    const endTime = startTime + (duration / 1000);

    await this.play();
    this.gainNode.gain.linearRampToValueAtTime(targetVolume, endTime);
  }

  /**
   * Set volume
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get current frequency data
   * @returns {Uint8Array} Frequency data array
   */
  getFrequencyData() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
    return new Uint8Array(0);
  }

  /**
   * Get frequency data for specific band
   * @param {string} band - Band name (bass, lowMid, mid, highMid, treble)
   * @returns {number} Average frequency value (0-255)
   */
  getFrequencyBand(band) {
    const bandRange = this.frequencyBands[band];
    if (!bandRange || !this.dataArray) return 0;

    const { start, end } = bandRange;
    let sum = 0;
    let count = 0;

    for (let i = start; i < end && i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
      count++;
    }

    return count > 0 ? sum / count : 0;
  }

  /**
   * Get all frequency bands
   * @returns {Object} Object with all band values
   */
  getAllBands() {
    this.getFrequencyData();

    return {
      bass: this.getFrequencyBand('bass'),
      lowMid: this.getFrequencyBand('lowMid'),
      mid: this.getFrequencyBand('mid'),
      highMid: this.getFrequencyBand('highMid'),
      treble: this.getFrequencyBand('treble')
    };
  }

  /**
   * Detect if a beat is occurring
   * @returns {boolean} True if beat detected
   */
  detectBeat() {
    if (!this.dataArray) return false;

    // Calculate average bass frequency
    const bassValue = this.getFrequencyBand('bass');

    // Update beat average with decay
    this.beatAverage = this.beatAverage * this.beatDecayRate + bassValue * (1 - this.beatDecayRate);

    // Check if current bass exceeds threshold
    const isBeat = bassValue > this.beatAverage * this.beatThreshold;

    // Prevent multiple detections in short time
    const now = Date.now();
    const timeSinceLastBeat = now - this.lastBeatTime;

    if (isBeat && timeSinceLastBeat > this.beatMinInterval) {
      this.lastBeatTime = now;
      this.beatHoldFrames = 3; // Hold beat for 3 frames
      return true;
    }

    // Hold beat for a few frames for smoother animation
    if (this.beatHoldFrames > 0) {
      this.beatHoldFrames--;
      return true;
    }

    return false;
  }

  /**
   * Get overall audio level (0-1)
   * @returns {number} Audio level
   */
  getLevel() {
    if (!this.dataArray) return 0;

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return (sum / this.dataArray.length) / 255;
  }

  /**
   * Get normalized frequency data (0-1)
   * @returns {Array<number>} Normalized frequency array
   */
  getNormalizedFrequencyData() {
    this.getFrequencyData();
    return Array.from(this.dataArray).map(value => value / 255);
  }

  /**
   * Start continuous analysis
   */
  startAnalysis() {
    const analyze = () => {
      if (this.isPlaying) {
        this.getFrequencyData();
        this.animationFrameId = requestAnimationFrame(analyze);
      }
    };
    analyze();
  }

  /**
   * Stop continuous analysis
   */
  stopAnalysis() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current playback time
   * @returns {number} Current time in seconds
   */
  getCurrentTime() {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  /**
   * Get audio duration
   * @returns {number} Duration in seconds
   */
  getDuration() {
    return this.audioElement ? this.audioElement.duration : 0;
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in seconds
   */
  seek(time) {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(time, this.getDuration()));
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();
    this.stopAnalysis();

    if (this.source) {
      this.source.disconnect();
    }
    if (this.analyser) {
      this.analyser.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.audioContext = null;
    this.audioElement = null;
    this.source = null;
    this.analyser = null;
    this.gainNode = null;
    this.dataArray = null;
  }
}

export default AudioManager;
