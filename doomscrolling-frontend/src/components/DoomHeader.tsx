export default function DoomHeader() {
  return (
    <>
      {/* RED LINE BEHIND VIDEO */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-0">
        <div className="mt-3 h-[2px] w-full bg-doom-red/70 shadow-[0_0_20px_rgba(225,6,0,0.6)]" />
      </div>

      {/* HEADER CONTENT ABOVE VIDEO */}
      <header className="pointer-events-none fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-doom-red shadow-[0_0_16px_rgba(225,6,0,0.8)]" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.25em] text-doom-steel">
                DOOMSCROLLING
              </div>
              <div className="text-xs text-doom-steel/70">Scroll • Doom • Repeat</div>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <div className="rounded-xl bg-doom-panel/80 px-3 py-2 text-xs text-doom-warn shadow-hud backdrop-blur">
              FEED: ACTIVE
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
