import subprocess
import random
import os

AUDIO_FILE = "output/audio_fast.mp3" 
BACKGROUND_VIDEO = "backgrounds/background1.mp4"
OUTPUT_VIDEO = r"C:\Users\dvdsh\Downloads\Reddit Auto Stories\doomscrolling-frontend\public\videos\final.mp4"
SRT_FILE = "output/subtitles.srt"

def get_duration(path: str) -> float:
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        path
    ]
    return float(subprocess.check_output(cmd).decode().strip())

def render_video():
    audio_duration = get_duration(AUDIO_FILE)
    video_duration = get_duration(BACKGROUND_VIDEO)

    if audio_duration >= video_duration:
        raise ValueError("Audio is longer than background video")

    max_start = video_duration - audio_duration
    start_time = random.uniform(0, max_start)
    print(f"Audio: {audio_duration:.2f}s")
    print(f"Video start: {start_time:.2f}s")

    cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(start_time),
        "-i", BACKGROUND_VIDEO,
        "-i", AUDIO_FILE,
        "-t", str(audio_duration),
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-vf",
        f"subtitles={SRT_FILE}:force_style='FontName=Arial,FontSize=12,Outline=2,Shadow=1,MarginV=60'",
        "-c:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        OUTPUT_VIDEO
    ]


    subprocess.run(cmd, check=True)

if __name__ == "__main__":
    render_video()
