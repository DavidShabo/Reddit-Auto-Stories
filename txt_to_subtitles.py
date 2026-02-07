from pathlib import Path

INPUT_TXT = "output/story.txt"
OUTPUT_SRT = "output/subtitles.srt"
TOTAL_DURATION = 60.0 

lines = [
    line.strip()
    for line in Path(INPUT_TXT).read_text(encoding="utf-8", errors="ignore").splitlines()
    if line.strip()
]

if not lines:
    raise ValueError(f"No non-empty lines found in {INPUT_TXT}")

step = TOTAL_DURATION / len(lines)

def ts(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

with open(OUTPUT_SRT, "w", encoding="utf-8") as f:
    for i, text in enumerate(lines):
        start = i * step
        end = min((i + 1) * step, TOTAL_DURATION)
        f.write(f"{i+1}\n")
        f.write(f"{ts(start)} --> {ts(end)}\n")
        f.write(f"{text}\n\n")

print(f"Generated {OUTPUT_SRT} (60 seconds)")
