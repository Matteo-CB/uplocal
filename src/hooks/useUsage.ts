"use client";

import { useState, useEffect, useCallback } from "react";
import type { UsageStatus } from "@/types";

export function useUsage() {
  const [status, setStatus] = useState<UsageStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/usage/check");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // User may not be authenticated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const checkBeforeUpscale = useCallback(async (): Promise<UsageStatus | null> => {
    const res = await fetch("/api/usage/check");
    if (res.ok) {
      const data = await res.json();
      setStatus(data);
      return data;
    }
    return null;
  }, []);

  const recordUpscale = useCallback(
    async (data: {
      scale: number;
      inputWidth: number;
      inputHeight: number;
      outputWidth: number;
      outputHeight: number;
      inputFormat: string;
      outputFormat: string;
      processingTime: number;
    }) => {
      try {
        await fetch("/api/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        await fetchStatus();
      } catch {
        // Non-critical, don't block the user
      }
    },
    [fetchStatus]
  );

  return { status, loading, checkBeforeUpscale, recordUpscale };
}
