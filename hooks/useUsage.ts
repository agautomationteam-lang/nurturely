"use client";

import { useEffect, useState } from "react";

export function useUsage() {
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const response = await fetch("/api/usage");
    if (response.ok) {
      const data = await response.json();
      setUsed(data.used);
      setLimit(data.limit);
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return { used, limit, loading, refresh };
}
