import "../lib/sentry"
import React from "react";
import Shell, { PLAYLIST_TRENDING } from "../comps/Shell"
import { usePageView } from "../lib/hooks"

export default function HomePage() {
  usePageView()

  return (
    <Shell defaultPlaylist={PLAYLIST_TRENDING} />
  )
}