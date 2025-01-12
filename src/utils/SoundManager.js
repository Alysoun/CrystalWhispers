class SoundManager {
  constructor() {
    this.muted = localStorage.getItem('soundMuted') === 'true';
    this.volume = parseFloat(localStorage.getItem('soundVolume')) || 0.5;
    this.audioContext = null;
  }

  // Initialize audio context on first user interaction
  initializeAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  generateTone(type, frequency, duration, volume = 1) {
    if (this.muted || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Create an envelope for smoother sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * this.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  play(soundName) {
    if (this.muted || !this.audioContext) return;
    
    switch (soundName) {
      case 'achievement':
        // Happy ascending chime
        this.generateTone('sine', 440, 0.1, 0.3);  // A4
        setTimeout(() => this.generateTone('sine', 554.37, 0.1, 0.3), 100);  // C#5
        setTimeout(() => this.generateTone('sine', 659.25, 0.2, 0.3), 200);  // E5
        break;

      case 'puzzle_solve':
        // Triumphant chord
        this.generateTone('sine', 523.25, 0.3, 0.2);  // C5
        this.generateTone('sine', 659.25, 0.3, 0.2);  // E5
        this.generateTone('sine', 783.99, 0.3, 0.2);  // G5
        break;

      case 'puzzle_fail':
        // Descending error sound
        this.generateTone('square', 330, 0.1, 0.2);  // E4
        setTimeout(() => this.generateTone('square', 247, 0.2, 0.2), 100);  // B3
        break;

      case 'collect_fragment':
        // Short sparkle sound
        this.generateTone('sine', 1200, 0.05, 0.2);
        setTimeout(() => this.generateTone('sine', 1400, 0.05, 0.2), 50);
        break;

      case 'purchase':
        // Success chime
        this.generateTone('sine', 587.33, 0.1, 0.2);  // D5
        setTimeout(() => this.generateTone('sine', 880, 0.2, 0.2), 100);  // A5
        break;

      case 'error':
        // Quick buzz
        this.generateTone('square', 140, 0.15, 0.2);
        break;
    }
  }

  setVolume(volume) {
    this.volume = volume;
    localStorage.setItem('soundVolume', volume);
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('soundMuted', this.muted);
    // Initialize audio if unmuting
    if (!this.muted) {
      this.initializeAudio();
    }
  }
}

export const soundManager = new SoundManager(); 