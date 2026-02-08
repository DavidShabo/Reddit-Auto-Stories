from pathlib import Path
import subprocess
import re

INPUT_TXT = "output/story.txt"
AUDIO_FILE = "output/audio_fast.wav"
OUTPUT_SRT = "output/subtitles.srt"

MAX_WORDS = 3
MIN_DUR = 0.18
MAX_DUR = 0.85

def get_duration(path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        path
    ]
    return float(subprocess.check_output(cmd).decode().strip())

def ts(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int(round((seconds - int(seconds)) * 1000))
    if ms == 1000:
        s += 1
        ms = 0
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

def chunk(words, n):
    return [" ".join(words[i:i+n]) for i in range(0, len(words), n)]

raw = Path(INPUT_TXT).read_text(encoding="utf-8", errors="ignore")
raw = raw.replace("\n", " ").strip()
words = re.findall(r"\S+", raw)
if not words:
    raise ValueError("No words found in story.txt")

chunks = chunk(words, MAX_WORDS)

total = get_duration(AUDIO_FILE)

weights = [max(1, len(c)) for c in chunks]
w_sum = sum(weights)

durations = []
for w in weights:
    d = total * (w / w_sum)
    d = max(MIN_DUR, min(MAX_DUR, d))
    durations.append(d)

scale = total / sum(durations)
durations = [d * scale for d in durations]

t = 0.0
with open(OUTPUT_SRT, "w", encoding="utf-8") as f:
    for i, text in enumerate(chunks, start=1):
        start = t
        end = min(t + durations[i-1], total)
        f.write(f"{i}\n")
        f.write(f"{ts(start)} --> {ts(end)}\n")
        f.write(f"{text}\n\n")
        t = end

print(f"Wrote {OUTPUT_SRT} ({len(chunks)} captions) for {total:.2f}s audio")
