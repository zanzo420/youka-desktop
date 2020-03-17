import "../lib/sentry"
import React from "react";
import Shell, { PLAYLIST_TRENDING } from "../comps/Shell"
import { useScreenView } from "../lib/hooks"

export default function HomePage() {
  useScreenView("Home")

  return (
    <Shell defaultPlaylist={PLAYLIST_TRENDING} />
  )
}