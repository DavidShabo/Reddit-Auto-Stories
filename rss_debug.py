import feedparser

SUBREDDIT = "AmItheAsshole"

feed = feedparser.parse(f"https://www.reddit.com/r/{SUBREDDIT}/.rss")

for i, entry in enumerate(feed.entries):
    print(f"\n--- Entry {i} ---")
    print("Title:", entry.title)
    print("Link:", entry.link)
