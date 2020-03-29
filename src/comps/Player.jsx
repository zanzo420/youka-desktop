import React, { useRef, useEffect } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function Player({ youtubeID, videoURL, captionsURL }) {
  if (!videoURL) return null;

  const playerRef = useRef();
  const videoRef = useRef();
  const captionsRef = useRef();

  useEffect(() => {
    const plyrOptions = {
      controls: ["play-large", "play", "progress", "volume", "fullscreen"],
      captions: {
        active: true,
        language: "en"
      }
    };
    playerRef.current = new Plyr("#player", plyrOptions);
  }, []);

  useEffect(() => {
    (async function () {
      if (!videoURL) return;
      const currVideoURL = videoRef.current.getAttribute("src");
      const isSame = currVideoURL && currVideoURL.includes(youtubeID);
      const currentTime = playerRef.current.currentTime;
      videoRef.current.setAttribute("src", videoURL);
      await playerRef.current.play();
      if (isSame) {
        playerRef.current.currentTime = currentTime;
      }
    })();
  }, [videoURL]);

  useEffect(() => {
    if (captionsURL) {
      captionsRef.current.setAttribute("src", captionsURL);
    } else {
      const blob = new Blob(
        [
          "WEBVTT\n\n00:00:00.000 --> 01:00:00.000\nsynced lyrics are unavailable\n"
        ],
        {
          type: "text/vtt"
        }
      );
      const url = URL.createObjectURL(blob);
      captionsRef.current.setAttribute("src", url);
    }
  }, [captionsURL]);

  return (
    <video
      controls
      playsInline
      width="480"
      height="360"
      id="player"
      crossOrigin="true"
      ref={videoRef}
      type="video/mp4"
      className="object-cover"
      preload="auto"
    >
      <track default kind="captions" srcLang="en" ref={captionsRef} />
    </video>
  );
}
