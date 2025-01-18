import mido
from mido import MidiFile, MidiTrack, Message

def create_midi_for_stage(stage, output_file, duration_minutes=2):
    """Generate structured MIDI music for a specific stage of grief with precise duration."""
    mid = MidiFile()  # Create a new MIDI file
    track = MidiTrack()  # Add a new track
    mid.tracks.append(track)

    # Set the tempo (BPM varies by stage)
    tempos = {
        "Denial": 80,
        "Anger": 120,
        "Bargaining": 90,
        "Depression": 50,
        "Acceptance": 70
    }
    bpm = tempos[stage]
    tempo = mido.bpm2tempo(bpm)
    track.append(mido.MetaMessage('set_tempo', tempo=tempo))

    # Define instrument program numbers (General MIDI)
    instruments = {
        "Denial": 89,  # Celesta for ethereal feel
        "Anger": 29,   # Overdriven Guitar for intensity
        "Bargaining": 48,  # Strings for emotional depth
        "Depression": 45,  # Tremolo Strings for somber tone
        "Acceptance": 14   # Tubular Bells for resolution
    }
    track.append(Message('program_change', program=instruments[stage], time=0))

    # Define fixed chord progressions for each stage
    progressions = {
        "Denial": [[57, 60, 64], [53, 57, 60], [48, 52, 55], [43, 47, 50]],  # Am → F → C → G
        "Anger": [[57, 60, 63], [55, 59, 62], [53, 57, 60], [52, 55, 59]],  # Am → G → F → Em
        "Bargaining": [[57, 60, 67], [50, 57, 62], [55, 59, 62], [48, 52, 55]],  # Am7 → D7 → G → Cmaj7
        "Depression": [[57, 60, 64], [52, 55, 59], [50, 53, 57], [53, 57, 60]],  # Am → Em → Dm → F
        "Acceptance": [[48, 52, 55], [43, 47, 50], [57, 60, 64], [53, 57, 60]]  # Cmaj7 → G → Am → F
    }
    progression = progressions[stage]

    # Define melody motifs for each stage (fixed repeating patterns)
    motifs = {
        "Denial": [60, 62, 64, 62],  # Soft, rising and falling notes
        "Anger": [63, 62, 60, 62],  # Intense, minor key focus
        "Bargaining": [67, 65, 64, 65],  # Reflective and cyclical
        "Depression": [60, 59, 57, 59],  # Descending notes
        "Acceptance": [60, 62, 64, 67]   # Ascending, peaceful resolution
    }
    motif = motifs[stage]

    # Calculate total beats based on duration
    beats_per_minute = bpm
    beats_per_bar = 4  # Each bar has 4 beats
    bars_per_minute = beats_per_minute / beats_per_bar
    total_bars = int(bars_per_minute * duration_minutes)

    # Generate music with fixed patterns
    current_time = 0
    for bar in range(total_bars):
        # Play the current chord
        chord = progression[bar % len(progression)]  # Cycle through the chord progression
        for note in chord:
            track.append(Message('note_on', note=note, velocity=50, time=current_time))
            track.append(Message('note_off', note=note, velocity=50, time=current_time + 360))  # Hold chord for 3/4 beat

        # Play a note from the motif
        melody_note = motif[bar % len(motif)]
        track.append(Message('note_on', note=melody_note, velocity=40, time=current_time + 240))
        track.append(Message('note_off', note=melody_note, velocity=40, time=current_time + 480))

        current_time += 480  # Move to the next bar

    # Add a resolving ending chord that matches the start
    resolving_chord = progression[0]  # Match the first chord
    for note in resolving_chord:
        track.append(Message('note_on', note=note, velocity=50, time=current_time))
        track.append(Message('note_off', note=note, velocity=50, time=current_time + 960))  # Hold longer for resolution

    # Save the MIDI file
    mid.save(output_file)
    print(f"MIDI for {stage} saved as {output_file}")

# Generate MIDI files for all stages of grief
stages = ["Denial", "Anger", "Bargaining", "Depression", "Acceptance"]
for stage in stages:
    output_filename = f"{stage.lower()}_stage_structured.mid"
    create_midi_for_stage(stage, output_filename)
