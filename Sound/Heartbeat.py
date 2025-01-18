import numpy as np
import simpleaudio as sa
import sys

def generate_tone(frequency, duration, amplitude=0.2, sample_rate=44100, fade_out=False):
    """Generate a tone of given frequency and duration with optional fade-out."""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    wave = amplitude * np.sin(2 * np.pi * frequency * t)

    # Apply fade-out if enabled
    if fade_out:
        fade_duration = int(sample_rate * 7.0)  # Fade out over the last 3 seconds
        fade = np.linspace(1, 0, fade_duration)
        sustain = np.ones(len(wave) - fade_duration)
        envelope = np.concatenate((sustain, fade))
        wave *= envelope
    return wave

def play_flatline(sample_rate=44100):
    """Play a flatline sound."""
    flatline = generate_tone(
        frequency=783.99,  # Same frequency as G5
        duration=10.0,     # 10 seconds
        amplitude=0.15,    # Softer volume
        sample_rate=sample_rate,
        fade_out=True      # Apply fade-out
    )
    audio = (flatline * 32767).astype(np.int16)
    play_obj = sa.play_buffer(audio, 1, 2, sample_rate)
    play_obj.wait_done()

def play_heartbeat(stage, sample_rate=44100):
    """Play a heartbeat sequence based on the stage of grief."""
    # Stage configurations (same frequency, varying timing)
    stage_config = {
        "Denial": {"frequency": 783.99, "duration": 0.2, "pause": 0.6, "beats": 5},
        "Anger": {"frequency": 783.99, "duration": 0.1, "pause": [0.2, 0.4], "beats": 8},
        "Bargaining": {"frequency": 783.99, "duration": 0.15, "pause": [0.3, 0.7], "beats": 6},
        "Depression": {"frequency": 783.99, "duration": 0.4, "pause": 1.5, "beats": 4},
        "Acceptance": {"frequency": 783.99, "duration": 0.2, "pause": 0.8, "beats": 4, "flatline": True},
    }

    # Check for valid stage, including Flatline
    if stage not in stage_config and stage != "Flatline":
        print(f"Invalid stage: {stage}. Valid stages are: Denial, Anger, Bargaining, Depression, Acceptance, Flatline")
        return

    # Play flatline separately
    if stage == "Flatline":
        play_flatline(sample_rate)
        return

    config = stage_config[stage]
    audio = np.array([])
    
    # Generate heartbeat sequence
    for i in range(config["beats"]):
        # Generate the beep
        beep = generate_tone(
            config["frequency"], config["duration"], amplitude=0.2, sample_rate=sample_rate
        )
        # Handle dynamic pause (e.g., Anger, Bargaining)
        pause_duration = config["pause"][i % len(config["pause"])] if isinstance(config["pause"], list) else config["pause"]
        pause = np.zeros(int(sample_rate * pause_duration))
        # Append beep and pause
        audio = np.concatenate((audio, beep, pause))

    # Add flatline for Acceptance stage
    if stage == "Acceptance" and config.get("flatline", False):
        flatline = generate_tone(
            config["frequency"], 10.0, amplitude=0.15, sample_rate=sample_rate, fade_out=True
        )
        audio = np.concatenate((audio, flatline))

    # Convert to 16-bit audio and play
    audio = (audio * 32767).astype(np.int16)
    play_obj = sa.play_buffer(audio, 1, 2, sample_rate)
    play_obj.wait_done()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python heartbeat.py <stage>")
        print("Valid stages are: Denial, Anger, Bargaining, Depression, Acceptance, Flatline")
    else:
        stage = sys.argv[1]
        play_heartbeat(stage)
