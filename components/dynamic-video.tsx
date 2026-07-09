"use client";

type DynamicVideoProps = {
  url: string;
};

export function DynamicVideo({ url }: DynamicVideoProps) {
  if (!url) return null;

  // Helper to parse video URLs
  const parseVideo = (videoUrl: string) => {
    // YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const ytMatch = videoUrl.match(ytRegex);
    if (ytMatch) return { type: "youtube", id: ytMatch[1] };

    // YouTube Cookie-less embeds
    const ytncRegex = /youtube-nocookie\.com\/embed\/([^"&?\/ ]{11})/;
    const ytncMatch = videoUrl.match(ytncRegex);
    if (ytncMatch) return { type: "youtube", id: ytncMatch[1] };

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    if (vimeoMatch) return { type: "vimeo", id: vimeoMatch[1] };

    // Dailymotion
    const dmRegex = /(?:dailymotion\.com\/(?:video|embed\/video)\/|dai\.ly\/)([a-zA-Z0-9]+)/;
    const dmMatch = videoUrl.match(dmRegex);
    if (dmMatch) return { type: "dailymotion", id: dmMatch[1] };

    return { type: "native", url: videoUrl };
  };

  const video = parseVideo(url);

  return (
    <div className="relative w-full overflow-hidden bg-black aspect-video rounded-2xl">
      {video.type === "youtube" && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=0&controls=1&rel=0&modestbranding=1&fs=1&iv_load_policy=3&showinfo=0`}
          title="YouTube Video Player"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {video.type === "vimeo" && (
        <iframe
          src={`https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0`}
          title="Vimeo Video Player"
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}

      {video.type === "dailymotion" && (
        <iframe
          src={`https://www.dailymotion.com/embed/video/${video.id}?queue-autoplay-next=0&queue-enable-on-screen=0`}
          title="Dailymotion Video Player"
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}

      {video.type === "native" && (
        <video
          src={video.url}
          controls
          controlsList="nodownload"
          className="h-full w-full object-contain"
          preload="metadata"
        >
          Tu navegador no soporta la reproducción de video HTML5.
        </video>
      )}
    </div>
  );
}
