import re
import time
import feedparser
import requests

SUBREDDIT = "AmItheAsshole"   
RSS_LIMIT = 20
MIN_CHARS = 600
MAX_CHARS = 2500

HEADERS = {
    "User-Agent": "reddit-rss-story-bot/0.1 (contact: dev@example.com)"
}

BLACKLIST_TITLE_KEYWORDS = [
    "monthly",
    "open forum",
    "meta",
    "megathread",
    "announcement",
    "discussion",
    "weekly",
]

def extract_post_id(url: str):
    m = re.search(r"/comments/([a-z0-9]+)/", url)
    return m.group(1) if m else None

def fetch_post_body(post_id: str):
    url = f"https://www.reddit.com/comments/{post_id}.json"
    r = requests.get(url, headers=HEADERS, timeout=15)

    if r.status_code == 429:
        # Back off if rate-limited
        time.sleep(8)
        return None

    if r.status_code != 200:
        return None

    post = r.json()[0]["data"]["children"][0]["data"]
    body = (post.get("selftext") or "").strip()

    # Be polite to Reddit
    time.sleep(2)

    return body if body else None

def get_one_story():
    feed = feedparser.parse(f"https://www.reddit.com/r/{SUBREDDIT}/.rss")

    for entry in feed.entries[:RSS_LIMIT]:
        url = entry.link
        title = entry.title.strip()
    
        title_lower = title.lower()
        if any(k in title_lower for k in BLACKLIST_TITLE_KEYWORDS):
                continue

        post_id = extract_post_id(url)
        if not post_id:
            continue

        body = fetch_post_body(post_id)
        if not body:
            continue

        if not (MIN_CHARS <= len(body) <= MAX_CHARS):
            continue

        return {
            "id": post_id,
            "title": title,
            "body": body,
            "url": url,
        }

    return None

def save_story_txt(story: dict, path: str = "story.txt"):
 
    with open(path, "w", encoding="utf-8") as f:
        f.write(story["title"].strip() + "\n\n")
        f.write(story["body"].strip())

def save_story_meta(story: dict, path: str = "story_meta.txt"):

    with open(path, "w", encoding="utf-8") as f:
        f.write(f"id: {story['id']}\n")
        f.write(f"url: {story['url']}\n")

if __name__ == "__main__":
    story = get_one_story()

    if not story:
        print("No valid story found.")
    else:
        save_story_txt(story, "story.txt")
        save_story_meta(story, "story_meta.txt")
        print("Saved story.txt and story_meta.txt")
        print("Title:", story["title"])
        print("Chars:", len(story["body"]))
        print("URL:", story["url"])
