"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Update the state with the current value
    const listener = () => setMatches(media.matches)

    // Set the initial value
    setMatches(media.matches)

    // Add the listener
    media.addEventListener("change", listener)

    // Remove the listener on cleanup
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

