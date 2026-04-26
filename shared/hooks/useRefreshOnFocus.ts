"use client"

import { useEffect, useRef } from "react"

type UseRefreshOnFocusOptions = {
  enabled?: boolean
  cooldownMs?: number
  refresh: () => Promise<void> | void
}

const DEFAULT_COOLDOWN_MS = 15_000

export function useRefreshOnFocus({
  enabled = true,
  cooldownMs = DEFAULT_COOLDOWN_MS,
  refresh,
}: UseRefreshOnFocusOptions) {
  const lastRunAtRef = useRef(0)
  const isRefreshingRef = useRef(false)
  const refreshRef = useRef(refresh)

  useEffect(() => {
    refreshRef.current = refresh
  }, [refresh])

  useEffect(() => {
    if (!enabled) {
      return
    }

    async function runRefresh() {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return
      }

      const now = Date.now()
      if (now - lastRunAtRef.current < cooldownMs) {
        return
      }

      if (isRefreshingRef.current) {
        return
      }

      isRefreshingRef.current = true

      try {
        await refreshRef.current()
        lastRunAtRef.current = Date.now()
      } finally {
        isRefreshingRef.current = false
      }
    }

    function handleFocus() {
      void runRefresh()
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void runRefresh()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [cooldownMs, enabled])
}
