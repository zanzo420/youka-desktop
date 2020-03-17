import "../lib/sentry"
import React from "react";
import Shell, { PLAYLIST_TRENDING } from "../comps/Shell"

export default function HomePage() {
  return (
    <Shell defaultPlaylist={PLAYLIST_TRENDING} />
  )
}