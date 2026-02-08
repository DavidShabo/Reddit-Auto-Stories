import subprocess
import os

INPUT_AUDIO = "output/audio.wav"
OUTPUT_AUDIO = "output/audio_fast.wav"

os.makedirs("output", exist_ok=True)

subprocess.run([
    "ffmpeg", "-y",
    "-i", INPUT_AUDIO,
    "-filter:a", "atempo=1.5",
    OUTPUT_AUDIO
], check=True)
