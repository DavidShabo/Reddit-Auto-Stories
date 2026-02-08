import DoomHeader from "@/components/DoomHeader";
import VideoFeed from "@/components/VideoFeed";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-doom-bg">
      <DoomHeader />
      <VideoFeed />
    </main>
  );
}
