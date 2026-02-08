"use client";

type Props = {
  muted: boolean;
  onToggleMute: () => void;
  onCopyLink: () => void;
  onTogglePlay: () => void;
  playing: boolean;
};

function Btn({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full rounded-2xl bg-doom-panel/75 px-3 py-3
        text-left shadow-hud ring-1 ring-doom-steel/20 backdrop-blur
        transition hover:bg-doom-panel2/80 active:scale-[0.99]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold tracking-[0.22em] text-doom-steel">
          {label}
        </div>
        <div className="h-2 w-2 rounded-full bg-doom-red/80 shadow-[0_0_14px_rgba(225,6,0,0.55)]" />
      </div>
      {sub && <div className="mt-1 text-[10px] text-doom-steel/65">{sub}</div>}
    </button>
  );
}

export default function DoomActionHud({
  muted,
  onToggleMute,
  onCopyLink,
  onTogglePlay,
  playing,
}: Props) {
  return (
    <div className="flex w-[170px] flex-col gap-2">
      <Btn label={playing ? "PAUSE" : "PLAY"} sub="toggle stream" onClick={onTogglePlay} />
      <Btn label={muted ? "UNMUTE" : "MUTE"} sub="audio routing" onClick={onToggleMute} />
      <Btn label="COPY LINK" sub="share target" onClick={onCopyLink} />
    </div>
  );
}
