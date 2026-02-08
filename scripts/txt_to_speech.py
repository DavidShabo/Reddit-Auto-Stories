import os
import subprocess
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play

INPUT_AUDIO = "output/audio.mp3"
OUTPUT_AUDIO = "output/audio_fast.mp3"

load_dotenv()

api_key = os.getenv("ELEVEN_API_KEY")
client = ElevenLabs(api_key=api_key)

os.makedirs("output", exist_ok=True)

with open("output/story.txt", "r", encoding="utf-8") as f:
    text = f.read().replace("\n", " ").strip()

audio_stream = client.text_to_speech.convert(
    text=text,
    voice_id="pNInz6obpgDQGcFmaJgB",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

with open("output/audio.mp3", "wb") as f:
    for chunk in audio_stream:
        f.write(chunk)
        
subprocess.run([
    "ffmpeg", "-y",
    "-i", INPUT_AUDIO,
    "-filter:a", "atempo=1.8",
    OUTPUT_AUDIO
], check=True)
