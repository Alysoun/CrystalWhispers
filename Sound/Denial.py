import numpy as np
from scipy.io.wavfile import write

def generate_chord(frequencies, duration, sample_rate=44100, amplitude=0.5):
    """Generate a chord as a combination of sine waves for given frequencies."""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    chord = sum(amplitude * np.sin(2 * np.pi * freq * t) for freq in frequencies)
    chord = chord / max(abs(chord))  # Normalize the waveform
    return chord

def create_dazed_wav(output_file, duration_minutes=2, sample_rate=44100):
    """Generate a .wav file with an 8-chord dazed progression."""
    duration = duration_minutes * 60  # Convert minutes to seconds
    chord_duration = 4  # Duration of each chord in seconds
    num_chords = int(duration / chord_duration)
    
    # Define the 8-chord progression (frequencies in Hz)
    progression = [
        [220.0, 261.63, 329.63],  # A minor (A, C, E)
        [174.61, 220.0, 261.63],  # F major (F, A, C)
        [130.81, 164.81, 196.0],  # C major (C, E, G)
        [98.0, 123.47, 146.83],   # G major (G, B, D)
        [146.83, 174.61, 220.0],  # D minor (D, F, A)
        [164.81, 207.65, 246.94], # E major (E, G#, B)
        [174.61, 220.0, 261.63],  # F major (F, A, C)
        [98.0, 123.47, 146.83]    # G major (G, B, D)
    ]
    
    # Generate the waveform for each chord in the progression
    audio = np.array([])
    for i in range(num_chords):
        chord = progression[i % len(progression)]
        audio = np.concatenate((audio, generate_chord(chord, chord_duration, sample_rate)))

    # Normalize and scale to 16-bit integer range
    audio = (audio * 32767).astype(np.int16)
    
    # Save as .wav file
    write(output_file, sample_rate, audio)
    return output_file

# Create the .wav file
output_path = "dazed_denial.wav"
create_dazed_wav(output_path, duration_minutes=2)